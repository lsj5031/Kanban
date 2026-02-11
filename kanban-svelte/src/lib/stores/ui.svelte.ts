export class UIStore {
	highlightedTags = $state<Set<string>>(new Set());
	modalState = $state<{
		open: boolean;
		mode: 'add' | 'edit';
		task?: {
			id: string;
			title: string;
			description: string;
			priority: string;
			dueDate: string;
			tags: string[];
			status: string;
			order: number;
		};
		columnId?: string;
	}>({ open: false, mode: 'add' });
	deleteState = $state<{ open: boolean; task?: { id: string; title: string } }>({
		open: false
	});
	importProgress = $state<{ active: boolean; current: number; total: number; message: string }>({
		active: false,
		current: 0,
		total: 0,
		message: ''
	});

	toggleTag(tag: string): void {
		if (this.highlightedTags.has(tag)) {
			this.highlightedTags.delete(tag);
		} else {
			this.highlightedTags.add(tag);
		}
		// Trigger reactivity
		this.highlightedTags = new Set(this.highlightedTags);
	}

	isTagHighlighted(tag: string): boolean {
		return this.highlightedTags.has(tag);
	}

	clearHighlightedTags(): void {
		this.highlightedTags = new Set();
	}

	openAddModal(columnId?: string): void {
		this.modalState = {
			open: true,
			mode: 'add',
			columnId
		};
	}

	openEditModal(task: {
		id: string;
		title: string;
		description: string;
		priority: string;
		dueDate: string;
		tags: string[];
		status: string;
		order: number;
	}): void {
		this.modalState = {
			open: true,
			mode: 'edit',
			task
		};
	}

	closeModal(): void {
		this.modalState = { open: false, mode: 'add' };
	}

	openDeleteDialog(task: { id: string; title: string }): void {
		this.deleteState = { open: true, task };
	}

	closeDeleteDialog(): void {
		this.deleteState = { open: false };
	}

	startImport(total: number, message: string = 'Importing...'): void {
		this.importProgress = { active: true, current: 0, total, message };
	}

	updateImportProgress(current: number): void {
		this.importProgress = { ...this.importProgress, current };
	}

	finishImport(): void {
		this.importProgress = { active: false, current: 0, total: 0, message: '' };
	}
}

export const ui = new UIStore();
