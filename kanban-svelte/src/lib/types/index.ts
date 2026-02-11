export interface Task {
	id: string;
	title: string;
	description: string;
	status: string;
	priority: '' | 'Low' | 'Medium' | 'High';
	dueDate: string; // ISO date string or empty
	tags: string[];
	order: number;
}

export interface Column {
	id: string;
	name: string; // "To Do", "In Progress", "Done"
	tasks: Task[];
}

export type Board = Column[];

export const DEFAULT_COLUMNS: string[] = ['To Do', 'In Progress', 'Done'];
