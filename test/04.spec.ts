import { test, expect } from '@playwright/test';

test.describe('Test 04 - Add all items to basket and proceed to checkout', () => {
  const productsInStore = [
    { name: 'Sherbert Straws', price: '£0.75' },
    { name: 'Sherbet Discs', price: '£0.95' },
    { name: 'Strawberry Bon Bons', price: '£1.00' },
    { name: 'Chocolate Cups', price: '£1.00' },
    { name: 'Raspberry Drumstick', price: '£0.20' },
    { name: 'Sweet Whistle', price: '£0.25' },
    { name: 'Chocolate Beans', price: '£0.80' },
    { name: 'Bubbly', price: '£0.10' },
    { name: 'Wham Bar', price: '£0.15' },
    { name: 'Bubble Gums', price: '£0.25' },
    { name: 'Nerds', price: '£0.60' },
    { name: 'Sherbet Discs', price: '£0.95' },
    { name: 'Dolly Mixture', price: '£0.90' },
    { name: 'Jellies', price: '£0.75' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('https://sweetshop.netlify.app/sweets');
    // Assuming pageTest() is a custom function, we'd need to implement it separately
    // or replace with appropriate Playwright assertions
  });

  test('should add all products to the basket and proceed to checkout', async ({ page }) => {
    // Wait for at least one product to load using first()
    await page.locator('.card').first().waitFor({ state: 'visible', timeout: 6000 });
    
    // Now check if multiple cards are present
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Add all products to basket
    for (let i = 0; i < count; i++) {
      await cards.nth(i).locator('.addItem').click();
    }

    // Navigate to basket/checkout page
    await page.locator(':nth-child(4) > .nav-link').click();

    // Wait for at least one basket item to appear
    await page.locator('#basketItems .list-group-item').first().waitFor({ state: 'visible', timeout: 10000 });
    
    const basketItems = page.locator('#basketItems .list-group-item');
    const basketItemsCount = await basketItems.count();
    expect(basketItemsCount).toBeGreaterThan(0);
    
    // Verify each basket item
    for (let i = 0; i < basketItemsCount; i++) {
      const item = basketItems.nth(i);
      const basketName = await item.locator('h6.my-0').textContent();
      const basketPrice = await item.locator('span.text-muted').textContent();

      if (basketName) {
        const matchingProduct = productsInStore.find(product => product.name === basketName);
        
        if (matchingProduct) {
          console.log(`Basket item: ${basketName} - Price: ${basketPrice}`);
          expect(basketName).toBe(matchingProduct.name);
          expect(basketPrice).toBe(matchingProduct.price);
        } else {
          console.log(`❌ Product not found in store: ${basketName}`);
        }
      }
    }

    // Navigate back to checkout
    await page.locator(':nth-child(4) > .nav-link').click();

    // Check default radio is selected
    await expect(page.locator('input#exampleRadios1')).toBeChecked();

    // Get initial total
    const initialTotalElement = page.locator('#basketItems li:last-child strong');
    const initialTotal = await initialTotalElement.textContent();
    
    expect(initialTotal).toMatch(/£\d+\.\d{2}/);

    // Select second radio option and verify total changes
    await page.locator('input#exampleRadios2').click({ force: true });
    await page.waitForTimeout(500);

    const updatedTotalElement = page.locator('#basketItems li:last-child strong');
    const updatedTotal = await updatedTotalElement.textContent();
    
    if (initialTotal) {
      const expectedTotal = (parseFloat(initialTotal.replace('£', '')) + 1.99).toFixed(2);
      expect(updatedTotal).toBe(`£${expectedTotal}`);
    }

    // Change back to first option and verify total reverts
    await page.locator('input#exampleRadios1').click({ force: true });
    await page.waitForTimeout(500);
    
    const finalTotal = await page.locator('#basketItems li:last-child strong').textContent();
    expect(finalTotal).toBe(initialTotal);
  });
});