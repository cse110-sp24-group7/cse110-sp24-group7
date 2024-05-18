import puppeteer from "puppeteer";

describe("PopupComponent E2E Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
    page = await browser.newPage();
    await page.goto(
      "http://127.0.0.1:5500/source/project/components/popup-component/index.html"
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should open the popup when 'Add Task' button is clicked", async () => {
    await page.click("#open-popup");
    await page.waitForSelector("popup-component >>> .popup-container");
    const isVisible = await page.$eval(
      "popup-component >>> .popup-container",
      (el) => !!el
    );
    expect(isVisible).toBe(true);
  });

  it("should save the form data to local storage on submit", async () => {
    await page.click("#open-popup");
    await page.waitForSelector("popup-component >>> .popup-container");

    await page.type("popup-component >>> #title", "Test Task");
    await page.type(
      "popup-component >>> #description",
      "This is a test description"
    );
    await page.type("popup-component >>> #dueDate", "2024-12-31T23:59");
    await page.select("popup-component >>> #priority", "P1");
    await page.type("popup-component >>> #label", "Test Label");
    await page.type("popup-component >>> #expectedTime", "2 hours");

    await page.$eval("popup-component >>> #taskForm", (form) => form.submit());

    // Wait for the form to be submitted and the popup to close
    await page.waitForSelector("popup-component >>> .popup-container", {
      hidden: true,
    });

    const tasks = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("tasks"));
    });

    expect(tasks).toHaveLength(1);
    expect(tasks[0].task_name).toBe("Test Task");
    expect(tasks[0].task_content).toBe("This is a test description");
  });

  it("should reset the form after submission", async () => {
    await page.click("#open-popup");
    await page.waitForSelector("popup-component >>> .popup-container");

    await page.$eval("popup-component >>> #taskForm", (form) => form.submit());

    // Wait for the form to be submitted and the popup to close
    await page.waitForSelector("popup-component >>> .popup-container", {
      hidden: true,
    });

    await page.click("#open-popup");
    await page.waitForSelector("popup-component >>> .popup-container");

    const titleValue = await page.$eval(
      "popup-component >>> #title",
      (el) => el.value
    );
    const descriptionValue = await page.$eval(
      "popup-component >>> #description",
      (el) => el.value
    );
    const dueDateValue = await page.$eval(
      "popup-component >>> #dueDate",
      (el) => el.value
    );
    const priorityValue = await page.$eval(
      "popup-component >>> #priority",
      (el) => el.value
    );
    const labelValue = await page.$eval(
      "popup-component >>> #label",
      (el) => el.value
    );
    const expectedTimeValue = await page.$eval(
      "popup-component >>> #expectedTime",
      (el) => el.value
    );

    expect(titleValue).toBe("");
    expect(descriptionValue).toBe("");
    expect(dueDateValue).toBe("");
    expect(priorityValue).toBe("");
    expect(labelValue).toBe("");
    expect(expectedTimeValue).toBe("");
  });

  it("should close the popup when clicking outside", async () => {
    await page.click("#open-popup");
    await page.waitForSelector("popup-component >>> .popup-container");

    await page.click("popup-component >>> .overlay");

    const isPopupVisible = await page.$("popup-component >>> .popup-container");
    expect(isPopupVisible).toBeNull();
  });

  it("should close the popup when clicking the close button", async () => {
    await page.click("#open-popup");
    await page.waitForSelector("popup-component >>> .popup-container");

    await page.click("popup-component >>> #closeBtn");

    const isPopupVisible = await page.$("popup-component >>> .popup-container");
    expect(isPopupVisible).toBeNull();
  });
});