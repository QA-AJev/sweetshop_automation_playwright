import { test, expect } from '@playwright/test';
import { pageTest } from '../utils/pageTest';

test.describe('Verify Product Images, Names, and Prices', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://sweetshop.netlify.app/sweets');
        await pageTest(page);
    });

    test('Checks that each product has a visible image, name, and price', async ({ page }) => {
        const productCards = await page.locator('.card').elementHandles();

        for (const card of productCards) {
            const img = await card.$('.card-img-top');
            expect(img).not.toBeNull();

            let imgSrc = await img?.getAttribute('src');
            expect(imgSrc).not.toBeNull();

            // Convert relative URL to absolute URL
            if (imgSrc && !imgSrc.startsWith('http')) {
                imgSrc = new URL(imgSrc, 'https://sweetshop.netlify.app').toString();
            }

            // 🛑 Debugging Step: Log the Image URL
            console.log(`Checking image: ${imgSrc}`);

            // Validate image loads successfully
            const imageResponse = await page.request.get(imgSrc!);
            console.log(`Response status for ${imgSrc}: ${imageResponse.status()}`);

            expect(imageResponse.status(), `Image not found: ${imgSrc}`).toBe(200);

            // Verify name exists
            const nameElement = await card.$('.card-title');
            const productName = await nameElement?.textContent();
            expect(productName).not.toBeNull();
            expect(productName?.trim().length).toBeGreaterThan(0);

            // Verify price format (£X.XX)
            const priceElement = await card.$('.text-muted');
            const priceText = await priceElement?.textContent();
            expect(priceText).not.toBeNull();
            expect(priceText?.trim()).toMatch(/^£\d+(\.\d{2})?$/);
        }
    });
});