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
			tags = ui.modalState.task.tags.join(';');
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

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}

	// Focus overlay when modal opens for keyboard events
	let overlayElement = $state<HTMLDivElement>();
	$effect(() => {
		if (ui.modalState.open && overlayElement) {
			overlayElement.focus();
		}
	});
</script>

{#if ui.modalState.open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal-overlay"
		onkeydown={handleKeydown}
		onclick={handleOverlayClick}
		tabindex="-1"
		role="presentation"
		bind:this={overlayElement}
	>
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
		background: rgba(44, 44, 36, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.modal {
		background: var(--color-card);
		border: 1px solid rgba(222, 216, 207, 0.5);
		border-radius: 2rem;
		max-width: 500px;
		width: 90%;
		max-height: 90vh;
		overflow: auto;
		box-shadow: var(--shadow-float);
	}

	.modal-header {
		padding: 1.5rem 1.75rem 1rem;
		border-bottom: 1px solid rgba(222, 216, 207, 0.4);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-header h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-foreground);
		letter-spacing: -0.01em;
	}

	.close-btn {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 50%;
		font-size: 1.5rem;
		padding: 0;
		line-height: 1;
		cursor: pointer;
		color: var(--color-muted-foreground);
		transition: all 0.3s ease;
	}

	.close-btn:hover {
		background: var(--color-muted);
		color: var(--color-foreground);
	}

	.modal-body {
		padding: 1.5rem 1.75rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.form-group input,
	.form-group textarea,
	.form-group select {
		padding: 0.75rem 1rem;
		font-family: var(--font-body);
		font-size: 0.9375rem;
		background: rgba(255, 255, 255, 0.5);
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: 9999px;
		transition: all 0.3s ease;
	}

	.form-group input::placeholder,
	.form-group textarea::placeholder {
		color: var(--color-muted-foreground);
		opacity: 0.7;
	}

	.form-group input:focus,
	.form-group textarea:focus,
	.form-group select:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(93, 112, 82, 0.15);
		background: rgba(255, 255, 255, 0.8);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 100px;
		border-radius: 1.25rem;
	}

	.form-group select {
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378786C' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		padding-right: 2.5rem;
	}

	.modal-footer {
		padding: 1rem 1.75rem 1.5rem;
		border-top: 1px solid rgba(222, 216, 207, 0.4);
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.btn.ghost {
		background: transparent;
		color: var(--color-muted-foreground);
		border-color: var(--color-border);
	}

	.btn.ghost:hover {
		background: var(--color-muted);
		color: var(--color-foreground);
		border-color: var(--color-border);
		transform: scale(1.02);
	}

	.btn.ghost:active {
		transform: scale(0.98);
	}

	.btn.primary {
		background: var(--color-primary);
		color: var(--color-primary-foreground);
		border-color: var(--color-primary);
		box-shadow: 0 4px 20px -2px rgba(93, 112, 82, 0.25);
	}

	.btn.primary:hover {
		background: #4d5f44;
		border-color: #4d5f44;
		transform: scale(1.05);
		box-shadow: 0 6px 24px -4px rgba(93, 112, 82, 0.35);
	}

	.btn.primary:active {
		transform: scale(0.95);
	}

	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.modal {
			border-radius: 1.5rem;
		}
	}
</style>
