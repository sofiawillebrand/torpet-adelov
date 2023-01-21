<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Torpet - Mina bokningar</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if $page.data.session}
	Hej
{/if}
