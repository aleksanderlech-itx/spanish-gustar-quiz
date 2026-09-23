// Prints broad usage stats from the D1 `quiz_progress` table as Markdown (or JSON).
//
//   npm run stats:usage -- --database <d1-database-name>   # queries remote D1 via wrangler
//   npm run stats:usage -- --file rows.json                # reads a saved `wrangler d1 execute --json` result
//   add --json for machine-readable output
//
// Only `payload` and `updated_at` are selected; emails never leave the database.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { formatUsageMarkdown, summarizeUsage, type ProgressRow } from "./usage-stats-lib.ts";

const QUERY = "SELECT payload, updated_at FROM quiz_progress";

const args = process.argv.slice(2);
const option = (name: string) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

const database = option("--database");
const file = option("--file");
if (!database === !file) {
  console.error("Usage: npm run stats:usage -- (--database <d1-database-name> | --file <rows.json>) [--json]");
  process.exit(64);
}

const raw = file
  ? readFileSync(file, "utf8")
  : execFileSync("npx", ["wrangler", "d1", "execute", database!, "--remote", "--json", "--command", QUERY], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });

// `wrangler d1 execute --json` wraps rows as [{ results: [...] }]; a bare row array works too.
const parsed = JSON.parse(raw) as unknown;
const rows: ProgressRow[] = Array.isArray(parsed) && parsed.every((item) => item && typeof item === "object" && "results" in item)
  ? parsed.flatMap((item) => (item as { results: ProgressRow[] }).results)
  : (parsed as ProgressRow[]);

const stats = summarizeUsage(rows);
process.stdout.write(args.includes("--json") ? `${JSON.stringify(stats, null, 2)}\n` : formatUsageMarkdown(stats));
