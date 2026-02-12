<script lang="ts">
	import { board } from '$lib/stores/board.svelte';
	import { groupTasksByColumn } from '$lib/services/storage';
	import Column from './Column.svelte';

	const columns = $derived(groupTasksByColumn(board.tasks));
</script>

<div class="board-container" aria-live="polite">
	<!-- Ambient blob backgrounds -->
	<div class="blob blob-1"></div>
	<div class="blob blob-2"></div>
	<div class="blob blob-3"></div>

	<div class="board">
		{#each columns as column}
			<Column {column} />
		{/each}
	</div>
</div>

<style>
	.board-container {
		position: relative;
		flex: 1;
		overflow: hidden;
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
		pointer-events: none;
		z-index: 0;
	}

	.blob-1 {
		width: 400px;
		height: 400px;
		background: var(--color-primary);
		top: 5%;
		left: 5%;
		opacity: 0.15;
		animation: float-1 20s ease-in-out infinite;
	}

	.blob-2 {
		width: 350px;
		height: 350px;
		background: var(--color-secondary);
		top: 40%;
		right: 8%;
		opacity: 0.12;
		animation: float-2 25s ease-in-out infinite;
	}

	.blob-3 {
		width: 300px;
		height: 300px;
		background: var(--color-accent);
		bottom: 10%;
		left: 40%;
		opacity: 0.2;
		animation: float-3 22s ease-in-out infinite;
	}

	@keyframes float-1 {
		0%, 100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(30px, -30px) scale(1.05);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.95);
		}
	}

	@keyframes float-2 {
		0%, 100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(-25px, 25px) scale(1.1);
		}
		66% {
			transform: translate(15px, -15px) scale(0.9);
		}
	}

	@keyframes float-3 {
		0%, 100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(20px, 20px) scale(0.95);
		}
		66% {
			transform: translate(-15px, -10px) scale(1.08);
		}
	}

	.board {
		position: relative;
		display: flex;
		gap: 1.5rem;
		padding: 2rem;
		padding-top: 1rem;
		overflow-x: auto;
		min-height: calc(100vh - 220px);
		align-items: flex-start;
		z-index: 1;
	}

	@media (max-width: 768px) {
		.board {
			padding: 1rem;
			padding-top: 0.5rem;
			gap: 1rem;
		}

		.blob-1 {
			width: 250px;
			height: 250px;
		}

		.blob-2 {
			width: 200px;
			height: 200px;
		}

		.blob-3 {
			width: 180px;
			height: 180px;
		}
	}
</style>
