import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('completes all 4 steps and reaches thank-you page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Step 1 — Business info
    await page.fill('input[formControlName="businessName"]', 'Test Barbershop');
    await page.locator('select[formControlName="websiteType"]').selectOption('new');
    await page.getByRole('button', { name: /Next|Continue/i }).click();

    // Step 2 — Budget
    await page.locator('button, label').filter({ hasText: /Pay-As-You-Go|£59/i }).first().click();
    await page.getByRole('button', { name: /Next|Continue/i }).click();

    // Step 3 — Services
    await page.locator('button, label').filter({ hasText: /SEO/i }).first().click();
    await page.getByRole('button', { name: /Next|Continue/i }).click();

    // Step 4 — Contact details
    await page.fill('input[formControlName="name"]', 'Test User');
    await page.fill('input[formControlName="email"]', 'test@e2e.com');
    await page.fill('textarea[formControlName="message"]', 'This is a test message that is long enough to pass the minimum character validation requirement.');
    await page.getByRole('button', { name: /Submit|Send/i }).click();

    // Thank-you page
    await expect(page).toHaveURL(/\/contact\/thank-you/);
    await expect(page.locator('h1')).toContainText(/Project Received|Thank/i);
    await expect(page.locator('text=/AV-/')).toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /Next|Continue/i }).click();
    await expect(page.locator('.text-error, [class*="error"]').first()).toBeVisible();
  });
});
