<script lang="ts">
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-content">
			<div class="footer-left">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
				</svg>
				<span>Data stored locally</span>
			</div>
			<div class="shortcuts">
				<span class="kbd">TAB</span>
				<span class="shortcut-label">focus</span>
				<span class="separator">•</span>
				<span class="kbd">SPACE</span>
				<span class="shortcut-label">highlight</span>
				<span class="separator">•</span>
				<span class="shortcut-label">Drag to reorder</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		margin: 0 2rem 1.5rem;
	}

	.footer-inner {
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(222, 216, 207, 0.4);
		border-radius: 1.5rem;
		box-shadow: var(--shadow-card);
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.footer-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: 0.8125rem;
		color: var(--color-muted-foreground);
	}

	.footer-left svg {
		color: var(--color-primary);
		opacity: 0.7;
	}

	.shortcuts {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.75rem;
		padding: 0.25rem 0.5rem;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		font-family: var(--font-body);
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--color-muted-foreground);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.shortcut-label {
		font-family: var(--font-body);
		font-size: 0.75rem;
		color: var(--color-muted-foreground);
	}

	.separator {
		color: var(--color-border);
		margin: 0 0.25rem;
	}

	@media (max-width: 768px) {
		.footer {
			margin: 0 1rem 1rem;
		}

		.footer-content {
			flex-direction: column;
			text-align: center;
			gap: 0.75rem;
		}

		.shortcuts {
			justify-content: center;
		}
	}
</style>
