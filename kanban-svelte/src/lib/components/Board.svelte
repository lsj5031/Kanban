<script lang="ts">
	import { board } from '$lib/stores/board.svelte';
	import { groupTasksByColumn } from '$lib/services/storage';
	import Column from './Column.svelte';

	const columns = $derived(groupTasksByColumn(board.tasks));
</script>

<div class="board" aria-live="polite">
	{#each columns as column}
		<Column {column} />
	{/each}
</div>

<style>
	.board {
		display: flex;
		gap: 1.5rem;
		padding: 2rem;
		overflow-x: auto;
		min-height: calc(100vh - 200px);
		align-items: flex-start;
	}

	@media (max-width: 768px) {
		.board {
			padding: 1rem;
			gap: 1rem;
		}
	}
</style>
