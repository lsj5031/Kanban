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

	test('should show archive modal dialog', async ({ page }) => {
		// Create tasks directly in localStorage
		await page.evaluate(() => {
			const data = {
				version: '1.0',
				tasks: [
					{ id: '1', title: 'Completed Task 1', status: 'Done', order: 0, description: '', priority: 'High', dueDate: '', tags: [] }
				]
			};
			localStorage.setItem('kanban-board', JSON.stringify(data));
		});
		await page.reload({ waitUntil: 'networkidle' });

		// Wait for the archive button to be visible
		const archiveBtn = page.locator('button.archive-btn:has-text("Archive All")');
		await expect(archiveBtn).toBeVisible();

		// Click archive button and wait for response
		await archiveBtn.click({ force: true });

		// Wait for modal animation
		await page.waitForTimeout(500);

		// Modal should appear - use a more specific selector
		const archiveModal = page.getByRole('dialog').filter({ hasText: 'Archive Completed Tasks' });
		await expect(archiveModal).toBeVisible({ timeout: 5000 });
	});

	test('should cancel archive operation via modal', async ({ page }) => {
		await createTask(page, { title: 'Task to Keep' });
		await moveTaskToStatus(page, 'Task to Keep', 'Done');

		// Click archive button
		await page.click('button:has-text("Archive All")');

		// Modal should appear
		await expect(page.locator('.modal:has-text("Archive Completed Tasks")')).toBeVisible();

		// Click cancel
		await page.click('.modal button:has-text("Cancel")');

		// Modal should close
		await expect(page.locator('.modal:has-text("Archive Completed Tasks")')).not.toBeVisible();

		// Task should still exist
		expect(await getTaskCountInColumn(page, 'Done')).toBe(1);
	});

	test('should close archive modal with Escape key', async ({ page }) => {
		await createTask(page, { title: 'Task for Escape' });
		await moveTaskToStatus(page, 'Task for Escape', 'Done');

		// Click archive button
		await page.click('button:has-text("Archive All")');
		await expect(page.locator('.modal:has-text("Archive Completed Tasks")')).toBeVisible();

		// Press Escape
		await page.keyboard.press('Escape');

		// Modal should close
		await expect(page.locator('.modal:has-text("Archive Completed Tasks")')).not.toBeVisible();

		// Task should still exist
		expect(await getTaskCountInColumn(page, 'Done')).toBe(1);
	});

	test('should archive all done tasks via modal', async ({ page }) => {
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

		expect(await getTaskCountInColumn(page, 'Done')).toBe(2);

		// Set up download handler before clicking
		const downloadPromise = page.waitForEvent('download');

		// Click archive button
		await page.click('button:has-text("Archive All")');

		// Modal should appear
		await expect(page.locator('.modal:has-text("Archive Completed Tasks")')).toBeVisible();

		// Confirm archive
		await page.click('.modal button:has-text("Archive All")');

		// Wait for download
		const download = await downloadPromise;
		expect(download.suggestedFilename()).toMatch(/archived-tasks.*\.json/);

		// Modal should close
		await expect(page.locator('.modal:has-text("Archive Completed Tasks")')).not.toBeVisible();

		// Verify Done column is empty
		expect(await getTaskCountInColumn(page, 'Done')).toBe(0);
	});
});
