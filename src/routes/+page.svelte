<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import Info from '$lib/Info.svelte';
</script>

<svelte:head>
	<title>Torpet</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	<Info />
{/if}
