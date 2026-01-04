import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { TodoPage } from '../pages/TodoPage.js';

// Helper step - reusing from add_task.steps.ts
Given('I have added a task {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.addTask(taskText);
});

// Helper step for marking task as completed
When('I mark the task {string} as completed', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.toggleTask(taskText);
});

// Helper step for deleting a task
When('I delete the task {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.deleteTask(taskText);
});

// Reload the page
When('I reload the page', async function (this: CustomWorld) {
  await this.page!.reload();
});

// Check if task is marked as completed
Then('the task {string} should be marked as completed', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const isCompleted = await todoPage.isTaskCompleted(taskText);
  expect(isCompleted).toBe(true);
});

// Check if task is NOT marked as completed
Then('the task {string} should not be marked as completed', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const isCompleted = await todoPage.isTaskCompleted(taskText);
  expect(isCompleted).toBe(false);
});

// Check that task is NOT in the list
Then('I should not see {string} in the task list', async function (this: CustomWorld, taskText: string) {
  const locator = this.page!.locator(`li:has-text("${taskText}")`);
  await expect(locator).toHaveCount(0);
});

// localStorage specific steps

Given('localStorage is empty', async function (this: CustomWorld) {
  // Navigate to the page first (if not already there)
  if (!this.page!.url().includes('localhost:5173')) {
    const todoPage = new TodoPage(this.page!);
    await todoPage.goto();
  }
  // Clear localStorage
  await this.page!.evaluate(() => localStorage.clear());
});

When('I visit the TODO app page for the first time', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.goto();
});

Then('I should see an empty task list', async function (this: CustomWorld) {
  const taskList = this.page!.locator('ul li');
  await expect(taskList).toHaveCount(0);
});

Then('I should see the empty state message', async function (this: CustomWorld) {
  const emptyMessage = this.page!.locator('text=No tasks available');
  await expect(emptyMessage).toBeVisible();
});

Given('localStorage contains corrupted data', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.goto();
  
  // Insert corrupted JSON data into localStorage
  await this.page!.evaluate(() => {
    localStorage.setItem('react-todo-app-tasks', '{invalid json}');
  });
});

When('I visit the TODO app page', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.goto();
});

Then('localStorage should be reset with an empty list', async function (this: CustomWorld) {
  const storageData = await this.page!.evaluate(() => {
    const data = localStorage.getItem('react-todo-app-tasks');
    return data ? JSON.parse(data) : null;
  });
  expect(storageData).toEqual([]);
});

Given('localStorage is not available', async function (this: CustomWorld) {
  // Override localStorage BEFORE navigating to the page
  // This ensures the app detects unavailability during initialization
  await this.page!.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get: () => {
        throw new Error('localStorage is not available');
      },
      configurable: true
    });
  });
  
  const todoPage = new TodoPage(this.page!);
  await todoPage.goto();
});

Then('the app should be in a disabled state', async function (this: CustomWorld) {
  // Check that the add button is disabled
  const addButton = this.page!.locator('button:has-text("Add")');
  await expect(addButton).toBeDisabled();
});
