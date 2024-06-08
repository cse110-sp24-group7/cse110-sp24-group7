const { test, _electron, expect } = require("@playwright/test");
const electron = _electron;

const mainLocation = "./source/project/scripts/main.js";

test("App launches and can get isPackaged", async () => {
	const electronApp = await electron.launch({ args: [mainLocation] });
	const isPackaged = await electronApp.evaluate(async ({ app }) => {
		return app.isPackaged;
	});
	expect(isPackaged).toBe(false);
	await electronApp.close();
});

test("Window opens", async () => {
	const electronApp = await electron.launch({ args: [mainLocation] });
	const window = await electronApp.firstWindow();
	expect(window).toBeTruthy();
	await electronApp.close();
});
