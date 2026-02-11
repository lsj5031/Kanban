import { test, expect } from '@playwright/test';
import { clearAllTasks, getTaskCountInColumn } from './helpers';

test.describe('Board Display', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await clearAllTasks(page);
	});

	test('should display three default columns', async ({ page }) => {
		await expect(page.locator('h2:has-text("To Do")')).toBeVisible();
		await expect(page.locator('h2:has-text("In Progress")')).toBeVisible();
		await expect(page.locator('h2:has-text("Done")')).toBeVisible();
	});

	test('should show empty state for empty columns', async ({ page }) => {
		await expect(page.locator('text=No tasks')).toHaveCount(3);
	});

	test('should show correct task count in column headers', async ({ page }) => {
		const todoCount = page.locator('h2:has-text("To Do") + .task-count, .column-title:has(h2:has-text("To Do")) .task-count');
		await expect(todoCount).toHaveText('0');
	});
});

test.describe('Reset Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should reset board and clear all tasks', async ({ page }) => {
		// Create some tasks first via localStorage
		await page.evaluate(() => {
			localStorage.setItem('kanban-board', JSON.stringify({
				version: '1.0',
				tasks: [
					{ id: '1', title: 'Task 1', status: 'To Do', order: 0, description: '', priority: '', dueDate: '', tags: [] },
					{ id: '2', title: 'Task 2', status: 'Done', order: 0, description: '', priority: '', dueDate: '', tags: [] }
				]
			}));
		});
		await page.reload({ waitUntil: 'networkidle' });

		// Verify tasks exist
		expect(await getTaskCountInColumn(page, 'To Do')).toBe(1);

		// Accept confirm dialog and reset
		page.once('dialog', dialog => dialog.accept());
		await page.click('button:has-text("Reset")');

		// Wait for reset to complete
		await page.waitForTimeout(500);

		// Verify all columns empty
		expect(await getTaskCountInColumn(page, 'To Do')).toBe(0);
		expect(await getTaskCountInColumn(page, 'In Progress')).toBe(0);
		expect(await getTaskCountInColumn(page, 'Done')).toBe(0);
	});
});
