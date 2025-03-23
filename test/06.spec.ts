import { test, expect } from '@playwright/test';
import { pageTest } from '../utils/pageTest';

test.describe('Sweet Shop Login Test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://sweetshop.netlify.app/login');
        // Replace cy.pageTest() with appropriate validation if needed
    });

    test('should log in and redirect to the correct page', async ({ page }) => {
        await page.fill('#exampleInputEmail', 'test@user.com');
        await page.fill('#exampleInputPassword', 'qwerty');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('https://sweetshop.netlify.app/00efc23d-b605-4f31-b97b-6bb276de447e.html');

        const leadText = await page.locator('.lead');
        await expect(leadText).toContainText('Welcome back');

        const emailLink = leadText.locator('a');
        await expect(emailLink).toHaveText('test@user.com');
    });

    test('should show validation errors when logging in with empty fields', async ({ page }) => {
        await page.click('button[type="submit"]');

        const emailError = await page.locator('.invalid-feedback.invalid-email');
        await expect(emailError).toBeVisible();
        await expect(emailError).toContainText('Please enter a valid email address.');

        const passwordError = await page.locator('.invalid-feedback.invalid-password');
        await expect(passwordError).toBeVisible();
        await expect(passwordError).toContainText('Please enter a valid password.');
    });

    test('should show validation errors when logging in with incorrect credentials', async ({ page }) => {
        await page.fill('#exampleInputEmail', 'wrong@user.com');
        await page.fill('#exampleInputPassword', 'wrongpassword');
        await page.click('button[type="submit"]');

        const emailError = await page.locator('.invalid-feedback.invalid-email');
        await expect(emailError).toBeVisible();
        await expect(emailError).toContainText('Please enter a valid email address.');

        const passwordError = await page.locator('.invalid-feedback.invalid-password');
        await expect(passwordError).toBeVisible();
        await expect(passwordError).toContainText('Please enter a valid password.');
    });
});