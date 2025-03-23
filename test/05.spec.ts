import { test, expect } from '@playwright/test';
import { pageTest } from '../utils/pageTest';

test.describe('Billing Information Form Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://sweetshop.netlify.app/');
    await pageTest(page);
  });

  test('should fill in the billing information and submit the form', async ({ page }) => {
    const productNames: string[] = [];

    // Locate all product elements and get their names
    const products = await page.locator('.row.text-center .col-lg-3').all();
    
    // Add the first 4 product names to the productNames array
    for (let index = 0; index < Math.min(4, products.length); index++) {
      const product = products[index];
      const productName = await product.locator('.card-title').innerText();
      productNames.push(productName.trim());

      // Add the product to the cart
      await product.locator('.addItem').click();
    }

    expect(productNames).toHaveLength(4);

    await page.locator('a.nav-link[href="/basket"]').click();
    await page.waitForLoadState('load');
    
    console.log(await page.content());

    await page.locator('input#name').first().waitFor({ state: 'visible' });
    await page.fill('input#name', 'John');

    await page.locator('input#name').nth(1).waitFor({ state: 'visible' });
    await page.fill('input#name', 'Doe');

    await page.locator('input#email').waitFor({ state: 'visible' });
    await page.fill('input#email', 'john.doe@example.com');

    await page.locator('input#address').waitFor({ state: 'visible' });
    await page.fill('input#address', '1234 Main St');

    await page.locator('input#address2').waitFor({ state: 'visible' });
    await page.fill('input#address2', 'Apt 101');

    await page.locator('select#country').waitFor({ state: 'visible' });
    await page.selectOption('select#country', { label: 'United Kingdom' });

    await page.locator('select#city').waitFor({ state: 'visible' });
    await page.selectOption('select#city', { label: 'Cardiff' });

    await page.locator('input#zip').waitFor({ state: 'visible' });
    await page.fill('input#zip', 'CF10 1EP');

    await page.locator('input#cc-name').waitFor({ state: 'visible' });
    await page.fill('input#cc-name', 'John Doe');

    await page.locator('input#cc-number').waitFor({ state: 'visible' });
    await page.fill('input#cc-number', '4111111111111111');

    await page.locator('input#cc-expiration').waitFor({ state: 'visible' });
    await page.fill('input#cc-expiration', '12/25');

    await page.locator('input#cc-cvv').waitFor({ state: 'visible' });
    await page.fill('input#cc-cvv', '123');

    await page.locator('button[type="submit"]:has-text("Continue to checkout")').click();

    const successMessage = await page.locator('text="Order Confirmation"');
    await expect(successMessage).toBeVisible();
  });
});