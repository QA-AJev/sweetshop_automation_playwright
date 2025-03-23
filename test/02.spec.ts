import { test, expect } from '@playwright/test';
import { pageTest } from '../utils/pageTest';

test.describe('SweetShop Basket Automation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://sweetshop.netlify.app/');
        await pageTest(page);
    });

    test('Verify selected items match items in the cart and basket count updates correctly', async ({ page }) => {
        // Function to add products
        const addProducts = async () => {
            const products: string[] = [];
            const productElements = await page.locator('.row.text-center .col-lg-3').elementHandles();
            const selectedProducts = productElements.slice(0, 4);

            for (const product of selectedProducts) {
                const titleElement = await product.$('.card-title');
                const productName = await titleElement?.textContent();
                if (productName) {
                    products.push(productName.trim());
                    console.log(`Adding product: ${productName.trim()}`);
                }
                const addItemButton = await product.$('.addItem');
                if (addItemButton) {
                    await addItemButton.click();
                }
            }
            return products;
        };

        const productNames = await addProducts();
        console.log('Added products:', productNames);

        // Verify basket count
        const basketCountLocator = page.locator('a.nav-link[href="/basket"] span.badge-success');
        await expect(basketCountLocator).toHaveText(productNames.length.toString()); // Ensure basket count is correct

        // Navigate to basket
        await page.locator('a.nav-link[href="/basket"]').click();

        // Wait for the basket items to appear in the basket and ensure they are visible
        const basketItemsLocator = page.locator('#basketItems li:not(:has-text("Total"))');
        await basketItemsLocator.first().waitFor({ state: 'visible' }); // Wait for the first item to be visible

        // Verify basket items
        const basketItems = await basketItemsLocator.elementHandles();
        expect(basketItems.length).toBe(productNames.length);

        const basketNames: string[] = [];
        for (const item of basketItems) {
            const nameElement = await item.$('h6.my-0');
            const name = await nameElement?.textContent();
            if (name) {
                basketNames.push(name.trim().toLowerCase()); // Normalize case
            }
        }

        // Normalize names for comparison
        const normalizedProductNames = productNames
            .map(name => name.toLowerCase().replace(/\s+/g, '')) // Remove spaces and normalize case
            .sort();
        const normalizedBasketNames = basketNames
            .map(name => name.toLowerCase().replace(/\s+/g, '')) // Remove spaces and normalize case
            .sort();

        console.log('Normalized product names:', normalizedProductNames);
        console.log('Normalized basket names:', normalizedBasketNames);

        // Ensure the items match
        expect(normalizedProductNames).toEqual(normalizedBasketNames);
    });
});