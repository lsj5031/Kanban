import { save, load, clear } from '$lib/services/storage';
import { parseJSON, serializeJSON } from '$lib/services/json';
import type { Task } from '$lib/types';
import { generateId } from '$lib/utils/id';

let initialState = load();

export class BoardStore {
	tasks = $state<Task[]>(initialState);

	constructor() {
		$effect.root(() => {
			$effect(() => {
				save(this.tasks);
			});
		});
	}

	addTask(task: Omit<Task, 'id' | 'order'>): void {
		this.tasks.push({ ...task, id: generateId(), order: this.getNextOrder(task.status) });
	}

	updateTask(id: string, updates: Partial<Task>): void {
		const index = this.tasks.findIndex((t) => t.id === id);
		if (index !== -1) {
			this.tasks[index] = { ...this.tasks[index], ...updates };
			// Trigger reactivity
			this.tasks = [...this.tasks];
		}
	}

	deleteTask(id: string): void {
		this.tasks = this.tasks.filter((t) => t.id !== id);
	}

	archiveDoneTasks(): Task[] {
		const doneTasks = this.tasks.filter((t) => t.status === 'Done');
		this.tasks = this.tasks.filter((t) => t.status !== 'Done');
		return doneTasks;
	}

	moveTask(taskId: string, newStatus: string, newIndex: number): void {
		const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
		if (taskIndex === -1) return;

		const task = this.tasks[taskIndex];
		const oldStatus = task.status;

		if (oldStatus === newStatus) {
			// Find actual index in column (order values may not be sequential)
			const columnTasks = this.getColumnTasks(oldStatus);
			const oldIndex = columnTasks.findIndex(t => t.id === taskId);
			if (oldIndex === newIndex) return;
			this.reorderTask(newStatus, oldIndex, newIndex);
			return;
		}

		const destinationTasks = this.getColumnTasks(newStatus);
		destinationTasks.splice(newIndex, 0, task);
		this.normalizeOrders(destinationTasks, newStatus);
		this.normalizeOrders(this.getColumnTasks(oldStatus), oldStatus);
		task.status = newStatus;
		this.tasks = [...this.tasks];
	}

	reorderTask(columnId: string, fromIndex: number, toIndex: number): void {
		const columnTasks = this.getColumnTasks(columnId);
		if (fromIndex < 0 || fromIndex >= columnTasks.length) return;
		const [moved] = columnTasks.splice(fromIndex, 1);
		if (!moved) return;
		columnTasks.splice(toIndex, 0, moved);
		this.normalizeOrders(columnTasks, columnId);
		// Trigger reactivity by creating new array
		this.tasks = [...this.tasks];
	}

	loadFromJSON(raw: string, onProgress?: (current: number, total: number) => void): void {
		const tasks = parseJSON(raw);
		if (tasks.length > 0) {
			this.tasks = this.normalizeImportedOrders(tasks, onProgress);
		}
	}

	exportJSON(): string {
		return serializeJSON(this.tasks);
	}

	reset(): void {
		this.tasks = [];
		clear();
	}

	private getColumnTasks(status: string): Task[] {
		return this.tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);
	}

	private normalizeOrders(columnTasks: Task[], status: string): void {
		columnTasks.forEach((task, index) => {
			task.order = index;
			task.status = status;
		});
	}

	private getNextOrder(status: string): number {
		return this.getColumnTasks(status).length;
	}

	private normalizeImportedOrders(tasks: Task[], onProgress?: (current: number, total: number) => void): Task[] {
		const statusMap = new Map<string, Task[]>();
		for (const task of tasks) {
			const status = task.status || 'To Do';
			task.status = status;
			if (!statusMap.has(status)) {
				statusMap.set(status, []);
			}
			statusMap.get(status)?.push(task);
		}

		let processed = 0;
		const total = tasks.length;
		for (const [status, columnTasks] of statusMap) {
			columnTasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
			this.normalizeOrders(columnTasks, status);
			processed += columnTasks.length;
			if (onProgress) {
				onProgress(processed, total);
			}
		}

		return tasks;
	}
}

export const board = new BoardStore();
