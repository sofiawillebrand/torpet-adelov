<script lang="ts">
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/db';
	import Modal from '$lib/Modal.svelte';
	import { bookingStore } from '../../booking-store';
	import { page } from '$app/stores';

	export let showModal = false;
	let username: string | null = null;
	let loading = false;
	let session: AuthSession;

	if ($page.data.session) {
		session = $page.data.session;
	}

	const bookVisit = async () => {
		try {
			loading = true;
			const { user } = session;

			const booking = {
				userid: user.id,
				from_date: $bookingStore.startdate,
				to_date: $bookingStore.enddate,
				type: $bookingStore.type
			};

			const { error } = await supabaseClient.from('bokningar').insert(booking);

			if (error) throw error;
			showModal = false;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<Modal title={'Boka vistelse'} on:close={() => (showModal = false)}>
	<form slot="content" class="bg-white">
		<p class=" text-gray-700 text-sm  mb-4">
			Observera att din email och ditt namn kommer att synas vid de datum du bokar för andra som har
			tillgång till kalendern.
		</p>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="startdate"> Startdatum </label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="startdate"
				type="date"
				bind:value={$bookingStore.startdate}
			/>
		</div>
		<div class="mb-6">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="enddate"> Slutdatum </label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="enddate"
				type="date"
				bind:value={$bookingStore.enddate}
			/>
		</div>
		<div class="mb-6">
			<p class="block text-gray-700 text-sm font-bold mb-2">
				Vill du tillåta andra att boka samma datum:
			</p>
			<input id="allow-other" type="radio" name="allow" value={0} bind:group={$bookingStore.type} />
			<label class=" text-gray-700 text-sm mb-2" for="allow-other"> Ja </label>
			<input
				id="dont-allow-other"
				type="radio"
				name="allow"
				value={1}
				bind:group={$bookingStore.type}
			/>
			<label class=" text-gray-700 text-sm mb-2" for="dont-allow-other"> Nej </label>
		</div>
	</form>
	<button
		slot="footer"
		class="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded"
		on:click={bookVisit}
	>
		Skicka
	</button>
</Modal>
