<script lang="ts">
	import { board } from '$lib/stores/board.svelte';
	import { ui } from '$lib/stores/ui.svelte';

	let formId = 'task-form';

	let title = $state('');
	let description = $state('');
	let priority = $state('');
	let dueDate = $state('');
	let tags = $state('');

	// Watch for modal state changes
	$effect(() => {
		if (ui.modalState.open && ui.modalState.mode === 'edit' && ui.modalState.task) {
			title = ui.modalState.task.title;
			description = ui.modalState.task.description;
			priority = ui.modalState.task.priority;
			dueDate = ui.modalState.task.dueDate;
			tags = ui.modalState.task.tags.join('; ');
		} else if (ui.modalState.open && ui.modalState.mode === 'add') {
			title = '';
			description = '';
			priority = '';
			dueDate = '';
			tags = '';
		}
	});

	function handleClose() {
		ui.closeModal();
	}

	function handleSubmit(event: Event) {
		event.preventDefault();

		const tagsArray = tags
			.split(/[,;|]/)
			.map((t) => t.trim())
			.filter(Boolean);

		if (ui.modalState.mode === 'edit' && ui.modalState.task) {
			board.updateTask(ui.modalState.task.id, {
				title,
				description,
				priority: priority as '' | 'Low' | 'Medium' | 'High',
				dueDate,
				tags: tagsArray
			});
		} else {
			board.addTask({
				title,
				description,
				status: ui.modalState.columnId || 'To Do',
				priority: priority as '' | 'Low' | 'Medium' | 'High',
				dueDate,
				tags: tagsArray
			});
		}

		ui.closeModal();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}
</script>

{#if ui.modalState.open}
	<div class="modal-overlay" onkeydown={handleKeydown} role="presentation">
		<div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
			<div class="modal-header">
				<h3 id="modal-title">{ui.modalState.mode === 'edit' ? 'Edit Task' : 'Add Task'}</h3>
				<button type="button" class="btn ghost close-btn" onclick={handleClose} aria-label="Close modal">
					×
				</button>
			</div>
			<form id={formId} onsubmit={handleSubmit} class="modal-body">
				<div class="form-group">
					<label for="taskTitle">Task Title *</label>
					<input
						type="text"
						id="taskTitle"
						bind:value={title}
						required
						placeholder="Enter task name..."
					/>
				</div>
				<div class="form-group">
					<label for="taskDescription">Description</label>
					<textarea
						id="taskDescription"
						bind:value={description}
						rows="4"
						placeholder="Add details..."
					></textarea>
				</div>
				<div class="form-row">
					<div class="form-group">
						<label for="taskPriority">Priority</label>
						<select id="taskPriority" bind:value={priority}>
							<option value="">No Priority</option>
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
						</select>
					</div>
					<div class="form-group">
						<label for="taskDueDate">Due Date</label>
						<input type="date" id="taskDueDate" bind:value={dueDate} />
					</div>
				</div>
				<div class="form-group">
					<label for="taskTags">Tags & Labels</label>
					<input type="text" id="taskTags" bind:value={tags} placeholder="design; frontend; v1" />
				</div>
			</form>
			<div class="modal-footer">
				<button type="button" class="btn ghost" onclick={handleClose}>Cancel</button>
				<button type="submit" form={formId} class="btn primary">Commit Task</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(2px);
	}

	.modal {
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		max-width: 500px;
		width: 90%;
		max-height: 90vh;
		overflow: auto;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	.modal-header {
		padding: 1.5rem 1.5rem 1rem;
		border-bottom: 1px solid var(--color-border);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-header h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 600;
	}

	.close-btn {
		border: none;
		font-size: 1.5rem;
		padding: 0;
		line-height: 1;
	}

	.modal-body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-accent);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.form-group input,
	.form-group textarea,
	.form-group select {
		padding: 0.625rem 0.75rem;
		font-family: var(--font-body);
		font-size: 0.9375rem;
		background: var(--color-background);
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		transition: all 0.15s ease;
	}

	.form-group input:focus,
	.form-group textarea:focus,
	.form-group select:focus {
		outline: none;
		border-color: var(--color-accent);
		box-shadow: 0 0 0 2px rgba(115, 115, 115, 0.1);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 100px;
	}

	.modal-footer {
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--color-border);
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.5rem 1rem;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		background: var(--color-foreground);
		color: var(--color-background);
		border: 1px solid var(--color-foreground);
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn:hover {
		background: transparent;
		color: var(--color-foreground);
	}

	.btn.ghost {
		background: transparent;
		color: var(--color-foreground);
		border-color: var(--color-border);
	}

	.btn.ghost:hover {
		background: var(--color-card);
		border-color: var(--color-border-heavy);
	}

	.btn.primary {
		background: var(--color-foreground);
		color: var(--color-background);
		font-weight: 500;
	}

	.btn.primary:hover {
		opacity: 0.9;
	}

	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}
</style>
