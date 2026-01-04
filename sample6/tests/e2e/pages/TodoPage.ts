import { Page } from '@playwright/test';

export class TodoPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:5173/');
    await this.page.waitForLoadState('networkidle');
  }

  async addTask(text: string) {
    await this.page.fill('input[type="text"]', text);
    await this.page.click('button:has-text("Add")');
    // Wait a bit for state updates
    await this.page.waitForTimeout(100);
  }

  async deleteTask(text: string) {
    const todoItem = this.page.locator('.todo-item', { hasText: text });
    await todoItem.locator('button:has-text("Delete")').click();
    await this.page.waitForTimeout(100);
  }

  async toggleTask(text: string) {
    const todoItem = this.page.locator('.todo-item', { hasText: text });
    await todoItem.locator('input[type="checkbox"]').click();
    await this.page.waitForTimeout(100);
  }

  async getTaskCount(): Promise<number> {
    const tasks = await this.page.locator('.todo-item').count();
    return tasks;
  }

  async getTaskTexts(): Promise<string[]> {
    const taskElements = await this.page.locator('.todo-item span').allTextContents();
    return taskElements.filter(text => text.trim() !== '');
  }

  async isTaskCompleted(text: string): Promise<boolean> {
    const todoItem = this.page.locator('.todo-item', { hasText: text });
    const span = todoItem.locator('span').first();
    const className = await span.getAttribute('class');
    return className?.includes('completed') || false;
  }

  async getErrorMessage(): Promise<string | null> {
    // Check for system error messages (ErrorMessage component)
    const systemErrorElement = this.page.locator('.error-message');
    const isSystemErrorVisible = await systemErrorElement.isVisible().catch(() => false);
    if (isSystemErrorVisible) {
      return await systemErrorElement.textContent();
    }
    
    // Check for validation error messages (TodoInput component)
    const validationErrorElement = this.page.locator('.error');
    const isValidationErrorVisible = await validationErrorElement.isVisible().catch(() => false);
    if (isValidationErrorVisible) {
      return await validationErrorElement.textContent();
    }
    
    return null;
  }

  async hasEmptyState(): Promise<boolean> {
    const emptyState = this.page.locator('.empty-state');
    return await emptyState.isVisible().catch(() => false);
  }

  async getEmptyStateText(): Promise<string | null> {
    const emptyState = this.page.locator('.empty-state');
    const isVisible = await emptyState.isVisible().catch(() => false);
    if (!isVisible) {
      return null;
    }
    return await emptyState.textContent();
  }
}
