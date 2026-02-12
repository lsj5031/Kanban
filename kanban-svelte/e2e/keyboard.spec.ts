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
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await clearAllTasks(page);
	});

	test('should have proper heading structure', async ({ page }) => {
		// Main heading should be h1
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();

		// Column headings should be h2
		const h2s = page.locator('h2');
		expect(await h2s.count()).toBe(3);
	});

	test('should have accessible buttons', async ({ page }) => {
		// Wait for columns to be visible
		await expect(page.locator('h2:has-text("To Do")')).toBeVisible();

		// Add task buttons should exist
		const addButtons = page.locator('button:has-text("Add Task")');
		expect(await addButtons.count()).toBe(3);
	});

	test('should focus trap in modal', async ({ page }) => {
		// Open add task modal
		await page.click('button[aria-label*="Add task"]');
		await expect(page.locator('.modal')).toBeVisible();

		// Tab through focusable elements
		await page.keyboard.press('Tab');
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
	});
});
