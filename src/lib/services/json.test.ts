import { describe, it, expect } from 'vitest';
import { parseJSON, serializeJSON } from './json';
import type { Task } from '$lib/types';

describe('json service', () => {
	describe('parseJSON', () => {
		it('parses { columns, cards } format', () => {
			const raw = JSON.stringify({
				columns: [
					{ id: 'col1', name: 'To Do', order: 0 }
				],
				cards: [
					{ id: 'c1', title: 'Task 1', description: '', status: 'To Do', order: 0, priority: 'High', dueDate: '', tags: ['test'] }
				]
			});

			const tasks = parseJSON(raw);

			expect(tasks).toHaveLength(1);
			expect(tasks[0].id).toBe('c1');
			expect(tasks[0].title).toBe('Task 1');
			expect(tasks[0].status).toBe('To Do');
			expect(tasks[0].tags).toEqual(['test']);
		});

		it('parses flat array format', () => {
			const raw = JSON.stringify([
				{ id: 'c1', title: 'Task 1', description: '', status: 'To Do', order: 0, priority: '', dueDate: '', tags: [] }
			]);

			const tasks = parseJSON(raw);

			expect(tasks).toHaveLength(1);
			expect(tasks[0].id).toBe('c1');
		});

		it('handles missing fields with defaults', () => {
			const raw = JSON.stringify({
				cards: [
					{ id: 'c1', title: 'Task 1' }
				]
			});

			const tasks = parseJSON(raw);

			expect(tasks[0].description).toBe('');
			expect(tasks[0].status).toBe('To Do');
			expect(tasks[0].priority).toBe('');
			expect(tasks[0].dueDate).toBe('');
			expect(tasks[0].tags).toEqual([]);
		});

		it('handles invalid JSON', () => {
			const tasks = parseJSON('not valid json');
			expect(tasks).toEqual([]);
		});

		it('handles empty object', () => {
			const tasks = parseJSON('{}');
			expect(tasks).toEqual([]);
		});
	});

	describe('serializeJSON', () => {
		it('serializes tasks to { cards } format', () => {
			const tasks: Task[] = [
				{ id: 'c1', title: 'Task 1', description: 'desc', status: 'To Do', order: 0, priority: 'High', dueDate: '', tags: ['a', 'b'] }
			];

			const raw = serializeJSON(tasks);
			const parsed = JSON.parse(raw);

			expect(parsed.cards).toHaveLength(1);
			expect(parsed.cards[0].id).toBe('c1');
		});
	});
});
