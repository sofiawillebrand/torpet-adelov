<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import MyBookings from '$lib/MyBookings.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$page.data.session) {
			window.location.href = '/#';
		}
	});
</script>

<svelte:head>
	<title>Torpet - Mina bokningar</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	<MyBookings />
{/if}
