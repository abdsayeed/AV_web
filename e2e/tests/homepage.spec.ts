import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders hero section with CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Websites that');
    await expect(page.getByRole('button', { name: /Get Your Website/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /View Templates/i })).toBeVisible();
  });

  test('nav shows Login and Get Started when logged out', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Login/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Get Started/i })).toBeVisible();
  });

  test('pricing section shows 3 plans', async ({ page }) => {
    await page.goto('/');
    await page.locator('#services').scrollIntoViewIfNeeded();
    const cards = page.locator('#services .rounded-3xl');
    await expect(cards).toHaveCount(3);
  });

  test('templates section shows at least 6 cards', async ({ page }) => {
    await page.goto('/');
    await page.locator('#templates').scrollIntoViewIfNeeded();
    const cards = page.locator('#templates .cursor-pointer');
    await expect(cards).toHaveCount(6);
  });

  test('FAQ accordion opens and closes', async ({ page }) => {
    await page.goto('/');
    const firstQuestion = page.locator('app-faq button').first();
    await firstQuestion.scrollIntoViewIfNeeded();
    await firstQuestion.click();
    await expect(page.locator('app-faq .overflow-hidden').first()).toHaveCSS('max-height', /[^0]/);
    await firstQuestion.click();
    await expect(page.locator('app-faq .overflow-hidden').first()).toHaveCSS('max-height', '0px');
  });
});
