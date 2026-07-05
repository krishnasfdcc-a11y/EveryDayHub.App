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
  {
    file: 'designstudio-dashboard.png',
    url: 'https://everydayhub.app/designstudio/',
    wait: 3000,
    waitFor: '.dashboard__title',
  },
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
    url: 'https://tools.everydayhub.app/ai-background-remover-widget.html',
    wait: 1500,
    waitFor: '.abr-container',
    waitUntil: 'networkidle',
    colorScheme: 'light',
    clipSelector: '.abr-container',
  },
  { file: 'image-suite.png', url: 'https://everydayhub.app/image/', wait: 2500 },
  { file: 'ai-hub.png', url: 'https://ai.everydayhub.app/', wait: 2500 },
  { file: 'vibe-studio.png', url: 'https://vibe.everydayhub.app/', wait: 2500 },
  { file: 'pdf-studio.png', url: 'https://tools.everydayhub.app/pdf-studio/', wait: 2000 },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

for (const shot of SHOTS) {
  process.stdout.write(`Capturing ${shot.file} … `);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: shot.colorScheme ?? 'dark',
  });
  const page = await context.newPage();

  try {
    await page.goto(shot.url, {
      waitUntil: shot.waitUntil ?? 'domcontentloaded',
      timeout: 60000,
    });
    if (shot.waitFor) {
      await page.waitForSelector(shot.waitFor, { timeout: 30000 });
    }
    await page.waitForTimeout(shot.wait);

    if (shot.clipSelector) {
      const target = page.locator(shot.clipSelector).first();
      await target.screenshot({ path: path.join(outDir, shot.file) });
    } else {
      await page.screenshot({
        path: path.join(outDir, shot.file),
        fullPage: false,
      });
    }
    console.log('ok');
  } catch (err) {
    console.log('failed:', err.message);
  } finally {
    await context.close();
  }
}

await browser.close();
console.log('Done →', outDir);
