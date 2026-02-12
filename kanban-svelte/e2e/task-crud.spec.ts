import { test, expect } from '@playwright/test';
import { createTask, clearAllTasks, getTaskCountInColumn, getTaskTitlesInColumn } from './helpers';

test.describe('Task CRUD Operations', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await clearAllTasks(page);
	});

	test('should create a new task', async ({ page }) => {
		await createTask(page, {
			title: 'New Test Task',
			description: 'Test description',
			priority: 'High',
			tags: 'test;e2e'
		});

		// Verify task appears in To Do column
		const titles = await getTaskTitlesInColumn(page, 'To Do');
		expect(titles).toContain('New Test Task');

		// Verify priority badge
		await expect(page.locator('.priority-badge.high')).toBeVisible();
	});

	test('should edit task title', async ({ page }) => {
		await createTask(page, { title: 'Task to Edit' });

		// Verify task was created
		await expect(page.getByRole('heading', { name: 'Task to Edit' })).toBeVisible();

		// Click edit button
		await page.getByLabel('Edit task').click();

		// Wait for modal
		await expect(page.locator('.modal')).toBeVisible();

		// Check the current value
		const titleInput = page.getByLabel('Task Title');
		await expect(titleInput).toHaveValue('Task to Edit');

		// Fill new title
		await titleInput.fill('Edited Task Title');
		await expect(titleInput).toHaveValue('Edited Task Title');

		// Submit
		await page.getByRole('button', { name: 'Commit Task' }).click();

		// Modal should close
		await expect(page.locator('.modal')).not.toBeVisible();

		// Reload to verify persistence
		await page.reload();

		// After reload, the edited title should appear
		await expect(page.getByRole('heading', { name: 'Edited Task Title' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Task to Edit' })).not.toBeVisible();
	});

	test('should edit task description', async ({ page }) => {
		await createTask(page, { title: 'Task With Description', description: 'Original description' });

		// Click edit button
		await page.getByLabel('Edit task').click();
		await expect(page.locator('.modal')).toBeVisible();

		// Update description
		const descInput = page.getByLabel('Description');
		await descInput.fill('Updated description text');
		await page.getByRole('button', { name: 'Commit Task' }).click();

		// Verify via edit modal
		await page.getByLabel('Edit task').click();
		await expect(descInput).toHaveValue('Updated description text');
		await page.getByRole('button', { name: 'Cancel' }).click();
	});

	test('should edit task priority', async ({ page }) => {
		await createTask(page, { title: 'Task With Priority', priority: 'Low' });

		// Verify low priority
		await expect(page.locator('.priority-badge.low')).toBeVisible();

		// Click edit button
		await page.getByLabel('Edit task').click();
		await expect(page.locator('.modal')).toBeVisible();

		// Change priority to High
		await page.selectOption('#taskPriority', 'High');
		await page.getByRole('button', { name: 'Commit Task' }).click();

		// Reload and verify
		await page.reload();
		await expect(page.locator('.priority-badge.high')).toBeVisible();
	});

	test('should edit task due date', async ({ page }) => {
		await createTask(page, { title: 'Task With Due Date' });

		// Click edit button
		await page.getByLabel('Edit task').click();
		await expect(page.locator('.modal')).toBeVisible();

		// Set due date
		const dateInput = page.getByLabel('Due Date');
		await dateInput.fill('2025-12-31');
		await page.getByRole('button', { name: 'Commit Task' }).click();

		// Verify via edit modal
		await page.getByLabel('Edit task').click();
		await expect(dateInput).toHaveValue('2025-12-31');
		await page.getByRole('button', { name: 'Cancel' }).click();
	});

	test('should edit task tags', async ({ page }) => {
		await createTask(page, { title: 'Task With Tags', tags: 'original;tags' });

		// Click edit button
		await page.getByLabel('Edit task').click();
		await expect(page.locator('.modal')).toBeVisible();

		// Update tags
		const tagsInput = page.getByLabel('Tags & Labels');
		await tagsInput.fill('new;updated;tags');
		await page.getByRole('button', { name: 'Commit Task' }).click();

		// Verify via edit modal (tags are stored without spaces after semicolons)
		await page.getByLabel('Edit task').click();
		await expect(tagsInput).toHaveValue('new;updated;tags');
		await page.getByRole('button', { name: 'Cancel' }).click();
	});

	test('should cancel edit without saving', async ({ page }) => {
		await createTask(page, { title: 'Original Title' });

		// Click edit button
		await page.getByLabel('Edit task').click();
		await expect(page.locator('.modal')).toBeVisible();

		// Change title but cancel
		const titleInput = page.getByLabel('Task Title');
		await titleInput.fill('Changed Title');
		await page.getByRole('button', { name: 'Cancel' }).click();

		// Modal should close
		await expect(page.locator('.modal')).not.toBeVisible();

		// Original title should remain
		await expect(page.getByRole('heading', { name: 'Original Title' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Changed Title' })).not.toBeVisible();
	});

	test('should close edit modal with Escape key', async ({ page }) => {
		await createTask(page, { title: 'Task for Escape' });

		// Open edit modal
		await page.getByLabel('Edit task').click();
		await expect(page.locator('.modal')).toBeVisible();

		// Press Escape
		await page.keyboard.press('Escape');

		// Modal should close
		await expect(page.locator('.modal')).not.toBeVisible();
	});

	test('should delete a task', async ({ page }) => {
		await createTask(page, { title: 'Task to Delete' });

		// Verify task exists
		expect(await getTaskCountInColumn(page, 'To Do')).toBe(1);

		// Click delete button
		await page.click('[aria-label="Delete task"]');

		// Confirm deletion
		await page.click('button:has-text("Delete")');

		// Verify removed
		expect(await getTaskCountInColumn(page, 'To Do')).toBe(0);
	});

	test('should cancel task deletion', async ({ page }) => {
		await createTask(page, { title: 'Task to Keep' });

		// Click delete button
		await page.click('[aria-label="Delete task"]');

		// Cancel deletion
		await page.click('button:has-text("Cancel")');

		// Verify task still exists
		expect(await getTaskCountInColumn(page, 'To Do')).toBe(1);
	});

	test('should close delete modal with Escape key', async ({ page }) => {
		await createTask(page, { title: 'Task for Delete Escape' });

		// Open delete modal
		await page.click('[aria-label="Delete task"]');
		await expect(page.locator('.modal:has-text("Confirm Delete")')).toBeVisible();

		// Press Escape
		await page.keyboard.press('Escape');

		// Modal should close
		await expect(page.locator('.modal:has-text("Confirm Delete")')).not.toBeVisible();

		// Task should still exist
		expect(await getTaskCountInColumn(page, 'To Do')).toBe(1);
	});

	test('should create tasks in different columns', async ({ page }) => {
		await createTask(page, { title: 'Todo Task', status: 'To Do' });
		await createTask(page, { title: 'In Progress Task', status: 'In Progress' });
		await createTask(page, { title: 'Done Task', status: 'Done' });

		expect(await getTaskCountInColumn(page, 'To Do')).toBe(1);
		expect(await getTaskCountInColumn(page, 'In Progress')).toBe(1);
		expect(await getTaskCountInColumn(page, 'Done')).toBe(1);
	});

	test('should persist tasks after page reload', async ({ page }) => {
		await createTask(page, { title: 'Persistent Task', priority: 'Medium' });

		// Verify task exists before reload
		let titles = await getTaskTitlesInColumn(page, 'To Do');
		expect(titles).toContain('Persistent Task');

		// Reload
		await page.reload({ waitUntil: 'networkidle' });

		// Verify task still exists
		titles = await getTaskTitlesInColumn(page, 'To Do');
		expect(titles).toContain('Persistent Task');
	});
});
