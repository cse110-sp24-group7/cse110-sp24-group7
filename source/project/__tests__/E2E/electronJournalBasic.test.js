// IMPORTANT: Run "npm install --save-dev @playwright/test" before running this code.
// IMPORTANT: To run the test, run "npx playwright test E2E/electronJournalBasic.test.js"

const { test, expect, _electron: electron } = require("@playwright/test");

test("Sample journal test", async () => {
	// This creates the electronApp object that we use for testing.
	const electronApp = await electron.launch({ args: ["."] });

	// Dummy test that I used just to check if E2E worked with electron. Don't bother including this in your tests unless you want something for sanity.
	const isPackaged = await electronApp.evaluate(async ({ app }) => {
		return app.isPackaged;
	});

	expect(isPackaged).toBe(false);

	// The page variable here refers to the actual page on the electronApp (sort of like a webpage). You can use normal syntax from here on out on this variable.
	const page = await electronApp.firstWindow();
	await page.waitForSelector(".add-journal");
	const buttons = await page.$$(".add-journal");
	if (buttons.length > 0) {
		await buttons[0].click();
	} else {
		throw new Error('No buttons with the class "add-journal" found');
	}

	// This is for the sake of manual testing, commented it out for now.
	// await page.screenshot({ path: 'testImages/journal-popup.png' });

	// Fill out the title input
	await page.fill("#title", "Journal-Test-1");

	// Fill out the date-time input
	await page.fill("#currDate", "2024-06-01T10:30");

	// Fill out the textarea
	await page.fill("#description", "This is a journal entry.");

	// IMPORTANT: Sometimes the code runs a little too quickly on the app, not giving it enough time to complete operations. For now, I've just hard-coded in a timeout to prevent this.
	// If anyone finds a better way to do this let me know!
	await page.waitForTimeout(1000);

	await page.click('button[type="submit"]');
	// await page.screenshot({path: "testImages/mainViewWithJournal.png"})

	await page.waitForTimeout(1000);

	// Get all journal-pv objects.
	await page.waitForSelector(".journal-pv");
	const allJournals = await page.$$(".journal-pv");
	let journalFound = false;
	// Iterate through the journal previews to see if one matches the one we just created (note that data.db needs to be reset after running this test, did not get to cleaning the database automatically yet.)
	for (let i = 0; i < (await allJournals.length); i++) {
		let title = await allJournals[i].$("h2");
		let titleText = await title.textContent();
		console.log(titleText);
		if (titleText == "Journal-Test-1") {
			journalFound = true;
		}
	}
	expect(journalFound).toBe(true);

	// Close the electron app.
	await electronApp.close();
});
