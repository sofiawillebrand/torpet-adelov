<script lang="ts">
	import { page } from '$app/stores';
	import Account from '$lib/Account.svelte';
</script>

<svelte:head>
	<title>Torpet - Mina uppgifter</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if $page.data.session}
	<Account session={$page.data.session} />
{/if}
