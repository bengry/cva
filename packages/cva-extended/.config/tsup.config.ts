import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts", "./src/utils/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  target: "es2020",
  tsconfig: "./.config/tsconfig.build.json",
});
