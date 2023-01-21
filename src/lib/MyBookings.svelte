<script lang="ts">
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/db';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { BookingDto } from '$lib/DataDto';

	let loading = false;
	let session: AuthSession;
	let myBookings: BookingDto[] = [];

	if ($page.data.session) {
		session = $page.data.session;
	}

	const fetchBookingData = async () => {
		try {
			loading = true;
			const { data, error, status } = await supabaseClient
				.from('bokningar')
				.select()
				.eq('userid', session?.user.id)
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

	onMount(async () => {
		await fetchBookingData();
	});
</script>

<div class=" px-8 pt-6 pb-8 mb-4 bg-white rounded">
	<h1 class=" text-lg font-semibold">Mina bokningar</h1>
	{#if myBookings.length > 0}
		{#each myBookings as booking, i}
			{#if booking.type === 0}
				<h2 class="mt-4 font-medium text-teal-500">Öppen bokning</h2>
			{/if}
			{#if booking.type === 1}
				<h2 class="mt-4 font-medium text-fuchsia-700">Privat bokning</h2>
			{/if}
			<div>
				<span>{booking.from_date}</span>
				<span> till </span>
				<span>{booking.to_date}</span>
			</div>
		{/each}
	{/if}
</div>
