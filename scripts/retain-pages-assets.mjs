import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const previousReleaseCount = 2;
const manifestName = 'pages-release-assets.json';
const viteAsset = /^assets\/[^/\\]+-[A-Za-z0-9_-]{8}\.(?!html?(?:\.|$))[A-Za-z0-9]+(?:\.map)?$/i;
const workboxAsset = /^workbox-[A-Za-z0-9_-]{8}\.js(?:\.map)?$/;
const [previousRelease, output = 'dist'] = process.argv.slice(2);
const assetsDirectory = path.join(output, 'assets');
const manifestPath = path.join(output, manifestName);

function git(args, encoding = 'utf8') {
  return execFileSync('git', args, { encoding, maxBuffer: 32 * 1024 * 1024 });
}

function isVersionedAsset(name) {
  return typeof name === 'string' && (viteAsset.test(name) || workboxAsset.test(name));
}

function readAssetNames(json, source) {
  const assets = JSON.parse(json);
  if (!Array.isArray(assets) || !assets.length || assets.some(name => !isVersionedAsset(name))) {
    throw new Error(`Invalid release asset manifest at ${source}`);
  }
  return assets;
}

function assetsForRelease(commit) {
  if (git(['ls-tree', commit, '--', manifestName]).trim()) {
    return readAssetNames(git(['show', `${commit}:${manifestName}`]), commit);
  }
  // Releases published before this step have only their own assets in the tree.
  return git(['ls-tree', '-rz', '--name-only', commit])
    .split('\0')
    .filter(isVersionedAsset);
}

const builtAssets = [
  ...readdirSync(assetsDirectory, { withFileTypes: true }).filter(entry => entry.isFile()).map(entry => `assets/${entry.name}`),
  ...readdirSync(output, { withFileTypes: true }).filter(entry => entry.isFile()).map(entry => entry.name),
].filter(isVersionedAsset);
if (!builtAssets.some(name => viteAsset.test(name))) throw new Error(`No built assets found in ${assetsDirectory}`);

// Record the fresh build before copying anything. A retry can still distinguish it from retained files.
const currentAssets = existsSync(manifestPath)
  ? readAssetNames(readFileSync(manifestPath, 'utf8'), manifestPath)
  : builtAssets.sort();
const builtSet = new Set(builtAssets);
if (currentAssets.some(name => !builtSet.has(name))) throw new Error(`Missing current assets in ${assetsDirectory}`);
writeFileSync(manifestPath, `${JSON.stringify(currentAssets)}\n`);

const releases = previousRelease
  ? git(['rev-list', '--first-parent', `--max-count=${previousReleaseCount}`, previousRelease, '--']).trim().split('\n')
  : [];
const retained = new Set(currentAssets);

// Run after Vite and Workbox, so the worker only precaches the fresh build.
for (const release of releases) {
  for (const name of assetsForRelease(release)) {
    if (retained.has(name)) continue;
    writeFileSync(path.join(output, name), git(['show', `${release}:${name}`], null));
    retained.add(name);
  }
}

console.log(`Retained ${retained.size - currentAssets.length} hashed assets from ${releases.length} previous Pages releases.`);
