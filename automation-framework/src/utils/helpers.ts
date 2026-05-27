import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export async function captureScreenshot(page: Page, name: string): Promise<string> {
  const dir = path.join(process.cwd(), 'test-results', 'screenshots');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, `${name}_${Date.now()}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0].replace(/-/g, '');
}

export function readJsonFile<T>(filePath: string): T {
  const fullPath = path.resolve(process.cwd(), filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(content) as T;
}
