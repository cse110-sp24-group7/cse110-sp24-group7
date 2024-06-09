const { test, expect, _electron: electron } = require("@playwright/test");
const path = require("path");
const source_location = path.join(__dirname, "..", "fileSource");

/**
 * @description Uses vault page to add file of the specified name at source_location
 * @param {Page} page - the page of the electron app
 * @param {string} file_name - the name of the file
 * @returns {void}
 */
async function addFile(page, file_name) {
	const fileChooserPromise = page.waitForEvent("filechooser");
	await page.locator("label[for='file']").click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(path.join(source_location, file_name));
}

/**
 * @description Uses vault page to remove a file of the specified name at source_location
 * @param {Page} page - the page of the electron app
 * @param {string} file_name - the name of the file
 * @returns {void}
 */
async function removeFile(page, file_name) {
	const match = page.getByText(file_name).locator("..").locator("#deleteBtn");
	await match.click();
}

/**
 * @description Navigates to the vault page, assuming that the menu element is present on the page and vault is present in the menu
 * @param {Page} page - the page of the electron app
 * @returns {void}
 */
async function navigateToVault(page) {
	await page.waitForSelector("#menu");
	const navBtn = await page.$$("#menu");
	await navBtn[0].click();

	await page.waitForSelector("#vault");
	const vaultNav = await page.$$("#vault");
	await vaultNav[0].click();
}

/**
 * @descriptionUses Uses vault page to remove all files of the specified name at source_location
 * @param {Page} page - the page of the electron app
 * @returns {void}
 */
async function deleteAllFiles(page) {
	const matches = await page.$$("#deleteBtn");
	for (let match of matches) await match.click();
}

/**
 * @descriptionUses Uses vault page to filter what is shown on the page. Returns true if the appropriate sections are hidden.
 * @param {Page} page - the page of the electron app
 * @param {string} value - the value of the selected filter
 * @returns {boolean}
 */
async function filterFiles(page, value) {
	await page.waitForSelector("#filter");
	const filter = await page.$("#filter");
	filter?.selectOption(value);

	let possibleOptions = ["all", "files", "images"];

	for (let i = 1; i < possibleOptions; i++) {
		const isHidden = await page.$eval(`#${possibleOptions[i]}`, (el) =>
			el.classList.contains("hidden")
		);
		if (value == "all") {
			if (isHidden) return false;
		} else if (isHidden && value == possibleOptions[i]) return false;
		else if (!isHidden && value != possibleOptions[i]) return false;
	}
	return true;
}

test.afterEach("Ensure that any added files are deleted", async () => {
	test.setTimeout(120000);
	const electronApp = await electron.launch({ args: ["."] });
	const page = await electronApp.firstWindow();
	page.on("console", (msg) => console.log(msg.text()));

	await navigateToVault(page);

	await deleteAllFiles(page);

	const items = await page.$$(".file-item");
	expect(items.length).toBe(0);
});

test("User uploads files", async () => {
	test.setTimeout(120000);
	const electronApp = await electron.launch({ args: ["."] });
	const page = await electronApp.firstWindow();
	page.on("console", (msg) => console.log(msg.text()));

	await navigateToVault(page);

	//await page.fill("#file", value);
	await Promise.all([
		addFile(page, "code.js"),
		addFile(page, "notes.md"),
		addFile(page, "notes.pdf"),
		addFile(page, "notes.txt"),
		addFile(page, "pikachu_jpg.jpg"),
		addFile(page, "pikachu_png.png"),
		addFile(page, "pikachu_webp.webp")
	]);

	await page.waitForSelector(".file-item");
	const items = await page.$$(".file-item");
	expect(items.length).toBe(7);
});

test("Filter hides appropriate section", async () => {
	const electronApp = await electron.launch({ args: ["."] });
	const page = await electronApp.firstWindow();
	page.on("console", (msg) => console.log(msg.text()));

	await navigateToVault(page);

	let count = 0;
	await Promise.all([
		(count += await filterFiles(page, "all")),
		(count += await filterFiles(page, "files")),
		(count += await filterFiles(page, "images"))
	]);
	expect(count).toBe(3);
});

export default {
	addFile,
	removeFile,
	navigateToVault,
	deleteAllFiles,
	filterFiles
};
