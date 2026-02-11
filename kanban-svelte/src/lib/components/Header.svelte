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
		if (confirm('Are you sure you want to reset the board? This will delete all tasks.')) {
			board.reset();
			ui.clearHighlightedTags();
		}
	}
</script>

<header class="header">
	<div class="header-top">
		<div class="header-brand">
			<h1 class="display-text">
				KANBAN<span style="font-size: 0.5em; vertical-align: super; font-style: italic">Mono</span>
			</h1>
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
				<label class="btn" for="jsonInput">Import</label>
				<input bind:this={jsonInput} id="jsonInput" type="file" accept=".json,application/json" onchange={handleJSONUpload} hidden />

				<button class="btn" onclick={exportJSON}>Export</button>
				<button class="btn ghost" onclick={handleReset}>Reset</button>
			</div>
		</div>
	</div>
</header>

<style>
	.header {
		background: var(--color-background);
		border-bottom: 1px solid var(--color-border);
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
		padding: 2rem;
		flex-wrap: wrap;
	}

	.header-brand {
		flex: 1;
		min-width: 200px;
	}

	.display-text {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 700;
		color: var(--color-foreground);
		letter-spacing: -0.02em;
	}

	.header-controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.control-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.5rem 1rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		background: var(--color-foreground);
		color: var(--color-background);
		border: 1px solid var(--color-foreground);
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.btn:hover {
		background: transparent;
		color: var(--color-foreground);
	}

	.btn.ghost {
		background: transparent;
		color: var(--color-foreground);
		border-color: var(--color-border);
	}

	.btn.ghost:hover {
		background: var(--color-card);
		border-color: var(--color-border-heavy);
	}

	.import-progress {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
	}

	.progress-label {
		color: var(--color-foreground);
		white-space: nowrap;
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		min-width: 100px;
		background: var(--color-border);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-foreground);
		transition: width 0.15s ease;
	}

	.progress-text {
		color: var(--color-foreground);
		opacity: 0.7;
		white-space: nowrap;
		min-width: 80px;
		text-align: right;
	}

	@media (max-width: 768px) {
		.header-top {
			flex-direction: column;
			gap: 1.5rem;
		}

		.header-controls {
			width: 100%;
		}

		.control-row {
			justify-content: center;
		}
	}
</style>
