import { test, expect } from '@playwright/test';
import { createTask, clearAllTasks, getTaskCountInColumn } from './helpers';

test.describe('Tag Filtering', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await clearAllTasks(page);
	});

	test('should filter tasks by tag', async ({ page }) => {
		await createTask(page, { title: 'Important Task', tags: 'important;work' });
		await createTask(page, { title: 'Other Task', tags: 'other' });

		// Both tasks visible initially
		expect(await getTaskCountInColumn(page, 'To Do')).toBe(2);

		// Click tag filter
		await page.click('[aria-label="Filter by tag important"]');

		// Filtered task should NOT have .dimmed class, other should have it
		const importantTask = page.locator('.task-card:has-text("Important Task")');
		const otherTask = page.locator('.task-card:has-text("Other Task")');

		await expect(importantTask).not.toHaveClass(/dimmed/);
		await expect(otherTask).toHaveClass(/dimmed/);
	});

	test('should toggle tag filter off', async ({ page }) => {
		await createTask(page, { title: 'Tagged Task', tags: 'test' });

		// Enable filter
		await page.click('[aria-label="Filter by tag test"]');
		await expect(page.locator('.task-card')).toBeVisible();

		// Disable filter
		await page.click('[aria-label="Filter by tag test"]');

		// All tasks visible again (no dimmed class)
		const task = page.locator('.task-card');
		await expect(task).not.toHaveClass(/dimmed/);
	});

	test('should filter by multiple tags', async ({ page }) => {
		await createTask(page, { title: 'Task A', tags: 'work;urgent' });
		await createTask(page, { title: 'Task B', tags: 'work' });
		await createTask(page, { title: 'Task C', tags: 'personal' });

		// Filter by 'work'
		await page.click('[aria-label="Filter by tag work"]');

		// Tasks with 'work' tag should not be dimmed
		const taskA = page.locator('.task-card:has-text("Task A")');
		const taskB = page.locator('.task-card:has-text("Task B")');
		const taskC = page.locator('.task-card:has-text("Task C")');

		await expect(taskA).not.toHaveClass(/dimmed/);
		await expect(taskB).not.toHaveClass(/dimmed/);
		await expect(taskC).toHaveClass(/dimmed/);
	});
});
