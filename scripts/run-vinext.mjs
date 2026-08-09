import { spawnSync } from "node:child_process";

const command = process.argv[2] ?? "dev";
const result = spawnSync(process.execPath, ["node_modules/vinext/dist/cli.js", command], {
  cwd: process.cwd(),
  env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
