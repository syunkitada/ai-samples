import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { TodoPage } from '../pages/TodoPage.js';

Given('I have a completed task {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.addTask(taskText);
  await todoPage.toggleTask(taskText);
});

Given('I have the following tasks:', async function (this: CustomWorld, dataTable) {
  const todoPage = new TodoPage(this.page!);
  
  const tasks = dataTable.hashes();
  for (const task of tasks) {
    await todoPage.addTask(task['Task name']);
    if (task['Status'] === 'complete') {
      await todoPage.toggleTask(task['Task name']);
    }
  }
});

Given('I have {int} tasks', async function (this: CustomWorld, count: number) {
  const todoPage = new TodoPage(this.page!);
  
  for (let i = 1; i <= count; i++) {
    await todoPage.addTask(`Task ${i}`);
  }
});

When('I click the delete button for {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.deleteTask(taskText);
});

When('I delete {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.deleteTask(taskText);
});

When('I delete all tasks one by one', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  let taskCount = await todoPage.getTaskCount();
  
  while (taskCount > 0) {
    const tasks = await todoPage.getTaskTexts();
    await todoPage.deleteTask(tasks[0]);
    taskCount = await todoPage.getTaskCount();
  }
});

Then('the task {string} should be removed from the list', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  expect(tasks).not.toContain(taskText);
});

Then('{string} should not be in the list', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  expect(tasks).not.toContain(taskText);
});

Then('{string} should still be in the list', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  expect(tasks).toContain(taskText);
});

Then('the task list should be empty', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const taskCount = await todoPage.getTaskCount();
  expect(taskCount).toBe(0);
});

Then('I should see {string} message', async function (this: CustomWorld, message: string) {
  const todoPage = new TodoPage(this.page!);
  const emptyStateText = await todoPage.getEmptyStateText();
  expect(emptyStateText).toContain(message);
});
