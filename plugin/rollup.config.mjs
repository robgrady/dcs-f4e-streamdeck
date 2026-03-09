import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import path from "node:path";
import { fileURLToPath } from "node:url";

const isWatching = !!process.env.ROLLUP_WATCH;

/** @type {import("rollup").RollupOptions} */
const config = {
  input: "src/plugin.ts",
  output: {
    file: "com.dcs.f4e.sdPlugin/bin/plugin.js",
    format: "esm",
    sourcemap: isWatching,
  },
  plugins: [
    {
      name: "watch-externals",
      buildStart() {
        // Watch the manifest for changes
        this.addWatchFile("com.dcs.f4e.sdPlugin/manifest.json");
      },
    },
    typescript({
      tsconfig: "tsconfig.json",
      mapRoot: isWatching
        ? "./"
        : undefined,
    }),
    resolve({
      preferBuiltins: true,
    }),
  ],
  external: ["@elgato/streamdeck", "node:dgram", "node:events", "node:buffer"],
};

export default config;
