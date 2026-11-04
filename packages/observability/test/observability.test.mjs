// Testes do pacote contra o build (dist/). Rodar: npm test (faz o build antes).
import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import {
  clientIp, classify, parseIp, createLogger, geoFromHeaders, hashIp, httpEvent, loggerFromEnv, otlpSink, redact, toOtlpLogs,
  truncateIp,
} from "../dist/index.mjs";
import { observeRequest, withObservability } from "../dist/next.mjs";
import { requestLogger } from "../dist/node.mjs";

const H = (o) => new Headers(o);
const memSink = () => { const rows = []; return { rows, write: (r, res) => rows.push({ ...r, res }) }; };

test("redact troca segredos em qualquer nível e transforma Error", () => {
  const out = redact({ user: "a", password: "x", nested: { accessToken: "t", ok: 1 }, list: [{ apiKey: "k" }], err: new Error("boom") });
  assert.equal(out.password, "[redacted]");
  assert.equal(out.nested.accessToken, "[redacted]");
  assert.equal(out.nested.ok, 1);
  assert.equal(out.list[0].apiKey, "[redacted]");
  assert.equal(out.err.message, "boom");
});

test("logger respeita o nível e o child soma campos", () => {
  const s = memSink();
  const log = createLogger({ service: "svc", env: "test", level: "info", sinks: [s] });
  log.debug("não sai");
  log.child({ request_id: "r1" }).warn("sai", { cookie: "c" });
  assert.equal(s.rows.length, 1);
  assert.equal(s.rows[0].fields.request_id, "r1");
  assert.equal(s.rows[0].fields.cookie, "[redacted]");
});

test("clientIp confia só na borda da plataforma configurada", () => {
  const forged = H({ "x-vercel-forwarded-for": "6.6.6.6", "cf-connecting-ip": "6.6.6.6", "x-forwarded-for": "6.6.6.6, 1.2.3.4" });
  assert.equal(clientIp(forged, undefined, "proxy"), "1.2.3.4"); // último salto, o que o proxy acrescentou
  assert.equal(clientIp(H({ "x-real-ip": "1.2.3.4", "x-forwarded-for": "6.6.6.6" }), undefined, "proxy"), "1.2.3.4");
  assert.equal(clientIp(H({ "x-vercel-forwarded-for": "5.5.5.5" }), undefined, "vercel"), "5.5.5.5");
  assert.equal(clientIp(H({ "x-real-ip": "6.6.6.6" }), "::ffff:9.9.9.9", "direct"), "9.9.9.9");
  assert.equal(clientIp(H({ "x-real-ip": "<script>" }), undefined, "proxy"), undefined);
});

test("parseIp: estrito, com porta, colchetes, zona e ::", () => {
  assert.equal(parseIp("1.2.3.4:5678").text, "1.2.3.4");
  assert.equal(parseIp("[2001:db8::1]:443").text, "2001:db8:0:0:0:0:0:1");
  assert.equal(parseIp("fe80::1%eth0").text, "fe80:0:0:0:0:0:0:1");
  assert.equal(parseIp("::ffff:8.8.8.8").text, "8.8.8.8");
  for (const bad of ["999.1.1.1", "1.2.3", "abc", "1::2::3", "1:2:3:4:5:6:7:8:9", "", "2001:db8::zz"]) {
    assert.equal(parseIp(bad), undefined, bad);
  }
});

test("truncateIp e hashIp", async () => {
  assert.equal(truncateIp("200.150.10.7"), "200.150.10.0/24");
  assert.equal(truncateIp("2804:14c:65:1234::1"), "2804:14c:65::/48");
  assert.equal(truncateIp("::1"), "0:0:0::/48");
  assert.equal(truncateIp("10.0.0.1:8080"), "10.0.0.0/24");
  assert.equal(truncateIp("não-é-ip"), undefined);
  const a = await hashIp("1.2.3.4", "s"), b = await hashIp("1.2.3.4", "s"), c = await hashIp("1.2.3.4", "t");
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.match(a, /^[0-9a-f]{16}$/);
});

