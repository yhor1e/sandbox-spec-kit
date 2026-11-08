import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("adds a task, announces it, and retains it after reload", async ({ page }) => {
  await page.getByLabel("New task").fill("Buy milk");
  await page.getByRole("button", { name: "Add task" }).click();

  await expect(page.getByText("Buy milk", { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Added: Buy milk");

  await page.reload();

  await expect(page.getByText("Buy milk", { exact: true })).toBeVisible();
});

test("rejects an empty task description", async ({ page }) => {
  await page.getByLabel("New task").fill("   ");
  await page.getByRole("button", { name: "Add task" }).click();

  await expect(page.getByRole("alert")).toHaveText("Enter a task before adding it.");
  await expect(page.getByRole("listitem")).toHaveCount(0);
});

test("completes and restores a task with keyboard operation", async ({ page }) => {
  await page.getByLabel("New task").fill("Read book");
  await page.getByRole("button", { name: "Add task" }).click();

  const completionControl = page.getByRole("checkbox", { name: "Complete: Read book" });
  await completionControl.focus();
  await page.keyboard.press("Space");

  await expect(completionControl).toBeChecked();
  await expect(page.getByRole("status")).toHaveText("Completed: Read book");

  await page.reload();
  await expect(page.getByRole("checkbox", { name: "Complete: Read book" })).toBeChecked();

  await page.getByRole("checkbox", { name: "Complete: Read book" }).press("Space");
  await expect(page.getByRole("checkbox", { name: "Complete: Read book" })).not.toBeChecked();
  await expect(page.getByRole("status")).toHaveText("Restored: Read book");
});

test("deletes a task immediately and moves focus to the next task", async ({ page }) => {
  for (const task of ["First task", "Second task"]) {
    await page.getByLabel("New task").fill(task);
    await page.getByRole("button", { name: "Add task" }).click();
  }

  const firstDeleteButton = page.getByRole("button", { name: "Delete: First task" });
  await firstDeleteButton.focus();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByText("Second task", { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Deleted: First task");
  await expect(page.getByRole("checkbox", { name: "Complete: Second task" })).toBeFocused();

  await page.reload();
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByText("Second task", { exact: true })).toBeVisible();

  const secondDeleteButton = page.getByRole("button", { name: "Delete: Second task" });
  await secondDeleteButton.focus();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByLabel("New task")).toBeFocused();
});

test("starts with an empty list and a warning when saved data is corrupt", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem("todo-app:v1", "{invalid-json");
  });
  await page.reload();

  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.locator("#persistence-warning")).toHaveText(
    "Saved tasks could not be read. Starting with an empty list."
  );
});

test("shows a warning when browser storage is unavailable during loading", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.goto("/");

  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.locator("#persistence-warning")).toHaveText(
    "Saved tasks are unavailable. Changes may not be saved."
  );
});

test("keeps an added task visible when browser storage fails", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage is unavailable", "QuotaExceededError");
    };
  });
  await page.goto("/");

  await page.getByLabel("New task").fill("Unsaved task");
  await page.getByRole("button", { name: "Add task" }).click();

  await expect(page.getByText("Unsaved task", { exact: true })).toBeVisible();
  await expect(page.locator("#persistence-warning")).toHaveText(
    "Changes may not be saved in this browser."
  );
});
