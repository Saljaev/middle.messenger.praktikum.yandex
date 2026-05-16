import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';

const OUT_DIR = resolve(process.cwd(), 'screenshots');
const VIEWPORT = { width: 1440, height: 900 };

const AUTH_USER = {
  id: 999,
  login: 'test',
  first_name: 'Тест',
  second_name: 'Тестов',
  display_name: 'Tiger000123',
  email: 'test@example.com',
  phone: '+79990000000',
  avatarUrl: 'https://placehold.co/200/0088cc/white?text=T+U',
  status: 'online'
};

const PAGES = [
  { name: '01-login', path: '/login', auth: false },
  { name: '02-register', path: '/register', auth: false },
  { name: '03-chat-list', path: '/', auth: true },
  { name: '04-chat-active', path: '/chat/1', auth: true },
  { name: '05-settings', path: '/settings', auth: true },
  { name: '06-settings-avatar', path: '/settings/avatar', auth: true },
  { name: '07-settings-password', path: '/settings/password', auth: true },
  { name: '08-404', path: '/some-nonexistent-page', auth: true },
];

async function screenshotPage(page, url, filename) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(OUT_DIR, `${filename}.png`), fullPage: false });
  console.log(`Screenshot: ${filename}.png`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const server = await createServer({
    root: process.cwd(),
    server: { port: 3333, strictPort: true }
  });
  await server.listen();
  const baseUrl = `http://localhost:3333`;
  console.log(`Dev server started at ${baseUrl}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });

  for (const item of PAGES) {
    const page = await context.newPage();

    if (item.auth) {
      await page.goto(`${baseUrl}/login`);
      await page.evaluate((user) => {
        localStorage.setItem('auth_token', 'mock-token-screenshot');
        localStorage.setItem('current_user', JSON.stringify(user));
      }, AUTH_USER);
    }

    await screenshotPage(page, `${baseUrl}${item.path}`, item.name);
    await page.close();
  }

  // 500 page — trigger via broken localStorage
  {
    const page = await context.newPage();
    await page.goto(`${baseUrl}/login`);
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-token-screenshot');
      localStorage.setItem('current_user', 'broken json {{');
    });
    await screenshotPage(page, `${baseUrl}/`, '09-500');
    await page.close();
  }

  await browser.close();
  await server.close();
  console.log('Done. Screenshots saved to ./screenshots/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
