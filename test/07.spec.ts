import { test, expect } from '@playwright/test';
import { pageTest } from '../utils/pageTest';

test.describe('Sweet Shop Login Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://sweetshop.netlify.app/login');
  });

  test('should log in and redirect to the correct page', async ({ page }) => {
    // Step 1: Log in
    await page.fill('#exampleInputEmail', 'test@user.com');
    await page.fill('#exampleInputPassword', 'qwerty');
    await page.click('button[type="submit"]');

    // Step 2: Verify the URL and the "Welcome back" message
    await expect(page).toHaveURL('https://sweetshop.netlify.app/00efc23d-b605-4f31-b97b-6bb276de447e.html');

    const leadText = await page.locator('.lead');
    await expect(leadText).toContainText('Welcome back');

    const emailLink = leadText.locator('a');
    await expect(emailLink).toHaveText('test@user.com');

    // Login test END //

    // Test: Check the sorting by order date
    await page.click('.order-date');
    await page.waitForTimeout(500);
    const firstRowDate = await page.locator('#transactions tbody tr:first-child td:nth-child(2)').innerText();
    console.log('First row date after ascending sort:', firstRowDate.trim());
    expect(firstRowDate.trim()).toBe('1st December 2019');

    await page.click('.order-date');
    await page.waitForTimeout(500);
    const firstRowDateDesc = await page.locator('#transactions tbody tr:first-child td:nth-child(2)').innerText();
    console.log('First row date after descending sort:', firstRowDateDesc.trim());
    expect(firstRowDateDesc.trim()).toBe('11th Feb 2019');

    // Test: Check the sorting by order total
    await page.click('.order-total');
    await page.waitForTimeout(500);
    const firstRowTotal = await page.locator('#transactions tbody tr:first-child td:nth-child(4)').innerText();
    console.log('First row total after ascending sort:', firstRowTotal.trim());
    expect(firstRowTotal.trim()).toBe('8.00');

    await page.click('.order-total');
    await page.waitForTimeout(500);

    // Verify the first row shows the largest total after descending sort
    const firstRowTotalDesc = await page.locator('#transactions tbody tr:first-child td:nth-child(4)').innerText();
    console.log('First row total after descending sort:', firstRowTotalDesc.trim());
    expect(firstRowTotalDesc.trim()).toBe('0.75');
  });
});