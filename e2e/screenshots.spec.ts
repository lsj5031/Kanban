import { test, expect } from '@playwright/test';

test.describe('Screenshots', () => {
	test('take application screenshots', async ({ page }) => {
		await page.goto('/');

		// Wait for fonts to load
		await page.waitForTimeout(1000);

		// Screenshot 1: Empty board state
		await page.screenshot({
			path: 'test-screenshots/01-empty-board.png',
			fullPage: true
		});

		// Add a task to see the populated state
		await page.click('button:has-text("Add Task")');

		// Fill in the form
		await page.fill('#taskTitle', 'Design System Integration');
		await page.fill('#taskDescription', 'Apply organic/natural design tokens to all components with soft shadows, grain texture, and earth-tone colors.');
		await page.selectOption('#taskPriority', 'High');
		await page.fill('#taskTags', 'design; frontend; ui');

		// Screenshot 2: Modal open
		await page.screenshot({
			path: 'test-screenshots/02-modal-add-task.png',
			fullPage: true
		});

		// Submit the task
		await page.click('button:has-text("Commit Task")');
		await page.waitForTimeout(500);

		// Add another task
		await page.click('button:has-text("Add Task")');
		await page.fill('#taskTitle', 'Implement Drag and Drop');
		await page.fill('#taskDescription', 'Enable task reordering between columns using svelte-dnd-action library.');
		await page.selectOption('#taskPriority', 'Medium');
		await page.fill('#taskTags', 'frontend; interaction');
		await page.click('button:has-text("Commit Task")');
		await page.waitForTimeout(500);

		// Add a third task
		await page.click('button:has-text("Add Task")');
		await page.fill('#taskTitle', 'Write Unit Tests');
		await page.fill('#taskDescription', 'Add comprehensive test coverage for all components and stores.');
		await page.selectOption('#taskPriority', 'Low');
		await page.fill('#taskDueDate', '2026-02-20');
		await page.click('button:has-text("Commit Task")');
		await page.waitForTimeout(500);

		// Screenshot 3: Board with tasks
		await page.screenshot({
			path: 'test-screenshots/03-board-with-tasks.png',
			fullPage: true
		});

		// Move one task to In Progress
		await page.click('.task-card:has-text("Design System") button:has(svg)');
		await page.waitForTimeout(300);
		await page.screenshot({
			path: 'test-screenshots/04-edit-task.png',
			fullPage: true
		});

		// Close modal
		await page.click('button:has-text("Cancel")');
		await page.waitForTimeout(300);

		// Screenshot header area
		await page.screenshot({
			path: 'test-screenshots/05-header.png',
			clip: { x: 0, y: 0, width: 1280, height: 150 }
		});

		// Screenshot single task card
		const taskCard = page.locator('.task-card:has-text("Design System")');
		await taskCard.screenshot({
			path: 'test-screenshots/06-task-card.png'
		});

		// Click on a tag to filter
		await page.click('.tag-chip:has-text("design")');
		await page.waitForTimeout(300);

		// Screenshot filtered state
		await page.screenshot({
			path: 'test-screenshots/07-tag-filtered.png',
			fullPage: true
		});

		// Clear filter
		await page.click('.tag-chip:has-text("design")');
		await page.waitForTimeout(300);

		// Move task to In Progress column via edit
		const firstEditBtn = page.locator('.task-card:has-text("Design System") .action-btn').first();
		await firstEditBtn.click();
		await page.waitForTimeout(300);
		await page.click('button:has-text("Cancel")');
		await page.waitForTimeout(300);

		// Add a completed task to Done column
		await page.locator('.column:has(h2:has-text("Done")) button:has-text("Add Task")').click();
		await page.fill('#taskTitle', 'Initial Setup');
		await page.fill('#taskDescription', 'Project scaffolding and configuration complete.');
		await page.selectOption('#taskPriority', 'Low');
		await page.click('button:has-text("Commit Task")');
		await page.waitForTimeout(500);

		// Screenshot final state with all columns populated
		await page.screenshot({
			path: 'test-screenshots/08-full-board.png',
			fullPage: true
		});

		// Test delete dialog
		const deleteBtn = page.locator('.task-card:has-text("Initial Setup") .action-btn').last();
		await deleteBtn.click();
		await page.waitForTimeout(300);

		// Screenshot delete dialog
		await page.screenshot({
			path: 'test-screenshots/09-delete-dialog.png',
			fullPage: true
		});

		// Cancel delete
		await page.click('button:has-text("Cancel")');
		await page.waitForTimeout(300);

		// Screenshot footer area
		const footer = page.locator('footer');
		await footer.screenshot({
			path: 'test-screenshots/10-footer.png'
		});

		// Mobile view screenshot
		await page.setViewportSize({ width: 375, height: 812 });
		await page.waitForTimeout(500);
		await page.screenshot({
			path: 'test-screenshots/11-mobile-view.png',
			fullPage: true
		});
	});
});
