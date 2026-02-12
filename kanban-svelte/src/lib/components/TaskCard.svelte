<script lang="ts">
	import { board } from '$lib/stores/board.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import TagChip from './TagChip.svelte';

	let { task }: { task: { id: string; title: string; description: string; priority: string; dueDate: string; tags: string[]; status: string; order: number } } = $props();

	function handleEdit() {
		ui.openEditModal(task);
	}

	function handleDelete() {
		ui.openDeleteDialog({ id: task.id, title: task.title });
	}

	const priorityClass = $derived(
		task.priority === 'High'
			? 'high'
			: task.priority === 'Medium'
				? 'medium'
				: task.priority === 'Low'
					? 'low'
					: ''
	);

	const formattedDate = $derived(
		task.dueDate
			? new Date(task.dueDate).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				})
			: ''
	);

	const isOverdue = $derived(
		task.dueDate ? new Date(task.dueDate) < new Date() && new Date(task.dueDate).toDateString() !== new Date().toDateString() : false
	);

	const isDimmed = $derived(
		ui.highlightedTags.size > 0 && !task.tags.some((tag) => ui.highlightedTags.has(tag))
	);
</script>

<div class="task-card" class:dimmed={isDimmed} data-task-id={task.id}>
	<div class="task-card-inner" class:priority-border={!!priorityClass}>
		<div class="task-header">
			<h4 class="task-title">{task.title}</h4>
			<div class="task-actions">
				<button
					class="action-btn"
					onclick={handleEdit}
					aria-label="Edit task"
					type="button"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
						<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
					</svg>
				</button>
				<button
					class="action-btn"
					onclick={handleDelete}
					aria-label="Delete task"
					type="button"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="3 6 5 6 21 6"></polyline>
						<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
					</svg>
				</button>
			</div>
		</div>

		{#if task.description}
			<p class="task-description">{task.description}</p>
		{/if}

		<div class="task-meta">
			{#if task.priority}
				<span class="priority-badge {priorityClass}">{task.priority}</span>
			{/if}

			{#if task.dueDate}
				<span class="due-date" class:overdue={isOverdue}>
					{formattedDate}
				</span>
			{/if}
		</div>

		{#if task.tags.length > 0}
			<div class="task-tags">
				{#each task.tags as tag}
					{@const tagLower = tag.toLowerCase()}
					{#if ui.highlightedTags.size === 0 || ui.highlightedTags.has(tagLower)}
						<TagChip {tag} />
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.task-card {
		background: var(--color-background);
		border: 1px solid rgba(222, 216, 207, 0.5);
		border-radius: 1rem;
		transition: all 0.3s ease;
		box-shadow: var(--shadow-card);
	}

	.task-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-card-hover);
		border-color: rgba(222, 216, 207, 0.7);
	}

	.task-card.dimmed {
		opacity: 0.35;
	}

	.task-card-inner {
		padding: 1rem;
	}

	.task-card-inner.priority-border {
		border-left: 3px solid;
		border-top-left-radius: 1rem;
		border-bottom-left-radius: 1rem;
	}

	.task-card-inner.priority-border.high {
		border-left-color: var(--color-priority-high);
	}

	.task-card-inner.priority-border.medium {
		border-left-color: var(--color-priority-medium);
	}

	.task-card-inner.priority-border.low {
		border-left-color: var(--color-priority-low);
	}

	.task-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 0.625rem;
	}

	.task-title {
		margin: 0;
		font-family: var(--font-body);
		font-size: 0.9375rem;
		font-weight: 600;
		line-height: 1.45;
		color: var(--color-foreground);
		flex: 1;
		word-break: break-word;
	}

	.task-actions {
		display: flex;
		gap: 0.125rem;
		flex-shrink: 0;
	}

	.action-btn {
		padding: 0.375rem;
		background: transparent;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		color: var(--color-muted-foreground);
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.action-btn:hover {
		color: var(--color-primary);
		background: rgba(93, 112, 82, 0.1);
	}

	.task-description {
		margin: 0 0 0.625rem 0;
		font-family: var(--font-body);
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-muted-foreground);
		line-clamp: 3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.task-meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 0.625rem;
	}

	.priority-badge {
		padding: 0.1875rem 0.625rem;
		font-family: var(--font-body);
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		border-radius: 9999px;
	}

	.priority-badge.high {
		background: rgba(168, 84, 72, 0.12);
		color: var(--color-priority-high);
	}

	.priority-badge.medium {
		background: rgba(193, 140, 93, 0.15);
		color: var(--color-priority-medium);
	}

	.priority-badge.low {
		background: rgba(93, 112, 82, 0.12);
		color: var(--color-priority-low);
	}

	.due-date {
		padding: 0.1875rem 0.625rem;
		font-family: var(--font-body);
		font-size: 0.6875rem;
		font-weight: 500;
		background: var(--color-muted);
		color: var(--color-muted-foreground);
		border-radius: 9999px;
	}

	.due-date.overdue {
		background: rgba(168, 84, 72, 0.1);
		color: var(--color-priority-high);
		font-weight: 600;
	}

	.task-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
</style>
