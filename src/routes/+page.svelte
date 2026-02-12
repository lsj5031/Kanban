<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Board from '$lib/components/Board.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import TaskModal from '$lib/components/TaskModal.svelte';
	import DeleteDialog from '$lib/components/DeleteDialog.svelte';
	import ArchiveDialog from '$lib/components/ArchiveDialog.svelte';
	import ResetDialog from '$lib/components/ResetDialog.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import { setupKeyboardShortcuts } from '$lib/utils/keyboard';

	// Set up keyboard shortcuts
	$effect(() => {
		const cleanup = setupKeyboardShortcuts([
			{
				key: 'n',
				ctrlKey: true,
				callback: () => ui.openAddModal()
			},
			{
				key: 'n',
				metaKey: true,
				callback: () => ui.openAddModal()
			}
		]);

		return cleanup;
	});
</script>

<div class="app">
	<Header />
	<main class="main">
		<Board />
	</main>
	<Footer />
	<TaskModal />
	<DeleteDialog />
	<ArchiveDialog />
	<ResetDialog />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main {
		flex: 1;
	}
</style>
