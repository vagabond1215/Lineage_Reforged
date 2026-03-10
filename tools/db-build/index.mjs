import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const BUILD_DIR = path.join(ROOT, "packages", "db", "build");
const MIGRATIONS_DIR = path.join(ROOT, "packages", "db", "migrations");

async function ensureBuildArtifacts() {
  await mkdir(BUILD_DIR, { recursive: true });

  const outputs = ["world.sqlite", "civilization.sqlite", "player.sqlite", "sim_view.sqlite"];

  for (const output of outputs) {
    const filePath = path.join(BUILD_DIR, output);
    await writeFile(filePath, "", { flag: "a" });
  }

  const migrations = (await readdir(MIGRATIONS_DIR)).filter((name) => name.endsWith(".sql")).sort();

  const manifest = {
    generatedAt: new Date().toISOString(),
    outputs,
    migrations,
    note: "Placeholder build artifacts. Wire actual JSON->SQLite compiler in next iteration."
  };

  await writeFile(path.join(BUILD_DIR, "build-manifest.json"), JSON.stringify(manifest, null, 2));

  console.log("db-build: generated placeholder artifacts", manifest);
}

ensureBuildArtifacts().catch((error) => {
  console.error("db-build: failed", error.message);
  process.exitCode = 1;
});