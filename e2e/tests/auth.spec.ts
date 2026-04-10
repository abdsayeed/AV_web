import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const testEmail = `e2e_${timestamp}@test.com`;
const testPassword = 'E2eTest123';
const testName = 'E2E Test User';

test.describe('Registration', () => {
  test('user can register a new account', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h2')).toContainText('Create your account');

    // Step 1
    await page.fill('input[name="fullName"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.getByRole('button', { name: /Continue/i }).click();

    // Step 2
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.getByRole('button', { name: /Create account/i }).click();

    // Should redirect to home
    await expect(page).toHaveURL('/');
  });

  test('shows error for duplicate email', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Dup User');
    await page.fill('input[name="email"]', testEmail);
    await page.getByRole('button', { name: /Continue/i }).click();
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.getByRole('button', { name: /Create account/i }).click();
    await expect(page.locator('.text-error, .bg-error')).toBeVisible();
  });
});

test.describe('Login', () => {
  test('user can log in', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page).toHaveURL('/');
    // Nav should show Dashboard
    await expect(page.getByRole('button', { name: /Dashboard/i })).toBeVisible();
  });

  test('shows error for wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'WrongPass999');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.locator('.text-error, .bg-error')).toBeVisible();
  });

  test('guest is redirected from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
