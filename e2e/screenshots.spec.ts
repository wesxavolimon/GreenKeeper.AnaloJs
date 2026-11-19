import { expect, test } from '@playwright/test';

test.describe('GreenKeeper.AnaloJs Visual Screen Capture', () => {
  test('redirects unauthenticated mobile user to login page', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });
    const page = await context.newPage();

    await page.goto('/login');
    await expect(page.getByTestId('btn-login-google')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);

    await page.screenshot({
      path: 'screenshots/mobile-login.png',
      fullPage: true,
    });

    await context.close();
  });

  test('blocks desktop browser via Mobile-Only Gate, renders Informative Screen, and saves screenshot', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      isMobile: false,
      hasTouch: false,
      deviceScaleFactor: 1,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    await page.goto('/');
    await expect(page).toHaveURL(/\/desktop-info$/);
    await expect(page.getByTestId('desktop-info-page')).toBeVisible();
    await expect(page.getByTestId('mobile-only-badge')).toHaveText(
      'Exclusivo para Celular',
    );
    await expect(page.getByTestId('mobile-dashboard')).toHaveCount(0);

    await page.screenshot({
      path: 'screenshots/desktop-info.png',
      fullPage: true,
    });

    await context.close();
  });
});
