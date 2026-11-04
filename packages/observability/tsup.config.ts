import { defineConfig } from "tsup";

// index e next: neutros (Edge da Vercel, middleware do Next). node: Express/Nest (res.on("finish"), sinais).
export default defineConfig([
  { entry: { index: "src/index.ts", next: "src/next.ts" }, format: ["esm", "cjs"], dts: true, sourcemap: true,
    clean: true, splitting: false, platform: "neutral", target: "es2022" },
  { entry: { node: "src/node.ts" }, format: ["esm", "cjs"], dts: true, sourcemap: true, clean: false,
    splitting: false, platform: "node", target: "node18" },
]);
