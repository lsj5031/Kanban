<script lang="ts">
	import { ui } from '$lib/stores/ui.svelte';

	let { tag }: { tag: string } = $props();

	function handleClick() {
		ui.toggleTag(tag);
	}

	const isHighlighted = $derived(ui.isTagHighlighted(tag));
</script>

<button
	class="tag-chip"
	class:highlighted={isHighlighted}
	onclick={handleClick}
	aria-label="Filter by tag {tag}"
	type="button"
>
	{tag}
</button>

<style>
	.tag-chip {
		padding: 0.25rem 0.625rem;
		font-size: 0.6875rem;
		font-family: var(--font-body);
		font-weight: 600;
		background: var(--color-muted);
		border: 1px solid transparent;
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.3s ease;
		color: var(--color-muted-foreground);
	}

	.tag-chip:hover {
		background: var(--color-primary);
		color: var(--color-primary-foreground);
		transform: scale(1.05);
	}

	.tag-chip:active {
		transform: scale(0.98);
	}

	.tag-chip.highlighted {
		background: var(--color-primary);
		color: var(--color-primary-foreground);
		border-color: var(--color-primary);
		box-shadow: 0 2px 10px -2px rgba(93, 112, 82, 0.3);
	}

	.tag-chip.highlighted:hover {
		background: #4d5f44;
		border-color: #4d5f44;
	}
</style>
