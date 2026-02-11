<script lang="ts">
	import { ui } from '$lib/stores/ui.svelte';
	import { board } from '$lib/stores/board.svelte';

	function handleCancel() {
		ui.closeDeleteDialog();
	}

	function handleConfirm() {
		if (ui.deleteState.task) {
			board.deleteTask(ui.deleteState.task.id);
		}
		ui.closeDeleteDialog();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleCancel();
		}
	}
</script>

{#if ui.deleteState.open}
	<div class="modal-overlay" onkeydown={handleKeydown} role="presentation">
		<div class="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
			<div class="modal-header">
				<h3 id="delete-title">Confirm Delete</h3>
			</div>
			<div class="modal-body">
				<p>Are you sure you want to permanently delete this task? This cannot be undone.</p>
				<h4 class="task-title">{ui.deleteState.task?.title}</h4>
			</div>
			<div class="modal-footer">
				<button class="btn ghost" onclick={handleCancel}>Cancel</button>
				<button class="btn" onclick={handleConfirm}>Delete Task</button>
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
		border: 2px solid var(--color-border);
		border-radius: 0.5rem;
		max-width: 400px;
		width: 90%;
		max-height: 90vh;
		overflow: auto;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	.modal-header {
		padding: 1.5rem 1.5rem 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.modal-header h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 600;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.modal-body p {
		margin: 0 0 2rem 0;
		line-height: 1.6;
	}

	.task-title {
		margin: 0;
		font-style: italic;
		font-family: var(--font-display);
		font-size: 1.125rem;
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
</style>
