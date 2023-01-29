<script lang="ts">
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/db';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { BookingDto } from '$lib/DataDto';
	import Modal from './Modal.svelte';

	let loading = false;
	let session: AuthSession;
	let myBookings: BookingDto[] = [];
	let selectedBooking: BookingDto;
	let showDeletePopup = false;

	if ($page.data.session) {
		session = $page.data.session;
	}

	const fetchBookingData = async () => {
		try {
			loading = true;
			const { data, error, status } = await supabaseClient
				.from('bokningar')
				.select()
				.eq('user_id', session?.user.id)
				.order('from_date', { ascending: true });

			myBookings = data as BookingDto[];

			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const deleteBooking = async () => {
		try {
			loading = true;
			const { error } = await supabaseClient
				.from('bokningar')
				.delete()
				.eq('id', selectedBooking.id);

			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
			showDeletePopup = false;
			fetchBookingData();
		}
	};

	onMount(async () => {
		await fetchBookingData();
	});
</script>

{#if showDeletePopup}
	<Modal title={'Ta bort vistelse'} on:close={() => (showDeletePopup = false)}>
		<div slot="content" class="bg-white">
			Är du säker på att du vill ta bort bokningen för datumen <span
				>{selectedBooking.from_date}</span
			>
			<span> till </span>
			<span>{selectedBooking.to_date}</span>?
		</div>
		<div slot="footer">
			<button
				class="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded mb-6"
				on:click={() => (showDeletePopup = false)}>Avbryt</button
			>
			<button
				class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
				on:click={() => deleteBooking()}
			>
				Ja
			</button>
		</div>
	</Modal>
{/if}

<div class=" px-8 pt-6 pb-8 mb-4 bg-white rounded">
	<h1 class=" text-lg font-semibold">Mina bokningar</h1>
	{#if myBookings.length > 0}
		{#each myBookings as booking, i}
			<div class="flex items-start justify-between mt-3">
				<div>
					{#if booking.type === 0}
						<h2 class="font-medium text-teal-500">Öppen bokning</h2>
					{/if}
					{#if booking.type === 1}
						<h2 class=" font-medium text-fuchsia-700">Privat bokning</h2>
					{/if}
					<div>
						<span>{booking.from_date}</span>
						<span> till </span>
						<span>{booking.to_date}</span>
					</div>
					{#if booking.comment}
						<p><span class="font-medium">Kommentar: </span>{booking.comment}</p>
					{/if}
				</div>
				<button
					class="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-2 rounded mb-6 my-2"
					on:click={() => {
						showDeletePopup = true;
						selectedBooking = booking;
					}}>Ta bort</button
				>
			</div>
		{/each}
	{:else}
		<p>Du har inte några bokningar</p>
	{/if}
</div>
