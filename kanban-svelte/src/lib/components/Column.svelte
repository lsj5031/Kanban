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

	// Sync from props - needed for edits and external changes
	$effect(() => {
		items = [...column.tasks];
	});

	function handleAddTask() {
		ui.openAddModal(column.name);
	}

	function handleDndConsider(event: CustomEvent<DndEvent<Task>>) {
		items = event.detail.items as Task[];
	}

	function handleDndFinalize(event: CustomEvent<DndEvent<Task>>) {
		items = event.detail.items as Task[];

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
		if (confirm(`Archive all ${column.tasks.length} completed tasks?`)) {
			const archived = board.archiveDoneTasks();
			items = [];
			// Download archived tasks as JSON
			const json = JSON.stringify({ archived: archived, archivedAt: new Date().toISOString() }, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `archived-tasks-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
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
		background: var(--color-background);
		border-radius: 0.5rem;
		min-width: 300px;
		max-width: 350px;
		height: 100%;
	}

	.column-header {
		padding: 1rem 1rem 0.75rem;
		border-bottom: 1px solid var(--color-border);
	}

	.column-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.column-title h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-foreground);
	}

	.task-count {
		padding: 0.125rem 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		background: var(--color-card);
		color: var(--color-accent);
		border: 1px solid var(--color-border);
		border-radius: 1rem;
		min-width: 1.5rem;
		text-align: center;
	}

	.column-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.archive-btn {
		flex: 1;
		padding: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		background: transparent;
		color: var(--color-accent);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
	}

	.archive-btn:hover {
		background: var(--color-card);
		border-color: var(--color-foreground);
		color: var(--color-foreground);
	}

	.add-task-btn {
		width: 100%;
		padding: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		background: transparent;
		color: var(--color-accent);
		border: 1px dashed var(--color-border);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
	}

	.add-task-btn:hover {
		background: var(--color-card);
		border-color: var(--color-accent);
		color: var(--color-foreground);
	}

	.column-tasks {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
		overflow-y: auto;
		min-height: 200px;
	}

	:global(.drop-target) {
		outline: 2px dashed var(--color-accent);
		outline-offset: -8px;
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
		padding: 2rem 1rem;
		color: var(--color-accent);
		font-family: var(--font-body);
		font-style: italic;
		font-size: 0.875rem;
	}

	.empty-state p {
		margin: 0;
	}
</style>
