<script lang="ts">
	import { ui } from '$lib/stores/ui.svelte';
	import { board } from '$lib/stores/board.svelte';

	function handleCancel() {
		ui.closeResetDialog();
	}

	function handleConfirm() {
		board.reset();
		ui.clearHighlightedTags();
		ui.closeResetDialog();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleCancel();
		}
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleCancel();
		}
	}

	// Focus overlay when modal opens for keyboard events
	let overlayElement: HTMLDivElement;
	$effect(() => {
		if (ui.resetState.open && overlayElement) {
			overlayElement.focus();
		}
	});
</script>

{#if ui.resetState.open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal-overlay"
		onkeydown={handleKeydown}
		onclick={handleOverlayClick}
		tabindex="-1"
		role="presentation"
		bind:this={overlayElement}
	>
		<div class="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title">
			<div class="modal-header">
				<h3 id="reset-title">Reset Board</h3>
			</div>
			<div class="modal-body">
				<p>Are you sure you want to reset the board?</p>
				<p class="hint">This will permanently delete all tasks. This action cannot be undone.</p>
			</div>
			<div class="modal-footer">
				<button class="btn ghost" onclick={handleCancel}>Cancel</button>
				<button class="btn destructive" onclick={handleConfirm}>Reset Board</button>
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
		max-width: 420px;
		width: 90%;
		max-height: 90vh;
		overflow: auto;
		box-shadow: var(--shadow-float);
	}

	.modal-header {
		padding: 1.5rem 1.75rem 1rem;
		border-bottom: 1px solid rgba(222, 216, 207, 0.4);
	}

	.modal-header h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--color-foreground);
		letter-spacing: -0.01em;
	}

	.modal-body {
		padding: 1.5rem 1.75rem;
	}

	.modal-body p {
		margin: 0 0 1rem 0;
		line-height: 1.6;
		color: var(--color-foreground);
		font-family: var(--font-body);
		font-size: 0.9375rem;
	}

	.hint {
		font-size: 0.875rem;
		color: var(--color-muted-foreground);
		font-style: italic;
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

	.btn.destructive {
		background: var(--color-destructive);
		color: white;
		border-color: var(--color-destructive);
		box-shadow: 0 4px 20px -2px rgba(168, 84, 72, 0.3);
	}

	.btn.destructive:hover {
		background: #8f473d;
		border-color: #8f473d;
		transform: scale(1.05);
		box-shadow: 0 6px 24px -4px rgba(168, 84, 72, 0.4);
	}

	.btn.destructive:active {
		transform: scale(0.95);
	}
</style>
