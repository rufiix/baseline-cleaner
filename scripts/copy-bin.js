import fs from 'fs/promises';
import path from 'path';

// Używamy jednej, spójnej nazwy zmiennej: sourcePath
const sourcePath = 'bin/run.js';
const destDir = 'dist/bin';
const destPath = path.join(destDir, 'run.js');

async function copyRunner() {
  try {
    await fs.mkdir(destDir, { recursive: true });
    // Upewniamy się, że używamy tej samej nazwy zmiennej
    await fs.copyFile(sourcePath, destPath);
    console.log(`Successfully copied ${sourcePath} to ${destPath}`);
  } catch (err) {
    console.error(`Error while copying runner script: ${err}`);
    process.exit(1);
  }
}

copyRunner();