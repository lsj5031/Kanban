import type { Task } from '$lib/types';

interface JsonCard {
	id: string;
	title: string;
	description: string;
	status: string;
	order: number;
	priority: string;
	dueDate: string;
	tags: string[];
}

interface JsonBoard {
	columns?: { id: string; name: string; order: number }[];
	cards?: JsonCard[];
}

export function parseJSON(raw: string): Task[] {
	try {
		const data = JSON.parse(raw);

		// Handle { columns: [...], cards: [...] } format
		if (data && !Array.isArray(data) && Array.isArray(data.cards)) {
			return data.cards.map((card: JsonCard) => ({
				id: card.id || crypto.randomUUID(),
				title: card.title || '',
				description: card.description || '',
				status: card.status || 'To Do',
				order: typeof card.order === 'number' ? card.order : 0,
				priority: card.priority === 'Low' || card.priority === 'Medium' || card.priority === 'High' ? card.priority : '',
				dueDate: card.dueDate || '',
				tags: Array.isArray(card.tags) ? card.tags : []
			}));
		}

		// Handle flat array format
		if (Array.isArray(data)) {
			return data.map((task, index) => ({
				...task,
				id: task.id || crypto.randomUUID(),
				order: typeof task.order === 'number' ? task.order : index
			}));
		}

		return [];
	} catch {
		return [];
	}
}

export function serializeJSON(tasks: Task[]): string {
	return JSON.stringify({ cards: tasks }, null, 2);
}
