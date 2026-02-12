import { test, expect } from '@playwright/test';
import { clearAllTasks } from './helpers';

test.describe('Modal Keyboard Behavior', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await clearAllTasks(page);
	});

	test('should close add task modal with Escape', async ({ page }) => {
		// Open modal via button click
		await page.click('button[aria-label*="Add task"]');
		await expect(page.locator('.modal')).toBeVisible();

		// Press Escape
		await page.keyboard.press('Escape');

		// Modal should close
		await expect(page.locator('.modal')).not.toBeVisible();
	});
});

test.describe('Accessibility', () => {
	test('should have proper heading structure', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');

		// Wait for first column to be visible
		await expect(page.locator('h2:has-text("To Do")')).toBeVisible({ timeout: 15000 });

		// Logo should be visible
		await expect(page.locator('img[alt="Kanban Mono"]')).toBeVisible();

		// Count column headings
		const h2Count = await page.locator('h2').count();
		expect(h2Count).toBe(5);
	});

	test('should have accessible buttons', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');

		// Wait for columns to be visible
		await expect(page.locator('h2:has-text("To Do")')).toBeVisible({ timeout: 10000 });

		// Add task buttons should exist (5 columns)
		const addButtons = page.locator('button:has-text("Add Task")');
		expect(await addButtons.count()).toBe(5);
	});

	test('should focus trap in modal', async ({ page }) => {
		await page.goto('/');
		await clearAllTasks(page);

		// Open add task modal
		await page.click('button[aria-label*="Add task"]');
		await expect(page.locator('.modal')).toBeVisible();

		// Tab through focusable elements
		await page.keyboard.press('Tab');
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
	});
});
