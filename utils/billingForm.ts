import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export async function fillBillingForm(page: Page) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const address = faker.location.streetAddress();
    const address2 = faker.location.secondaryAddress();

    const cities = ['Bristol', 'Cardiff', 'Swansea'];
    const city = faker.helpers.arrayElement(cities);
    const zip = faker.location.zipCode();

    await page.fill('input#name:nth-of-type(1)', firstName);
    await page.fill('input#name:nth-of-type(2)', lastName);
    await page.fill('#email', email);
    await page.fill('#address', address);
    await page.fill('#address2', address2);
    
    await page.selectOption('#country', { label: 'United Kingdom' });
    await page.selectOption('#city', { label: city });
    await page.fill('#zip', zip);

    const cardName = faker.person.fullName();
    const cardNumber = faker.finance.creditCardNumber();
    const expirationDate = faker.date.future();
    const month = (`0${expirationDate.getMonth() + 1}`).slice(-2);
    const year = expirationDate.getFullYear().toString().slice(-2);
    const cardExpiration = `${month}/${year}`;
    const cardCVV = faker.finance.creditCardCVV();

    await page.fill('#cc-name', cardName);
    await page.fill('#cc-number', cardNumber);
    await page.fill('#cc-expiration', cardExpiration);
    await page.fill('#cc-cvv', cardCVV);
}