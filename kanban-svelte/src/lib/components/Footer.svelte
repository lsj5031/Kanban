<script lang="ts">
</script>

<footer class="footer">
	<div>Data stored locally.</div>
	<div class="shortcuts">
		<span class="kbd">TAB</span> to focus •
		<span class="kbd">SPACE</span> to highlight •
		Drag to reorder
	</div>
</footer>

<style>
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		border-top: 1px solid var(--color-border);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-accent);
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.shortcuts {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.kbd {
		padding: 0.125rem 0.375rem;
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	@media (max-width: 640px) {
		.footer {
			flex-direction: column;
			text-align: center;
		}
	}
</style>
