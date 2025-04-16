import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"], // Ensure you're targeting CommonJS
    external: [
        "@elizaos/core",
        "dotenv", // Externalize dotenv to prevent bundling
        "fs", // Externalize fs to use Node.js built-in module
        "@goat-sdk/adapter-vercel-ai",
        "@goat-sdk/core",
        "@goat-sdk/wallet-viem",
        "@kaiachain/kaia-agent-kit",
        "path", // Externalize other built-ins if necessary
        "@reflink/reflink",
        "@node-llama-cpp",
        "https",
        "http",
        "agentkeepalive",
        "viem",
        "@lifi/sdk",
    ],
});