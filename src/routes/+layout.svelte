<script lang="ts">
	import { supabaseClient } from '$lib/db';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/Header.svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<!-- TODO: Add page for pictures -->
<!-- TODO: Add page for being able to give tips about things to do in the area -->

<main class="mx-auto md:w-2/4">
	<Header />
	<slot />
</main>
