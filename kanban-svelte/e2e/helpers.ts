import type { Page } from '@playwright/test';

export interface CreateTaskOptions {
	title: string;
	description?: string;
	priority?: 'Low' | 'Medium' | 'High';
	tags?: string;
	status?: 'To Do' | 'In Progress' | 'Done';
}

export async function createTask(page: Page, options: CreateTaskOptions) {
	const status = options.status || 'To Do';
	const buttonLabel = `Add task to ${status}`;

	await page.click(`button[aria-label="${buttonLabel}"]`);
	await page.fill('#taskTitle', options.title);

	if (options.description) {
		await page.fill('#taskDescription', options.description);
	}

	if (options.priority) {
		await page.selectOption('#taskPriority', options.priority);
	}

	if (options.tags) {
		await page.fill('#taskTags', options.tags);
	}

	await page.click('button:has-text("Commit Task")');

	// Wait for modal to close
	await page.waitForSelector('.modal', { state: 'hidden' });
}

export async function clearAllTasks(page: Page) {
	await page.evaluate(() => {
		localStorage.removeItem('kanban-board');
	});
	await page.reload();
}

export async function getTaskCountInColumn(page: Page, columnName: string): Promise<number> {
	const column = page.locator(`[aria-label="${columnName} tasks"]`);
	const tasks = column.locator('.task-card');
	return await tasks.count();
}

export async function getTaskTitlesInColumn(page: Page, columnName: string): Promise<string[]> {
	const column = page.locator(`[aria-label="${columnName} tasks"]`);
	const titles = column.locator('.task-title');
	const count = await titles.count();
	const result: string[] = [];
	for (let i = 0; i < count; i++) {
		result.push(await titles.nth(i).textContent() || '');
	}
	return result;
}

export async function moveTaskToStatus(page: Page, taskTitle: string, newStatus: string) {
	await page.evaluate(({ title, status }) => {
		const data = JSON.parse(localStorage.getItem('kanban-board') || '{}');
		if (data.tasks) {
			const task = data.tasks.find((t: { title: string }) => t.title === title);
			if (task) {
				task.status = status;
			}
		}
		localStorage.setItem('kanban-board', JSON.stringify(data));
	}, { title: taskTitle, status: newStatus });
	await page.reload();
}
