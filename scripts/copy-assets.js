import fs from 'fs/promises';
import path from 'path';


const assetsToCopy = [
  { from: 'bin/run.js', to: 'dist/bin/run.js' },
  { from: 'src/library-map.json', to: 'dist/library-map.json' },
];

async function copyAsset({ from, to }) {
  const destDir = path.dirname(to);
  
  await fs.mkdir(destDir, { recursive: true });
  
  await fs.copyFile(from, to);
  console.log(`Copied asset: ${from} -> ${to}`);
}

async function main() {
  try {
    for (const asset of assetsToCopy) {
      await copyAsset(asset);
    }
  } catch (err) {
    console.error('Error copying assets:', err);
    process.exit(1);
  }
}

main();