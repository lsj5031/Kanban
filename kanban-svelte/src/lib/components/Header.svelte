<script lang="ts">
	import { board } from '$lib/stores/board.svelte';
	import { ui } from '$lib/stores/ui.svelte';

	let jsonInput: HTMLInputElement;

	async function handleJSONUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const content = await readFileWithProgress(file, 'Importing JSON...');
			if (content) {
				board.loadFromJSON(content, (current, total) => {
					ui.updateImportProgress(current);
				});
				ui.finishImport();
			}
		}
		input.value = '';
	}

	async function readFileWithProgress(file: File, message: string): Promise<string | null> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			const fileSize = file.size;

			ui.startImport(fileSize, message);

			reader.onprogress = (e) => {
				if (e.loaded && e.total) {
					ui.updateImportProgress(e.loaded);
				}
			};

			reader.onload = (e) => {
				resolve(e.target?.result as string);
			};

			reader.onerror = () => {
				ui.finishImport();
				resolve(null);
			};

			reader.readAsText(file);
		});
	}

	function triggerJSONUpload() {
		jsonInput.click();
	}

	function exportJSON() {
		const json = board.exportJSON();
		downloadFile('kanban-board.json', json, 'application/json');
	}

	function downloadFile(filename: string, content: string, mimeType: string) {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function handleReset() {
		ui.openResetDialog();
	}
</script>

<header class="header">
	<div class="header-inner">
		<div class="header-brand">
			<img src="/logo.png" alt="Kanban Mono" class="logo-img" />
		</div>

		<div class="header-controls">
			{#if ui.importProgress.active}
				<div class="import-progress">
					<div class="progress-label">{ui.importProgress.message}</div>
					<div class="progress-bar">
						<div
							class="progress-fill"
							style="width: {ui.importProgress.total > 0 ? (ui.importProgress.current / ui.importProgress.total * 100) : 0}%"
						></div>
					</div>
					<div class="progress-text">
						{ui.importProgress.current} / {ui.importProgress.total}
					</div>
				</div>
			{/if}

			<div class="control-row">
				<label class="btn btn-outline" for="jsonInput">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="17 8 12 3 7 8"></polyline>
						<line x1="12" y1="3" x2="12" y2="15"></line>
					</svg>
					Import
				</label>
				<input bind:this={jsonInput} id="jsonInput" type="file" accept=".json,application/json" onchange={handleJSONUpload} hidden />

				<button class="btn btn-outline" onclick={exportJSON}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					Export
				</button>
				<button class="btn btn-ghost" onclick={handleReset}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="1 4 1 10 7 10"></polyline>
						<path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
					</svg>
					Reset
				</button>
			</div>
		</div>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 1rem;
		z-index: 100;
		margin: 1rem 2rem;
	}

	.header-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(222, 216, 207, 0.5);
		border-radius: 9999px;
		box-shadow: var(--shadow-soft);
		flex-wrap: wrap;
	}

	.header-brand {
		display: flex;
		align-items: center;
		gap: 0.875rem;
	}

	.logo-img {
		height: 2.5rem;
		width: auto;
		border-radius: 0.5rem;
	}

	.header-controls {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.control-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
		border: 2px solid transparent;
	}

	.btn-outline {
		background: transparent;
		color: var(--color-secondary);
		border-color: var(--color-secondary);
	}

	.btn-outline:hover {
		background: var(--color-secondary);
		color: var(--color-secondary-foreground);
		transform: scale(1.05);
		box-shadow: 0 6px 24px -4px rgba(193, 140, 93, 0.25);
	}

	.btn-outline:active {
		transform: scale(0.95);
	}

	.btn-ghost {
		background: transparent;
		color: var(--color-primary);
		border-color: transparent;
	}

	.btn-ghost:hover {
		background: rgba(93, 112, 82, 0.1);
		transform: scale(1.05);
	}

	.btn-ghost:active {
		transform: scale(0.95);
	}

	.import-progress {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: 9999px;
		font-family: var(--font-body);
		font-size: 0.8125rem;
		box-shadow: var(--shadow-card);
	}

	.progress-label {
		color: var(--color-foreground);
		white-space: nowrap;
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		min-width: 80px;
		background: var(--color-muted);
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 0.3s ease;
		border-radius: 9999px;
	}

	.progress-text {
		color: var(--color-muted-foreground);
		white-space: nowrap;
		min-width: 70px;
		text-align: right;
	}

	@media (max-width: 768px) {
		.header {
			margin: 0.75rem 1rem;
		}

		.header-inner {
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
			border-radius: 1.5rem;
		}

		.header-controls {
			width: 100%;
			align-items: center;
		}

		.control-row {
			justify-content: center;
			width: 100%;
		}

		.btn {
			padding: 0.5rem 1rem;
			font-size: 0.8125rem;
		}
	}
</style>
