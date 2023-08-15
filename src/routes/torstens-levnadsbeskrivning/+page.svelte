<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Auth from '$lib/Auth.svelte';
	import Torsten from '$lib/Torsten.svelte';

	onMount(() => {
		if (!$page.data.session) {
			window.location.href = '/#';
		}
	});
</script>

<svelte:head>
	<title>Torpet - Torstens levnadsbeskrivning</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	<Torsten />
{/if}
