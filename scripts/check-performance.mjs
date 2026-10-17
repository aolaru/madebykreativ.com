import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import config from "../lighthouse.config.mjs";

const base = process.env.PERFORMANCE_URL || "http://127.0.0.1:4340";
let server;
let chrome;
try {
  if (!process.env.PERFORMANCE_URL) {
    server = spawn(
      process.execPath,
      [
        "node_modules/astro/bin/astro.mjs",
        "preview",
        "--ignore-lock",
        "--host",
        "127.0.0.1",
        "--port",
        "4340",
      ],
      { stdio: "ignore" },
    );
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        if ((await fetch(base, { signal: AbortSignal.timeout(1000) })).ok) {
          ready = true;
          break;
        }
      } catch {}
      if (server.exitCode !== null)
        throw new Error("Performance preview server exited before startup");
      await delay(250);
    }
    if (!ready) throw new Error("Performance preview server did not start");
  }
  chrome = await launch({
    chromeFlags: [
      "--headless",
      "--disable-dev-shm-usage",
      ...(process.env.CI ? ["--no-sandbox"] : []),
    ],
  });
  await mkdir(".lighthouse", { recursive: true });
  const failures = [];
  for (const route of config.routes) {
    const result = await lighthouse(new URL(route, base).href, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: Object.keys(config.minimumScores),
    });
    if (!result || result.lhr.runtimeError)
      throw new Error(
        `${route}: ${result?.lhr.runtimeError?.message || "No Lighthouse result"}`,
      );
    await writeFile(
      `.lighthouse/${route.replaceAll("/", "-") || "home"}.json`,
      JSON.stringify(result.lhr),
    );
    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, category]) => [
        key,
        Math.round(category.score * 100),
      ]),
    );
    console.log(route, scores);
    for (const [key, minimum] of Object.entries(config.minimumScores))
      if (result.lhr.categories[key].score < minimum)
        failures.push(`${route}: ${key} ${scores[key]} < ${minimum * 100}`);
  }
  if (failures.length) throw new Error(failures.join("\n"));
} finally {
  await chrome?.kill();
  if (server && server.exitCode === null) {
    const stopped = new Promise((resolve) => server.once("exit", resolve));
    server.kill("SIGTERM");
    await stopped;
  }
}
