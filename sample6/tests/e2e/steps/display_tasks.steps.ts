import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { TodoPage } from '../pages/TodoPage.js';

Given('I have no tasks', async function (this: CustomWorld) {
  // Nothing to do - no tasks by default
});

When('I add the following tasks in order:', async function (this: CustomWorld, dataTable) {
  const todoPage = new TodoPage(this.page!);
  
  const tasks = dataTable.hashes();
  for (const task of tasks) {
    await todoPage.addTask(task['Task name']);
  }
});

When('I add a new task {string}', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  await todoPage.addTask(taskText);
});

Then('the task {string} should be displayed', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  expect(tasks).toContain(taskText);
});

Then('the tasks should be displayed in this order:', async function (this: CustomWorld, dataTable) {
  const todoPage = new TodoPage(this.page!);
  const expectedTasks = dataTable.hashes().map((row: { 'Task name': string }) => row['Task name']);
  const actualTasks = await todoPage.getTaskTexts();
  
  for (let i = 0; i < expectedTasks.length; i++) {
    expect(actualTasks[i]).toBe(expectedTasks[i]);
  }
});

Then('{string} should appear grayed out', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const isCompleted = await todoPage.isTaskCompleted(taskText);
  expect(isCompleted).toBe(true);
});

Then('{string} should not appear grayed out', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const isCompleted = await todoPage.isTaskCompleted(taskText);
  expect(isCompleted).toBe(false);
});

Then('{string} should be the last task in the list', async function (this: CustomWorld, taskText: string) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  const lastTask = tasks[tasks.length - 1];
  expect(lastTask).toBe(taskText);
});

Then('I should see {int} task in the list', async function (this: CustomWorld, count: number) {
  const todoPage = new TodoPage(this.page!);
  const taskCount = await todoPage.getTaskCount();
  expect(taskCount).toBe(count);
});

When('I delete the second task', async function (this: CustomWorld) {
  const todoPage = new TodoPage(this.page!);
  const tasks = await todoPage.getTaskTexts();
  if (tasks.length >= 2) {
    await todoPage.deleteTask(tasks[1]);
  }
});
