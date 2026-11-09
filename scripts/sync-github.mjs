#!/usr/bin/env node
/**
 * Refresh src/content/github-snapshot.json public repo stats from the GitHub API.
 * Achievements are not fully available via REST — keep them curated; this script
 * only updates publicRepos + publicRepoCount + syncedAt.
 *
 * Usage: node scripts/sync-github.mjs
 * Optional: GITHUB_TOKEN for higher rate limits.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const snapshotPath = join(root, "src/content/github-snapshot.json");
const USER = "rmanish2000-del";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "aiworkspace-hq-web-sync",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const res = await fetch(
  `https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=updated`,
  { headers },
);
if (!res.ok) {
  console.error("GitHub API error", res.status, await res.text());
  process.exit(1);
}
const repos = await res.json();
const publicRepos = repos
  .filter((r) => !r.private && !r.fork)
  .map((r) => ({
    name: r.name,
    url: r.html_url,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    homepage: r.homepage || null,
    pushedAt: r.pushed_at,
  }));

const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
snapshot.publicRepos = publicRepos;
snapshot.publicRepoCount = publicRepos.length;
snapshot.syncedAt = new Date().toISOString();
writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n");
console.log(
  `Updated ${snapshotPath}: ${publicRepos.length} public repos @ ${snapshot.syncedAt}`,
);
