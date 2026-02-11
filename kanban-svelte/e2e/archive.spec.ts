import { test, expect } from '@playwright/test';
import { createTask, clearAllTasks, getTaskCountInColumn, moveTaskToStatus } from './helpers';

test.describe('Archive Feature', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await clearAllTasks(page);
	});

	test('should show archive button when Done column has tasks', async ({ page }) => {
		await createTask(page, { title: 'Completed Task' });
		await moveTaskToStatus(page, 'Completed Task', 'Done');

		// Archive button should be visible
		await expect(page.locator('button:has-text("Archive All")')).toBeVisible();
	});

	test('should not show archive button when Done column is empty', async ({ page }) => {
		await expect(page.locator('button:has-text("Archive All")')).not.toBeVisible();
	});

	test('should archive all done tasks', async ({ page }) => {
		// Create tasks directly in localStorage to avoid multiple reloads
		await page.evaluate(() => {
			const data = {
				version: '1.0',
				tasks: [
					{ id: '1', title: 'Completed Task 1', status: 'Done', order: 0, description: '', priority: 'High', dueDate: '', tags: [] },
					{ id: '2', title: 'Completed Task 2', status: 'Done', order: 1, description: '', priority: 'Medium', dueDate: '', tags: [] }
				]
			};
			localStorage.setItem('kanban-board', JSON.stringify(data));
		});

		// Reload to pick up localStorage
		await page.reload({ waitUntil: 'networkidle' });

		// Debug: check localStorage
		const stored = await page.evaluate(() => localStorage.getItem('kanban-board'));
		console.log('Stored data:', stored);

		expect(await getTaskCountInColumn(page, 'Done')).toBe(2);

		// Set up download handler before clicking
		const downloadPromise = page.waitForEvent('download');

		// Accept confirm dialog and click archive
		page.once('dialog', dialog => dialog.accept());
		await page.click('button:has-text("Archive All")');

		// Wait for download
		const download = await downloadPromise;
		expect(download.suggestedFilename()).toMatch(/archived-tasks.*\.json/);

		// Verify Done column is empty
		expect(await getTaskCountInColumn(page, 'Done')).toBe(0);
	});

	test('should cancel archive operation', async ({ page }) => {
		await createTask(page, { title: 'Task to Keep' });
		await moveTaskToStatus(page, 'Task to Keep', 'Done');

		// Dismiss confirm dialog
		page.on('dialog', dialog => dialog.dismiss());
		await page.click('button:has-text("Archive All")');

		// Task should still exist
		expect(await getTaskCountInColumn(page, 'Done')).toBe(1);
	});
});
