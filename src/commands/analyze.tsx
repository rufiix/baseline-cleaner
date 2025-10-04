import { Command } from '@oclif/core';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as parser from '@babel/parser';
import { glob } from 'glob';
import * as features from 'web-features';
import React from 'react';
import { render } from 'ink';
import { Report } from '../ui/Report.js';


import type { ImportDeclaration } from '@babel/types';
import 'whatwg-fetch'; // Test import

async function isLibraryImported(ast: parser.ParseResult<any>, libraryName: string): Promise<boolean> {
  let found = false;

  // Ufamy naszej inspekcji środowiska uruchomieniowego i używamy 'as any',
  // aby ominąć błędne definicje typów.
  const traverse = ((await import('@babel/traverse')) as any).default.default;

  traverse(ast, {
    // Dla uproszczenia tutaj też użyjemy 'any', aby uniknąć dalszych problemów z typami
    ImportDeclaration(path: any) {
      if (path.node.source.value === libraryName) {
        found = true;
        path.stop();
      }
    },
  });

  return found;
}

async function findSourceFiles(rootDir: string): Promise<string[]> {
  const pattern = '**/*.{js,ts,jsx,tsx}';
  const files = await glob(pattern, {
    cwd: rootDir,
    ignore: 'node_modules/**',
    absolute: true,
  });
  return files;
}

export default class Analyze extends Command {
  static override description = 'Analyzes the project for replaceable libraries';

  public async run(): Promise<void> {
 
    const projectRoot = process.cwd();

    try {
      const packageJsonPath = path.join(projectRoot, 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
    const mapPath = path.join(this.config.root, 'dist', 'library-map.json');
      const mapContent = await fs.readFile(mapPath, 'utf-8');
      const libraryMap = JSON.parse(mapContent);
      const projectDependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const suspects = Object.keys(projectDependencies).filter(dep => dep in libraryMap);
if (suspects.length === 0) {
  render(<Report recommendations={[]} />);
  return;
}

      const sourceFiles = await findSourceFiles(projectRoot);
      const usedSuspects = new Set<string>();
      for (const file of sourceFiles) {
        const code = await fs.readFile(file, 'utf-8');
        const ast = parser.parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx'], errorRecovery: true });
        for (const suspect of suspects) {
          if (usedSuspects.has(suspect)) continue;
          // No await needed here anymore
          if (await isLibraryImported(ast, suspect)) {
            usedSuspects.add(suspect);
          }
        }
      }

      const recommendations: any[] = [];
      if (usedSuspects.size > 0) {
        for (const usedLib of usedSuspects) {
          const libInfo = libraryMap[usedLib as keyof typeof libraryMap];
          const featureId = libInfo.featureId;
          const featureData = (features as any).features[featureId];
          const baselineStatus = featureData?.status?.baseline ?? 'unknown';
          recommendations.push({
            library: usedLib,
            feature: libInfo.label,
            baselineStatus: baselineStatus,
            isRemovable: baselineStatus === 'high',
          });
        }
      }

      render(<Report recommendations={recommendations} />);
    } catch (error) {
      this.error(error as Error);
    }
  }
}