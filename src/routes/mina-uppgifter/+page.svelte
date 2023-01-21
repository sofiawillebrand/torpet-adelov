<script lang="ts">
	import { page } from '$app/stores';
	import Account from '$lib/Account.svelte';
	import Auth from '$lib/Auth.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$page.data.session) {
			window.location.href = '/#';
		}
	});
</script>

<svelte:head>
	<title>Torpet - Mina uppgifter</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	<Account session={$page.data.session} />
{/if}
