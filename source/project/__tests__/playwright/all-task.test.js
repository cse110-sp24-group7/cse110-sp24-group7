//** IMPORTANT: Run "npm install --save-dev @playwright/test" before running this code. 
//**To run the test: $ npx playwright test source/project/__tests__/playwright/all-task.test.js */

const { test, expect, _electron: electron } = require('@playwright/test');

const mgr =

    test.describe('All Tasks Functionality', () => {
        let electronApp;
        let window;

        test.beforeAll(async () => {
            // Launch Electron app
            electronApp = await electron.launch({ args: ['.'] }); // Adjust the path to your Electron app
            window = await electronApp.firstWindow();

            await window.waitForSelector("#menu");
            const navBtn = await window.$$("#menu");
            await navBtn[0].click();

            await window.waitForSelector("#tasks");
            const taskBtn = await window.$$("#tasks");
            await taskBtn[0].click();

        });

        test.afterAll(async () => {
            await electronApp.close();
        });

        test('should navigate to calendar view on calendar link click', async () => {
            //await window.click('#vault');
            await window.waitForSelector("#menu");
            const navBtn = await window.$$("#menu");
            await navBtn[0].click();

            await window.waitForSelector("#calendar");
            const vaultBtn = await window.$$("#calendar");
            await vaultBtn[0].click();
            await expect(window).toHaveURL(/.*mainview\.html$/);
        });

        test('should navigate to vault view on vault link click', async () => {
            await window.waitForSelector("#menu");
            const navBtn = await window.$$("#menu");
            await navBtn[0].click();

            await window.waitForSelector("#vault");
            const vaultBtn = await window.$$("#vault");
            await vaultBtn[0].click();
            //await window.click('#vault');
            await expect(window).toHaveURL(/.*vault\.html$/);
        });

        test('should toggle menu options on menu button click', async () => {
            const menuButton = await window.locator('#menu');
            const menuOptions = await window.locator('#menu-options');

            await menuButton.click();
            await expect(menuOptions).toBeVisible();

            await menuButton.click();
            await expect(menuOptions).not.toBeVisible();
        });

        test('should hide menu options on outside click', async () => {
            const menuButton = await window.locator('#menu');
            const menuOptions = await window.locator('#menu-options');

            await menuButton.click();
            await expect(menuOptions).toBeVisible();

            await window.click('body');
            await expect(menuOptions).not.toBeVisible();
        });

    });