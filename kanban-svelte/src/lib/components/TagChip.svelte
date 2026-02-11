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
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		font-family: var(--font-mono);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.15s ease;
		color: var(--color-foreground);
	}

	.tag-chip:hover {
		background: var(--color-card-hover);
		border-color: var(--color-border-heavy);
	}

	.tag-chip.highlighted {
		background: var(--color-foreground);
		color: var(--color-background);
		border-color: var(--color-foreground);
	}
</style>
