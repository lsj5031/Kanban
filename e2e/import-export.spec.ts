import { test, expect } from '@playwright/test';
import { createTask, clearAllTasks, getTaskTitlesInColumn } from './helpers';
import fs from 'fs';
import path from 'path';

test.describe('Import/Export', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await clearAllTasks(page);
	});

	test('should export tasks as JSON', async ({ page }) => {
		await createTask(page, { title: 'Export Task 1', priority: 'High' });
		await createTask(page, { title: 'Export Task 2', priority: 'Low' });

		const downloadPromise = page.waitForEvent('download');
		await page.click('button:has-text("Export")');

		const download = await downloadPromise;
		expect(download.suggestedFilename()).toBe('kanban-board.json');

		// Verify content
		const path = await download.path();
		if (path) {
			const content = JSON.parse(fs.readFileSync(path, 'utf8'));
			expect(content.cards).toHaveLength(2);
			expect(content.cards[0].title).toBe('Export Task 1');
		}
	});

	test('should import tasks from JSON file', async ({ page }) => {
		const importData = {
			cards: [
				{
					id: 'import-1',
					title: 'Imported Task',
					description: 'From JSON file',
					status: 'To Do',
					order: 0,
					priority: 'High',
					dueDate: '',
					tags: ['imported', 'test']
				}
			]
		};

		// Create temp file
		const tempPath = '/tmp/test-import.json';
		fs.writeFileSync(tempPath, JSON.stringify(importData));

		// Upload file using the correct Playwright API
		await page.setInputFiles('input[type="file"]', tempPath);

		// Wait for import to complete
		await page.waitForTimeout(500);

		// Verify imported task appears
		const titles = await getTaskTitlesInColumn(page, 'To Do');
		expect(titles).toContain('Imported Task');

		// Cleanup
		fs.unlinkSync(tempPath);
	});

	test('should handle empty export', async ({ page }) => {
		// No tasks created

		const downloadPromise = page.waitForEvent('download');
		await page.click('button:has-text("Export")');

		const download = await downloadPromise;
		const filePath = await download.path();
		if (filePath) {
			const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			expect(content.cards).toHaveLength(0);
		}
	});
});
