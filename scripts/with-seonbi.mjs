import { spawn } from "node:child_process";

const command = process.argv[2];
const args = process.argv.slice(3);

if (command == null) {
  console.error("Usage: node scripts/with-seonbi.mjs COMMAND [ARG ...]");
  process.exit(2);
}

const apiUrl = process.env.SEONBI_API_URL ?? "http://127.0.0.1:3800/";
let server;

async function isReady() {
  try {
    const response = await fetch(apiUrl, {
      method: "OPTIONS",
      signal: AbortSignal.timeout(500),
    });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitUntilReady() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (await isReady()) return;
    if (server?.exitCode != null) {
      throw new Error(`seonbi-api exited with status ${server.exitCode}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`seonbi-api did not become ready at ${apiUrl}`);
}

if (!(await isReady())) {
  const url = new URL(apiUrl);
  const executable = process.env.SEONBI_API ?? "seonbi-api";
  server = spawn(
    executable,
    ["--host", url.hostname, "--port", url.port || "80"],
    {
      stdio: ["ignore", "inherit", "inherit"],
    },
  );
  await waitUntilReady();
}

const keepsAstroInForeground =
  (command === "astro" && args[0] === "dev") ||
  (command === "netlify" && args[0] === "dev");
const child = spawn(command, args, {
  env: {
    ...process.env,
    SEONBI_API_URL: apiUrl,
    // Prevent Astro's agent detection from detaching the server Netlify supervises.
    ...(keepsAstroInForeground ? { ASTRO_DEV_BACKGROUND: "1" } : {}),
  },
  stdio: "inherit",
});

const forwardSignal = (signal) => child.kill(signal);
process.on("SIGINT", forwardSignal);
process.on("SIGTERM", forwardSignal);

const status = await new Promise((resolve, reject) => {
  child.on("error", reject);
  child.on("exit", (code, signal) => resolve({ code, signal }));
});

if (server != null) {
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ]);
}

if (status.signal != null) process.kill(process.pid, status.signal);
process.exit(status.code ?? 1);
