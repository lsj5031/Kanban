import { describe, it, expect, beforeEach } from 'vitest';
import { BoardStore } from './board.svelte';
import type { Task } from '$lib/types';

describe('BoardStore', () => {
	let store: BoardStore;

	beforeEach(() => {
		store = new BoardStore();
		store.tasks = [];
	});

	describe('moveTask', () => {
		it('moves task to a different column', () => {
			const task: Task = {
				id: 't1',
				title: 'Test Task',
				description: '',
				status: 'To Do',
				order: 0,
				priority: '',
				dueDate: '',
				tags: []
			};
			store.tasks = [task];

			store.moveTask('t1', 'In Progress', 0);

			expect(store.tasks[0].status).toBe('In Progress');
		});

		it('updates order when moving within same column', () => {
			store.tasks = [
				{ id: 't1', title: 'Task 1', description: '', status: 'To Do', order: 0, priority: '', dueDate: '', tags: [] },
				{ id: 't2', title: 'Task 2', description: '', status: 'To Do', order: 1, priority: '', dueDate: '', tags: [] },
				{ id: 't3', title: 'Task 3', description: '', status: 'To Do', order: 2, priority: '', dueDate: '', tags: [] }
			];

			store.moveTask('t3', 'To Do', 0);

			const todoTasks = store.tasks.filter(t => t.status === 'To Do').sort((a, b) => a.order - b.order);
			expect(todoTasks[0].id).toBe('t3');
			expect(todoTasks[0].order).toBe(0);
			expect(todoTasks[1].id).toBe('t1');
			expect(todoTasks[2].id).toBe('t2');
		});
	});

	describe('reorderTask', () => {
		it('reorders tasks within a column', () => {
			store.tasks = [
				{ id: 't1', title: 'Task 1', description: '', status: 'To Do', order: 0, priority: '', dueDate: '', tags: [] },
				{ id: 't2', title: 'Task 2', description: '', status: 'To Do', order: 1, priority: '', dueDate: '', tags: [] }
			];

			store.reorderTask('To Do', 0, 1);

			const todoTasks = store.tasks.filter(t => t.status === 'To Do').sort((a, b) => a.order - b.order);
			expect(todoTasks[0].id).toBe('t2');
			expect(todoTasks[1].id).toBe('t1');
		});
	});

	describe('loadFromJSON', () => {
		it('loads tasks from JSON with cards format', () => {
			const raw = JSON.stringify({
				cards: [
					{ id: 'c1', title: 'Task 1', description: '', status: 'To Do', order: 0, priority: '', dueDate: '', tags: [] }
				]
			});

			store.loadFromJSON(raw);

			expect(store.tasks).toHaveLength(1);
			expect(store.tasks[0].id).toBe('c1');
		});
	});

	describe('addTask', () => {
		it('adds task with generated id and order', () => {
			store.addTask({
				title: 'New Task',
				description: 'desc',
				status: 'To Do',
				priority: 'High',
				dueDate: '',
				tags: ['tag1']
			});

			expect(store.tasks).toHaveLength(1);
			expect(store.tasks[0].id).toBeDefined();
			expect(store.tasks[0].order).toBe(0);
		});
	});

	describe('updateTask', () => {
		it('updates task properties', () => {
			store.tasks = [
				{ id: 't1', title: 'Old Title', description: '', status: 'To Do', order: 0, priority: '', dueDate: '', tags: [] }
			];

			store.updateTask('t1', { title: 'New Title', status: 'Done' });

			expect(store.tasks[0].title).toBe('New Title');
			expect(store.tasks[0].status).toBe('Done');
		});
	});

	describe('deleteTask', () => {
		it('removes task from store', () => {
			store.tasks = [
				{ id: 't1', title: 'Task 1', description: '', status: 'To Do', order: 0, priority: '', dueDate: '', tags: [] },
				{ id: 't2', title: 'Task 2', description: '', status: 'To Do', order: 1, priority: '', dueDate: '', tags: [] }
			];

			store.deleteTask('t1');

			expect(store.tasks).toHaveLength(1);
			expect(store.tasks[0].id).toBe('t2');
		});
	});
});
