<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Kanban Mono</title>
	<meta name="description" content="A minimalist, monochrome Kanban board for task management" />
	<meta name="theme-color" content="#5D7052" />
	<meta property="og:title" content="Kanban Mono" />
	<meta property="og:description" content="A minimalist, monochrome Kanban board for task management" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/logo.png" />
</svelte:head>

{@render children()}