test("geo só da borda certa (header forjado fora da Vercel é ignorado)", () => {
  const h = H({ "x-vercel-ip-country": "BR", "x-vercel-ip-country-region": "SP", "x-vercel-ip-city": "S%C3%A3o%20Paulo" });
  assert.deepEqual(geoFromHeaders(h, "vercel"), { country: "BR", region: "SP", city: "São Paulo" });
  assert.deepEqual(geoFromHeaders(h, "proxy"), {});
  assert.deepEqual(geoFromHeaders(H({ "cf-ipcountry": "US" }), "cloudflare"), { country: "US" });
});

test("classify: crawler, ferramenta, varredura, navegador", () => {
  assert.equal(classify("Mozilla/5.0 (compatible; Googlebot/2.1)", "/").bot, "googlebot");
  assert.equal(classify("curl/8.5.0", "/").bot, "tool:curl");
  assert.equal(classify(null, "/").bot, "sem-user-agent");
  assert.equal(classify("Mozilla/5.0 (X11; Linux x86_64)", "/.env").scan, true);
  assert.equal(classify("Mozilla/5.0 (X11; Linux x86_64)", "/wp-login.php").scan, true);
  const iphone = classify("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148", "/planos");
  assert.deepEqual([iphone.is_bot, iphone.device, iphone.scan], [false, "mobile", false]);
});

test("httpEvent: sem query, ip conforme o modo, hash sem salt cai para truncate", async () => {
  const headers = H({ "x-real-ip": "200.1.2.3", "user-agent": "Mozilla/5.0 (Windows NT 10.0)", referer: "https://google.com/search?q=x" });
  const base = { method: "GET", host: "app.easygoal.com.br", path: "/login?token=abc", headers, status: 200, durationMs: 12.6, userId: "u1" };
  const full = await httpEvent(base, { ipMode: "full", platform: "proxy" });
  assert.equal(full.http_path, "/login");
  assert.equal(full.ip, "200.1.2.3");
  assert.equal(full.referer_host, "google.com");
  assert.equal(full.duration_ms, 13);
  const hashed = await httpEvent(base, { ipMode: "hash", ipSalt: "s" });
  assert.ok(hashed.ip_hash && !hashed.ip);
  const noSalt = await httpEvent(base, { ipMode: "hash" });
  assert.equal(noSalt.ip_prefix, "200.1.2.0/24");
  assert.equal(noSalt.ip_hash, undefined);
  assert.equal((await httpEvent(base, { ipMode: "none" })).ip_prefix, undefined);
});

test("OTLP: formato e envio em lote com headers", async () => {
  const calls = [];
  const fetch = async (url, init) => { calls.push({ url, init }); return new Response(null, { status: 200 }); };
  const sink = otlpSink({ endpoint: "http://gw/api/easygoal/v1/logs", authorization: "Basic abc", maxBatch: 2, fetch });
  const log = createLogger({ service: "svc", env: "prod", version: "abc1234", sinks: [sink] });
  log.info("um", { geo: { country: "BR" }, n: 1, f: 1.5, b: true });
  log.info("dois");
  log.error("três");
  await log.flush();
  assert.equal(calls.length, 2);
  assert.equal(calls[0].init.headers.authorization, "Basic abc");
  assert.equal(calls[0].init.headers["stream-name"], "svc");
  const body = JSON.parse(calls[0].init.body);
  const rec = body.resourceLogs[0].scopeLogs[0].logRecords[0];
  const attr = Object.fromEntries(rec.attributes.map((a) => [a.key, a.value]));
  assert.deepEqual(attr["geo.country"], { stringValue: "BR" });
  assert.deepEqual(attr.n, { intValue: "1" });
  assert.deepEqual(attr.f, { doubleValue: 1.5 });
  assert.deepEqual(attr.b, { boolValue: true });
  assert.equal(rec.severityText, "INFO");
  assert.match(rec.timeUnixNano, /^\d{19}$/);
  const resAttr = Object.fromEntries(body.resourceLogs[0].resource.attributes.map((a) => [a.key, a.value.stringValue]));
  assert.deepEqual(resAttr, { "service.name": "svc", "deployment.environment": "prod", "service.version": "abc1234" });
});

test("OTLP: falha de envio não lança e avisa no máximo uma vez", async () => {
  let errors = 0;
  const sink = otlpSink({ endpoint: "http://gw", fetch: async () => { throw new Error("down"); }, onError: () => errors++ });
  const log = createLogger({ service: "s", env: "e", sinks: [sink] });
  log.info("a");
  await log.flush();
  assert.equal(errors, 1);
});

