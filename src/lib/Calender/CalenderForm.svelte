<script lang="ts">
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/db';
	import Modal from '$lib/Modal.svelte';
	import { bookingStore } from '../../booking-store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	interface OverlappingBookings {
		from_date: string;
		to_date: string;
		comment: string;
		type: number;
		profiles: {
			username: string;
			email: string;
		};
	}

	export let showModal = false;
	let loading = false;
	let session: AuthSession;
	let overlappingBookings: OverlappingBookings[];

	$: $bookingStore, fetchBookingsOnDate();

	if ($page.data.session) {
		session = $page.data.session;
	}

	const fetchBookingsOnDate = async () => {
		try {
			loading = true;

			const { data, error, status } = await supabaseClient
				.from('bokningar')
				.select('from_date,to_date,type,comment, profiles (username, email)')
				.or(
					`and(to_date.gte.${$bookingStore.enddate}, from_date.lte.${$bookingStore.enddate}), and(from_date.lte.${$bookingStore.startdate}, to_date.gte.${$bookingStore.startdate}), and(from_date.gte.${$bookingStore.startdate}, to_date.lte.${$bookingStore.enddate})`
				);

			if (data) {
				overlappingBookings = data as OverlappingBookings[];
			}
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const bookVisit = async () => {
		try {
			loading = true;
			const { user } = session;

			const booking = {
				user_id: user.id,
				from_date: $bookingStore.startdate,
				to_date: $bookingStore.enddate,
				type: $bookingStore.type,
				comment: $bookingStore.comment
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

	onMount(() => {
		fetchBookingsOnDate();
	});
</script>

<Modal
	title={'Boka din vistelse: ' + $bookingStore.startdate + ' till ' + $bookingStore.enddate}
	on:close={() => (showModal = false)}
>
	<form slot="content" class="bg-white">
		<p class=" text-gray-700 text-sm  mb-4">
			Observera att ditt namn och eventuell kommentar kommer att synas för andra som har tillgång
			till kalendern.
		</p>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="startdate"> Startdatum </label>
			<input
				type="date"
				bind:value={$bookingStore.startdate}
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="startdate"
			/>
		</div>
		<div class="mb-6">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="enddate"> Slutdatum </label>
			<input
				type="date"
				bind:value={$bookingStore.enddate}
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="enddate"
			/>
		</div>
		<div class="mb-6">
			<p class="block text-gray-700 text-sm font-bold mb-2">
				Föredrar du att vara själv på torpet under denna bokning:
			</p>
			<input id="allow-other" type="radio" name="allow" value={0} bind:group={$bookingStore.type} />
			<label class=" text-gray-700 text-sm mb-2" for="allow-other"> Nej </label>
			<input
				id="dont-allow-other"
				type="radio"
				name="allow"
				value={1}
				bind:group={$bookingStore.type}
			/>
			<label class=" text-gray-700 text-sm mb-2" for="dont-allow-other"> Ja </label>
		</div>
		<div class="mb-6">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="comment"> Kommentar </label>
			<textarea
				bind:value={$bookingStore.comment}
				placeholder="Ny kommentar"
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="comment"
			/>
		</div>
		{#if overlappingBookings?.length > 0}
			<p class=" text-sky-500 text-md  mb-2">
				Din planerade bokning överlappar med {overlappingBookings?.length} bokningar
			</p>
			{#each overlappingBookings as booking, i}
				{#if booking.type === 1}
					<p class=" text-gray-700 text-sm  mb-4">
						{booking.profiles.username} har bokat en
						<span class="text-fuchsia-300 font-medium">privat</span>
						bokning från {booking.from_date}
						till {booking.to_date}
					</p>
				{:else}
					<p class=" text-gray-700 text-sm  mb-4">
						{booking.profiles.username} har bokat en
						<span class="text-teal-300 font-medium">öppen</span>
						bokning från {booking.from_date} till {booking.to_date}
					</p>
				{/if}
			{/each}
		{/if}
	</form>
	<button
		slot="footer"
		class="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded"
		on:click={bookVisit}
	>
		Skicka
	</button>
</Modal>
