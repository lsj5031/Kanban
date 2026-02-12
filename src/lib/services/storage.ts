import type { Board, Task } from '$lib/types';
import { DEFAULT_COLUMNS } from '$lib/types';

const STORAGE_KEY = 'kanban-board';
const STORAGE_VERSION = '1.0';

interface StoredData {
	version: string;
	tasks: Task[];
}

export function save(tasks: Task[]): void {
	const data: StoredData = {
		version: STORAGE_VERSION,
		tasks
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function load(): Task[] {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return getDefaultTasks();

	try {
		const data: StoredData = JSON.parse(raw);
		// Migration support: add version checks here in the future
		return data.tasks || [];
	} catch {
		return getDefaultTasks();
	}
}

function getDefaultTasks(): Task[] {
	return [];
}

export function clear(): void {
	localStorage.removeItem(STORAGE_KEY);
}

export function groupTasksByColumn(tasks: Task[]): Board {
	const statusSet = new Set(DEFAULT_COLUMNS);
	for (const task of tasks) {
		if (task.status) {
			statusSet.add(task.status);
		}
	}

	const columns: Board = Array.from(statusSet).map((name) => ({
		id: name.toLowerCase().replace(/\s+/g, '-'),
		name,
		tasks: []
	}));

	const columnMap = new Map(columns.map((col) => [col.name, col]));

	for (const task of tasks) {
		const column = columnMap.get(task.status) || columnMap.get('To Do');
		if (column) {
			// Create a new object reference for reactivity
			column.tasks.push({ ...task });
		}
	}

	for (const column of columns) {
		column.tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	}

	return columns;
}
