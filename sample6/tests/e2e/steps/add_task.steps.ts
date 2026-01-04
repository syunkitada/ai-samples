import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { TodoPage } from '../pages/TodoPage.js';

Given('I am on the TODO app page', async function (this: CustomWorld) {
  if (!this.page) {
    throw new Error('Page not initialized');
  }
  const todoPage = new TodoPage(this.page);
  await todoPage.goto();
});

When('I enter {string} in the task input field', async function (this: CustomWorld, taskText: string) {
  await this.page!.fill('input[type="text"]', taskText);
});

When('I click the add button', async function (this: CustomWorld) {
  await this.page!.click('button:has-text("Add")');
  await this.page!.waitForTimeout(100);
});

When('I leave the task input field empty', async function (this: CustomWorld) {
  await this.page!.fill('input[type="text"]', '');
});

When('I enter a task with {int} characters', async function (this: CustomWorld, charCount: number) {
  const longTask = 'a'.repeat(charCount);
  await this.page!.fill('input[type="text"]', longTask);
});

When('I enter a task with exactly {int} characters', async function (this: CustomWorld, charCount: number) {
  const task = 'a'.repeat(charCount);
  await this.page!.fill('input[type="text"]', task);
});

When('I add a task {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.addTask(taskText);
});

Then('I should see {string} in the task list', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  expect(tasks).toContain(taskText);
});

Then('I should see an error message {string}', async function (this: CustomWorld, errorMessage: string) {
  const todoPage = new TodoPage(this.page!);
  const actualError = await todoPage.getErrorMessage();
  expect(actualError).toBe(errorMessage);
});

Then('the task should not be added to the list', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const hasEmptyState = await todoPage.hasEmptyState();
  if (hasEmptyState) {
    // No tasks exist at all
    const taskCount = await todoPage.getTaskCount();
    expect(taskCount).toBe(0);
  } else {
    // Check that the last operation didn't add a task
    // This is tricky - we'll verify via the empty state or error presence
    const error = await todoPage.getErrorMessage();
    expect(error).not.toBeNull();
  }
});

Then('the task should be added to the list', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const taskCount = await todoPage.getTaskCount();
  expect(taskCount).toBeGreaterThan(0);
});

Then('I should see {int} tasks in the list', async function (this: CustomWorld, expectedCount: number) {
  const todoPage = new TodoPage(this.page!);
  const taskCount = await todoPage.getTaskCount();
  expect(taskCount).toBe(expectedCount);
});

Then('the tasks should be displayed in the order they were added', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  expect(tasks[0]).toBe('Task 1');
  expect(tasks[1]).toBe('Task 2');
  expect(tasks[2]).toBe('Task 3');
});
