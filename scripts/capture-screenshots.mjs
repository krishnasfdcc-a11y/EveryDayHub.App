#!/usr/bin/env node
/**
 * Capture README preview screenshots from live EverydayHub surfaces.
 * Run: node scripts/capture-screenshots.mjs
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const playwrightEntry = path.resolve(__dirname, '../../CSVStudio/node_modules/playwright/index.mjs');
const { chromium } = await import(pathToFileURL(playwrightEntry).href);
const outDir = path.resolve(__dirname, '../screenshots');

const SHOTS = [
  { file: 'dataforge-csv.png', url: 'https://everydayhub.app/DataForge/', wait: 2500 },
  { file: 'dataforge-mock-data.png', url: 'https://everydayhub.app/DataForge/generator', wait: 2500 },
  { file: 'tools-portal.png', url: 'https://tools.everydayhub.app/', wait: 2000 },
  {
    file: 'passport-photo-maker.png',
    url: 'https://tools.everydayhub.app/passport-photo-maker/',
    wait: 2000,
  },
  {
    file: 'background-remover.png',
    url: 'https://tools.everydayhub.app/background-remover/',
    wait: 2000,
  },
  {
    file: 'ai-background-remover-widget.png',
    url: 'https://tools.everydayhub.app/ai-background-remover/',
    wait: 2000,
  },
  { file: 'image-suite.png', url: 'https://everydayhub.app/image/', wait: 2500 },
  { file: 'ai-hub.png', url: 'https://ai.everydayhub.app/', wait: 2500 },
  { file: 'vibe-studio.png', url: 'https://vibe.everydayhub.app/', wait: 2500 },
  { file: 'pdf-studio.png', url: 'https://tools.everydayhub.app/pdf-studio/', wait: 2000 },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await context.newPage();

for (const shot of SHOTS) {
  process.stdout.write(`Capturing ${shot.file} … `);
  try {
    await page.goto(shot.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(shot.wait);
    await page.screenshot({
      path: path.join(outDir, shot.file),
      fullPage: false,
    });
    console.log('ok');
  } catch (err) {
    console.log('failed:', err.message);
  }
}

await browser.close();
console.log('Done →', outDir);
