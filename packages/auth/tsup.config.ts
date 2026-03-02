import { defineConfig } from "tsup";

export default defineConfig([
  // =========================
  // CLIENT BUILD (React)
  // =========================
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    // Garante que o bundle seja marcado como client component para Next.js App Router
    banner: { js: "'use client';" },
    external: [
      "react",
      "react-dom",
      "next",
      "@supabase/supabase-js",
      "@supabase/ssr"
    ]
  },

  // =========================
  // SERVER BUILD (Edge-safe)
  // =========================
  {
    entry: { server: "src/server.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: false, // importante: não limpar o build do client
    splitting: false,
    platform: "neutral", // 🔥 importante para edge runtime
    target: "es2022",
    external: [
      "react",
      "react-dom",
      "next",
      "@supabase/supabase-js",
      "@supabase/ssr"
    ]
  }
]);