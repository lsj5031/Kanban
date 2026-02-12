<script lang="ts">
	import { board } from '$lib/stores/board.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import type { Task } from '$lib/types';
	import TaskCard from './TaskCard.svelte';

	let { column }: { column: { id: string; name: string; tasks: Task[] } } = $props();
	const flipDurationMs = 200;

	// Local state for dnd
	let items = $state<Task[]>([]);
	let isDndActive = $state(false);

	// Sync from props - needed for edits and external changes
	// Skip sync during active drag to prevent interference
	$effect(() => {
		if (!isDndActive) {
			items = [...column.tasks];
		}
	});

	function handleAddTask() {
		ui.openAddModal(column.name);
	}

	function handleDndConsider(event: CustomEvent<DndEvent<Task>>) {
		isDndActive = true;
		items = event.detail.items as Task[];
	}

	function handleDndFinalize(event: CustomEvent<DndEvent<Task>>) {
		items = event.detail.items as Task[];
		isDndActive = false;

		// Update the store based on the new order
		items.forEach((item, index) => {
			if (item.status !== column.name) {
				// Task moved to this column
				board.moveTask(item.id, column.name, index);
			} else {
				// Update order within column
				board.updateTask(item.id, { order: index, status: column.name });
			}
		});
	}

	function handleArchiveAll() {
		if (column.tasks.length === 0) return;
		ui.openArchiveDialog(column.tasks.length);
	}
</script>

<div class="column">
	<div class="column-header">
		<div class="column-title">
			<h2>{column.name}</h2>
			<span class="task-count">{column.tasks.length}</span>
		</div>
		<div class="column-actions">
			{#if column.name === 'Done' && column.tasks.length > 0}
				<button class="archive-btn" onclick={handleArchiveAll} type="button" title="Archive all completed tasks">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="21 8 21 21 3 21 3 8"></polyline>
						<rect x="1" y="3" width="22" height="5"></rect>
						<line x1="10" y1="12" x2="14" y2="12"></line>
					</svg>
					Archive All
				</button>
			{/if}
			<button class="add-task-btn" onclick={handleAddTask} aria-label="Add task to {column.name}" type="button">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Add Task
			</button>
		</div>
	</div>

	<div
		class="column-tasks"
		class:empty={column.tasks.length === 0}
		use:dndzone={{
			items,
			flipDurationMs,
			type: 'kanban',
			dropTargetClasses: ['drop-target'],
			delayTouchStart: 80
		}}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
		aria-label="{column.name} tasks"
	>
		{#each items as task (task.id)}
			<div class="task-dnd" animate:flip={{ duration: flipDurationMs }}>
				<TaskCard {task} />
			</div>
		{:else}
			<div class="empty-state">
				<p>No tasks</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.column {
		display: flex;
		flex-direction: column;
		background: var(--color-card);
		border: 1px solid rgba(222, 216, 207, 0.5);
		border-radius: 2rem;
		min-width: 300px;
		max-width: 360px;
		height: 100%;
		box-shadow: var(--shadow-card);
		transition: box-shadow 0.3s ease;
	}

	.column:hover {
		box-shadow: var(--shadow-card-hover);
	}

	.column-header {
		padding: 1.25rem 1.25rem 1rem;
		border-bottom: 1px solid rgba(222, 216, 207, 0.4);
	}

	.column-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.875rem;
	}

	.column-title h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-foreground);
		letter-spacing: -0.01em;
	}

	.task-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.75rem;
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 600;
		background: var(--color-muted);
		color: var(--color-muted-foreground);
		border-radius: 9999px;
		min-width: 2rem;
	}

	.column-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.archive-btn {
		flex: 1;
		padding: 0.5rem 0.75rem;
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 600;
		background: transparent;
		color: var(--color-secondary);
		border: 1px solid var(--color-secondary);
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
	}

	.archive-btn:hover {
		background: var(--color-secondary);
		color: var(--color-secondary-foreground);
		transform: scale(1.02);
	}

	.archive-btn:active {
		transform: scale(0.98);
	}

	.add-task-btn {
		width: 100%;
		padding: 0.625rem 0.75rem;
		font-family: var(--font-body);
		font-size: 0.8125rem;
		font-weight: 600;
		background: transparent;
		color: var(--color-primary);
		border: 2px dashed var(--color-border);
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.add-task-btn:hover {
		background: rgba(93, 112, 82, 0.05);
		border-color: var(--color-primary);
		border-style: solid;
		color: var(--color-primary);
		transform: scale(1.02);
	}

	.add-task-btn:active {
		transform: scale(0.98);
	}

	.column-tasks {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		flex: 1;
		overflow-y: auto;
		min-height: 200px;
	}

	:global(.drop-target) {
		outline: 2px dashed var(--color-primary);
		outline-offset: -8px;
		border-radius: 1rem;
	}

	.task-dnd {
		display: flex;
	}

	.column-tasks.empty {
		align-items: center;
		justify-content: center;
	}

	.empty-state {
		text-align: center;
		padding: 2.5rem 1rem;
		color: var(--color-muted-foreground);
		font-family: var(--font-body);
		font-style: italic;
		font-size: 0.9375rem;
	}

	.empty-state p {
		margin: 0;
	}

	@media (max-width: 768px) {
		.column {
			min-width: 280px;
			max-width: 100%;
		}
	}
</style>
