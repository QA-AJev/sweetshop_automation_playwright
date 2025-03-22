import { test, expect } from '@playwright/test';
import { pageTest } from '../utils/pageTest';

test.describe('Basic Functionality Check - Navigation & Links', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://sweetshop.netlify.app/');
        await pageTest(page);
    });

    test('Checks all main page links and buttons', async ({ page }) => {
        await expect(page.locator('role=link[name="Sweet Shop"]')).toBeVisible();
        await expect(page.locator('a.nav-link[href="/basket"]')).toBeVisible();

        const cardCount = await page.locator('.card').count();
        expect(cardCount).toBeGreaterThan(0);

        await page.click('a.nav-link[href="/basket"]');
        await expect(page).toHaveURL(/\/basket/);
        await expect(page.locator('role=link[name="Basket"]')).toBeVisible();
        await page.goBack();

        const cards = await page.locator('.card');
        const numCards = await cards.count();
        for (let i = 0; i < numCards; i++) {
            const card = cards.nth(i); // Get each card
            await expect(card.locator('.addItem')).toBeVisible(); // Make sure the button is visible
            await card.locator('.addItem').click(); // Click the addItem button
        }

        await expect(page.locator('text=Sweet Shop Project 2018')).toBeVisible();

        await page.click('a.nav-link[href="/sweets"]');
        await expect(page).toHaveURL(/\/sweets/);
        await expect(page.locator('text=Sweets')).toBeVisible();

        await page.click('a.nav-link[href="/about"]');
        await expect(page).toHaveURL(/\/about/);
        await expect(page.locator('text=About')).toBeVisible();

        await page.click('a.nav-link[href="/login"]');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.locator('text=Login')).toBeVisible();
    });

    test('Verifies nav bar links from the basket page remain functional', async ({ page }) => {
        await page.click('a.nav-link[href="/basket"]');
        await expect(page).toHaveURL(/\/basket/);
        await expect(page.locator('h1.display-3:has-text("Your Basket")')).toBeVisible();

        const navLinks = await page.locator('a.nav-link');
        const navLinkCount = await navLinks.count();
        for (let i = 0; i < navLinkCount; i++) {
            const link = navLinks.nth(i);
            const href = await link.getAttribute('href');
            expect(href).toMatch(/^\/(sweets|about|login|basket)$/);
        }

        await expect(page.locator('a.nav-link[href="/sweets"]')).toHaveAttribute('href', '/sweets');
        await expect(page.locator('a.nav-link[href="/about"]')).toHaveAttribute('href', '/about');
        await expect(page.locator('a.nav-link[href="/login"]')).toHaveAttribute('href', '/login');
        await expect(page.locator('a.nav-link[href="/basket"]')).toHaveAttribute('href', '/basket');
    });
});
