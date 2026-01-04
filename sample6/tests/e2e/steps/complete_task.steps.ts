import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { TodoPage } from '../pages/TodoPage.js';

Given('I have a task {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.addTask(taskText);
});

Given('the task is incomplete', async function (this: CustomWorld) {
  // Task is incomplete by default, nothing to do
});

Given('the task is marked as complete', async function (this: CustomWorld) {
  // Mark the last added task as complete
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  await todoPage.toggleTask(lastTask);
});

Given('I have an incomplete task {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.addTask(taskText);
});

When('I click the checkbox for {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.toggleTask(taskText);
});

When('I click the checkbox for {string} again', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.toggleTask(taskText);
});

When('I mark the task as complete', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  // We need to get the task from context - for now use the last added task
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  await todoPage.toggleTask(lastTask);
});

Then('the task should be marked as complete', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  const isCompleted = await todoPage.isTaskCompleted(lastTask);
  expect(isCompleted).toBe(true);
});

Then('the task text should be grayed out', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  const isCompleted = await todoPage.isTaskCompleted(lastTask);
  expect(isCompleted).toBe(true);
});

Then('the task should be marked as incomplete', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  const isCompleted = await todoPage.isTaskCompleted(lastTask);
  expect(isCompleted).toBe(false);
});

Then('the task text should not be grayed out', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  const isCompleted = await todoPage.isTaskCompleted(lastTask);
  expect(isCompleted).toBe(false);
});

Then('the task text should have a grayed out appearance', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  const isCompleted = await todoPage.isTaskCompleted(lastTask);
  expect(isCompleted).toBe(true);
});

Then('the checkbox should be checked', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  const todoItem = this.page!.locator('.todo-item', { hasText: lastTask });
  const checkbox = todoItem.locator('input[type="checkbox"]');
  const isChecked = await checkbox.isChecked();
  expect(isChecked).toBe(true);
});
