import { test, expect, Page } from '@playwright/test';

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.getByRole('button', { name: /Sign In/i }).click();
  await page.waitForURL('/');
}

test.describe('Dashboard', () => {
  // These tests require a seeded user — run after auth E2E creates one
  test.skip('dashboard shows overview with stat cards', async ({ page }) => {
    await loginAs(page, 'e2e@test.com', 'E2eTest123');
    await page.goto('/dashboard');
    await expect(page.locator('text=Active Sites')).toBeVisible();
    await expect(page.locator('text=Requests')).toBeVisible();
    await expect(page.locator('text=Messages')).toBeVisible();
  });

  test.skip('dashboard sidebar navigation works', async ({ page }) => {
    await loginAs(page, 'e2e@test.com', 'E2eTest123');
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /Projects/i }).click();
    await expect(page.locator('text=No projects yet')).toBeVisible();
    await page.getByRole('button', { name: /Messages/i }).click();
    await expect(page.locator('text=No messages')).toBeVisible();
  });

  test.skip('"Start a project" navigates to onboarding', async ({ page }) => {
    await loginAs(page, 'e2e@test.com', 'E2eTest123');
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /Start a project|New request/i }).first().click();
    await expect(page).toHaveURL(/\/onboarding/);
  });
});
