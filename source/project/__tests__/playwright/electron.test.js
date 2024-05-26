import { test, _electron as electron } from "@playwright/test";
import { expect } from "@playwright/test";

const mainLocation = "./source/project/scripts/main.cjs";

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
