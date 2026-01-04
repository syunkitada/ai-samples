import { test, expect } from '@playwright/test';

test.describe('Manual Testing - Verify-3', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Chrome - Basic functionality', async ({ page }) => {
    // Empty state表示の確認
    await expect(page.getByText('No tasks available')).toBeVisible();

    // タスク追加
    await page.getByRole('textbox', { name: /task/i }).fill('Test task in Chrome');
    await page.getByRole('button', { name: /add/i }).click();

    // タスクが表示されることを確認
    await expect(page.getByText('Test task in Chrome')).toBeVisible();

    // タスクを完了にする
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // タスクを削除
    await page.getByRole('button', { name: /delete/i }).first().click();
    await expect(page.getByText('No tasks available')).toBeVisible();
  });

  test('Keyboard navigation', async ({ page }) => {
    // 入力フィールドにフォーカス
    const input = page.getByRole('textbox', { name: /task/i });
    await input.focus();
    await page.keyboard.type('Keyboard test task');
    
    // Enterキーでタスク追加
    await page.keyboard.press('Enter');
    await expect(page.getByText('Keyboard test task')).toBeVisible();

    // チェックボックスに直接フォーカスを当てる
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.focus();
    
    // Spaceキーでチェックボックスをトグル
    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();

    // 削除ボタンにフォーカスを当てる
    const deleteButton = page.getByRole('button', { name: /delete/i }).first();
    await deleteButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('No tasks available')).toBeVisible();
  });

  test('Accessibility - ARIA attributes', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /task/i });
    
    // 初期状態ではaria-invalidがない
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');

    // 空のタスクを追加しようとする
    await page.getByRole('button', { name: /add/i }).click();
    
    // エラーメッセージが表示される
    const errorMessage = page.getByText('Task cannot be empty');
    await expect(errorMessage).toBeVisible();

    // aria-invalidがtrueに設定される
    await expect(input).toHaveAttribute('aria-invalid', 'true');

    // aria-describedbyがエラーメッセージを参照している
    const ariaDescribedBy = await input.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBeTruthy();

    // 有効なタスクを追加
    await input.fill('Valid task');
    await page.getByRole('button', { name: /add/i }).click();

    // エラーが消え、aria-invalidがfalseになる
    await expect(errorMessage).not.toBeVisible();
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('Accessibility - Screen reader labels', async ({ page }) => {
    // タスクを追加
    await page.getByRole('textbox', { name: /task/i }).fill('Accessibility test');
    await page.getByRole('button', { name: /add/i }).click();

    // チェックボックスにaria-labelが設定されている
    const checkbox = page.locator('input[type="checkbox"]').first();
    const checkboxLabel = await checkbox.getAttribute('aria-label');
    expect(checkboxLabel).toContain('Accessibility test');

    // 削除ボタンにaria-labelが設定されている
    const deleteButton = page.getByRole('button', { name: /delete/i }).first();
    const deleteLabel = await deleteButton.getAttribute('aria-label');
    expect(deleteLabel).toContain('Accessibility test');
  });

  test('Multiple tasks interaction', async ({ page }) => {
    // 複数のタスクを追加
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    for (const task of tasks) {
      await page.getByRole('textbox', { name: /task/i }).fill(task);
      await page.getByRole('button', { name: /add/i }).click();
    }

    // すべてのタスクが表示される
    for (const task of tasks) {
      await expect(page.getByText(task)).toBeVisible();
    }

    // 2つ目のタスクを完了にする
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(1).check();
    await expect(checkboxes.nth(1)).toBeChecked();

    // 他のタスクは未完了のまま
    await expect(checkboxes.nth(0)).not.toBeChecked();
    await expect(checkboxes.nth(2)).not.toBeChecked();

    // 1つ目のタスクを削除
    const deleteButtons = page.getByRole('button', { name: /delete/i });
    await deleteButtons.first().click();
    
    // Task 1が消え、Task 2とTask 3が残る
    await expect(page.getByText('Task 1')).not.toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
  });

  test('Validation - Character limit', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /task/i });

    // 128文字のタスク（有効）
    const validTask = 'a'.repeat(128);
    await input.fill(validTask);
    await page.getByRole('button', { name: /add/i }).click();
    await expect(page.getByText('a'.repeat(20))).toBeVisible(); // 最初の20文字が表示されればOK

    // 129文字のタスク（無効）
    const invalidTask = 'b'.repeat(129);
    await input.fill(invalidTask);
    await page.getByRole('button', { name: /add/i }).click();
    await expect(page.getByText('Task must be 128 characters or less')).toBeVisible();
  });

  test('Visual appearance - Completed tasks', async ({ page }) => {
    // タスクを追加
    await page.getByRole('textbox', { name: /task/i }).fill('Visual test');
    await page.getByRole('button', { name: /add/i }).click();

    // タスクのspan要素を取得
    const taskSpan = page.locator('.todo-item span', { hasText: 'Visual test' });
    
    // 初期状態のスタイルを確認（completedクラスがない）
    await expect(taskSpan).not.toHaveClass(/completed/);

    // タスクを完了にする
    await page.locator('input[type="checkbox"]').first().check();

    // 完了後のスタイルを確認（completedクラスが適用される）
    await expect(taskSpan).toHaveClass(/completed/);
    
    // CSSが正しく適用されているか確認（line-through と color: #999）
    const textDecoration = await taskSpan.evaluate((el) => {
      return window.getComputedStyle(el).textDecoration;
    });
    const color = await taskSpan.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    expect(textDecoration).toContain('line-through');
    // color: #999 is rgb(153, 153, 153)
    expect(color).toBe('rgb(153, 153, 153)');
  });
});
