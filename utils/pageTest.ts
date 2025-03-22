import { Page, expect } from '@playwright/test';

export async function pageTest(page: Page) {
    await expect(page).toHaveURL(/sweetshop.netlify.app/);
    await expect(page).toHaveTitle(/.+/);

    const response = await page.request.get('https://sweetshop.netlify.app/');
    expect(response.status()).toBe(200);

    await expect(page.locator('body')).toBeVisible();
}