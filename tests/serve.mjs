import { cp, mkdtemp, symlink, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer } from "node:http";
import { spawn } from "node:child_process";

// Test an explicit source snapshot so local dotenv files can never connect tests to production Redis.
const root = resolve(import.meta.dirname, "..");
const directory = await mkdtemp(join(tmpdir(), "letmechatgptthat-preview-"));
const build = process.argv.includes("--build");
for (const file of [
  "src",
  "package.json",
  "bun.lock",
  "next.config.ts",
  "tsconfig.json",
  "tailwind.config.ts",
  "postcss.config.mjs",
  "eslint.config.mjs",
]) {
  await cp(join(root, file), join(directory, file), { recursive: true });
}
await symlink(
  join(root, "node_modules"),
  join(directory, "node_modules"),
  "dir"
);

// Stub only the external navigation boundary in the disposable preview, including manual checks.
// Builds use the unmodified production source.
if (!build) {
  const path = join(directory, "src/components/AnimationView.tsx");
  const source = await readFile(path, "utf8");
  if (!source.includes("window.location.assign"))
    throw new Error("Redirect fixture could not find the navigation boundary");
  await writeFile(
    path,
    source.replace(
      "window.location.assign",
      "((url: string) => { document.documentElement.dataset.testRedirect = url; })"
    )
  );
}

const values = new Map([
  ["short:fixture", JSON.stringify("Why is the sky blue?")],
]);
const redis = createServer(async (request, response) => {
  try {
    let body = "";
    for await (const chunk of request) body += chunk;
    const input = JSON.parse(body);
    const execute = ([operation, key, value]) => {
      let result = null;
      switch (operation.toLowerCase()) {
        case "get":
          result = values.get(key) ?? null;
          break;
        case "exists":
          result = values.has(key) ? 1 : 0;
          break;
        case "set":
          values.set(key, value);
          result = "OK";
          break;
        default:
          throw new Error("Unsupported fixture command: " + operation);
      }
      if (typeof result === "string" && result !== "OK")
        result = Buffer.from(result).toString("base64");
      return { result };
    };
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify(
        Array.isArray(input[0]) ? input.map(execute) : execute(input)
      )
    );
  } catch (error) {
    response.writeHead(500);
    response.end(JSON.stringify({ error: String(error) }));
  }
});
await new Promise((done) => redis.listen(0, "127.0.0.1", done));
const port = redis.address().port;
console.log("Isolated app snapshot:", directory);
const child = spawn(
  process.execPath,
  [
    join(root, "node_modules/next/dist/bin/next"),
    ...(build
      ? ["build"]
      : ["dev", "--hostname", "127.0.0.1", "--port", "4173"]),
  ],
  {
    cwd: directory,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
      UPSTASH_REDIS_REST_URL: "http://127.0.0.1:" + port,
      UPSTASH_REDIS_REST_TOKEN: "local-test-fixture",
      NEXT_PUBLIC_BASE_URL: "http://127.0.0.1:4173",
    },
  }
);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("exit", (code) => {
  redis.close();
  process.exitCode = code ?? 1;
});
