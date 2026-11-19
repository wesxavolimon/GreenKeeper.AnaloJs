import { expect, test } from '@playwright/test';

test.describe('Auth0 Google Authentication', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  test('redirects unauthenticated user to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('btn-login-google')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('login page displays Google login button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('btn-login-google')).toBeVisible();
    await expect(page.getByRole('button', { name: /Continuar com Google/ })).toBeVisible();
  });
});
