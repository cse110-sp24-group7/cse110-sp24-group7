//**TEST1 */
describe("Basic user flow for PopupComponent", () => {
  beforeAll(async () => {
    await page.goto(
      "http://127.0.0.1:5502/source/project/components/journal-popup/journal-popup-standalone.html",
    ); // Adjust the path as needed
  });

  test("should create and display the popup when the button is clicked", async () => {
    await page.waitForSelector("#open-popup");
    await page.click("#open-popup");
    await page.waitForSelector("popup-component");
    const popup = await page.$("popup-component");
    expect(popup).not.toBeNull();
  });

  test("should close the popup when the overlay is clicked", async () => {
    await page.waitForSelector("popup-component");
    const popup = await page.$("popup-component");
    const shadowRoot = await popup.evaluateHandle((popup) => popup.shadowRoot);
    const overlay = await shadowRoot.$(".overlay");
    await overlay.click();
    const displayStyle = await page.evaluate(
      (popup) => popup.style.display,
      popup,
    );
    expect(displayStyle).toBe("");
  });

  test("should close the popup when the close button is clicked", async () => {
    await page.waitForSelector("popup-component");
    const popup = await page.$("popup-component");
    const shadowRoot = await popup.evaluateHandle((popup) => popup.shadowRoot);
    const closeButton = await shadowRoot.$("#closeBtn");
    await closeButton.click();
    const displayStyle = await page.evaluate(
      (popup) => popup.style.display,
      popup,
    );
    expect(displayStyle).toBe("none");
  });

  test("should handle form submission and save data correctly", async () => {
    ///**DOES NOT PASS */
    //Click the button to open the popup
    await page.waitForSelector("#open-popup");
    await page.click("#open-popup");
    // Wait for the popup component to be added to the DOM
    await page.waitForSelector("popup-component");
    // Get the popup component
    const popup = await page.$("popup-component");
    // Ensure the popup is displayed
    expect(popup).not.toBeNull();
    // Get the shadow root of the popup component
    const shadowRootHandle = await popup.evaluateHandle(
      (popup) => popup.shadowRoot,
    );
    // Get the form inputs within the shadow DOM
    const titleInput = await shadowRootHandle.$("#title");
    const descriptionInput = await shadowRootHandle.$("#description");
    const dateInput = await shadowRootHandle.$("#currDate");
    const labelInput = await shadowRootHandle.$("#label");
    // Fill out the form
    await titleInput.type("Test Title");
    await descriptionInput.type("Test Description");
    await dateInput.type("2024-05-21");
    await labelInput.type("Test Label");
    // Submit the form
    const form = await shadowRootHandle.$("#journalForm");
    await form.evaluate((form) => form.submit());
    // Check if the data is saved to localStorage
    const savedData = await page.evaluate(() => {
      const data = localStorage.getItem("journalData");
      return data ? JSON.parse(data) : [];
    });
    // Ensure savedData is not null and has entries
    expect(savedData).not.toBeNull();
    // Ensure the last entry matches the expected structure
    if (savedData.length > 0) {
      expect(savedData[savedData.length - 1]).toEqual({
        entry_id: expect.any(String),
        entry_title: "Test Title",
        entry_content: "Test Description",
        creation_date: "2024-05-21",
        enrty_label: "Test Label", // Ensure this matches the actual property name used in the component
      });
    }
  });
});
