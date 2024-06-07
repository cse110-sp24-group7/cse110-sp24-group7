const { test, expect, _electron: electron } = require("@playwright/test");

const mainLocation = "./source/project/scripts/main.js";

test("User uploads multiple files, then deletes a few of them", async () => {
	const electronApp = await electron.launch({ args: [mainLocation] });
    const page = await electronApp.firstWindow();
	await page.waitForSelector("#menu");
	const navBtn = await page.$$("#menu");
	await navBtn.click();
});