test("OTLP: fila cheia descarta os mais antigos", async () => {
  const sink = otlpSink({ endpoint: "http://gw", maxBatch: 1000, maxQueue: 3, fetch: async () => new Response(null) });
  const log = createLogger({ service: "s", env: "e", sinks: [sink] });
  for (let i = 0; i < 5; i++) log.info(String(i));
  assert.equal(sink.dropped(), 2);
});

test("loggerFromEnv: só stdout sem endpoint; versão do commit da Vercel", () => {
  const log = loggerFromEnv({ env: { OBS_SERVICE: "app-front", VERCEL_ENV: "production", VERCEL_GIT_COMMIT_SHA: "0123456789" } });
  assert.deepEqual(log.resource, { service: "app-front", env: "production", version: "0123456" });
});

test("next: observeRequest usa waitUntil e pula estáticos", async () => {
  const s = memSink();
  const log = createLogger({ service: "s", env: "e", sinks: [s] });
  const pending = [];
  const ev = { waitUntil: (p) => pending.push(p) };
  process.env.VERCEL = "1";
  const req = (path) => ({ method: "GET", headers: H({ "x-vercel-ip-country": "BR", "user-agent": "Mozilla/5.0 (Macintosh)" }), url: `https://x.com${path}`, nextUrl: { pathname: path } });
  observeRequest(log, req("/_next/static/a.js"), ev);
  observeRequest(log, req("/planos"), ev, { userId: "u9" });
  await Promise.all(pending);
  assert.equal(s.rows.length, 1);
  assert.equal(s.rows[0].fields.http_path, "/planos");
  assert.equal(s.rows[0].fields.user_id, "u9");
  assert.equal(s.rows[0].fields.geo.country, "BR");
  delete process.env.VERCEL;
});

test("next: withObservability registra status e relança erro", async () => {
  const s = memSink();
  const log = createLogger({ service: "s", env: "e", sinks: [s] });
  const tasks = [];
  const after = (t) => tasks.push(t());
  const ok = withObservability(log, async () => new Response("x", { status: 404 }), { after });
  assert.equal((await ok(new Request("https://x.com/api/a?secret=1"))).status, 404);
  const bad = withObservability(log, async () => { throw new Error("falhou"); }, { after });
  await assert.rejects(bad(new Request("https://x.com/api/b")), /falhou/);
  await Promise.all(tasks);
  assert.equal(s.rows[0].level, "warn");
  assert.equal(s.rows[0].fields.http_status, 404);
  assert.equal(s.rows[0].fields.http_path, "/api/a");
  assert.equal(s.rows[1].msg, "http.error");
  assert.equal(s.rows[1].fields.err.message, "falhou");
});

test("node: requestLogger registra no finish com status, latência e usuário; pula health", async () => {
  const s = memSink();
  const log = createLogger({ service: "s", env: "e", sinks: [s] });
  const mw = requestLogger(log, { userId: (r) => r.user?.id, ipMode: "full", platform: "direct" });
  const run = (url, status, method = "POST") => new Promise((resolve) => {
    const res = Object.assign(new EventEmitter(), { statusCode: status });
    const req = { method, url, headers: { "user-agent": "okhttp/4.9", host: "api.x" }, socket: { remoteAddress: "::ffff:8.8.8.8" } };
    mw(req, res, () => { req.user = { id: "u1" }; res.emit("finish"); res.emit("close"); setTimeout(resolve, 20); });
  });
  await run("/auth/login?x=1", 401);
  await run("/health", 200, "GET");
  assert.equal(s.rows.length, 1);
  const f = s.rows[0].fields;
  assert.deepEqual([s.rows[0].level, f.http_status, f.http_path, f.user_id, f.ip, f.bot], ["warn", 401, "/auth/login", "u1", "8.8.8.8", "tool:okhttp"]);
});

test("toOtlpLogs é JSON puro (sem BigInt)", () => {
  assert.doesNotThrow(() => JSON.stringify(toOtlpLogs([{ ts: 1, level: "info", msg: "m", fields: {} }], { service: "s", env: "e" })));
});
