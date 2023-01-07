<script lang="ts">
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/db';

	export let session: AuthSession;

	let loading = false;
	let username: string | null = null;

	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			loading = true;
			const { user } = session;

			const { data, error, status } = await supabaseClient
				.from('profiles')
				.select(`username`)
				.eq('id', user.id)
				.single();

			if (data) {
				username = data.username;
			}

			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	async function updateProfile() {
		try {
			loading = true;
			const { user } = session;

			const updates = {
				id: user.id,
				username: username,
				updated_at: new Date()
			};

			let { error } = await supabaseClient.from('profiles').upsert(updates);

			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}

	async function signOut() {
		try {
			loading = true;
			let { error } = await supabaseClient.auth.signOut();
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}
</script>

<form class=" px-8 pt-6 pb-8 mb-4 bg-white" on:submit|preventDefault={updateProfile}>
	<div class="mb-4">
		<label for="email">E-mail</label>
		<input
			id="email"
			type="text"
			value={session.user.email}
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			disabled
		/>
	</div>
	<div class="mb-4">
		<label for="username">Namn</label>
		<input
			id="username"
			type="text"
			bind:value={username}
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
		/>
	</div>

	<div class="mb-4">
		<input
			type="submit"
			class="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded"
			value={loading ? 'Loading...' : 'Uppdatera'}
			disabled={loading}
		/>
		<button
			class="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded"
			on:click={signOut}
			disabled={loading}>Logga ut</button
		>
	</div>
</form>
