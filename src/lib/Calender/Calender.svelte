<script lang="ts">
	import CalenderForm from './CalenderForm.svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/db';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let loading = false;
	let session: AuthSession;

	if ($page.data.session) {
		session = $page.data.session;
	}

	const date = new Date();
	const today = {
		dayNumber: date.getDate(),
		month: date.getMonth(),
		year: date.getFullYear()
	};
	const monthNames: string[] = [
		'Januari',
		'Februari',
		'Mars',
		'April',
		'Maj',
		'Juni',
		'Juli',
		'Augusti',
		'September',
		'Oktober',
		'November',
		'December'
	];
	let monthIndex: number = date.getMonth();
	let year: number = date.getFullYear();
	let showModal = false;

	$: month = monthNames[monthIndex];
	$: firstDayIndex = new Date(year, monthIndex, 1).getDay();
	$: numberOfDays = new Date(year, monthIndex + 1, 0).getDate();
	$: numberOfDaysPreviousMonth = new Date(year, monthIndex, 0).getDate();
	$: calendarCellsQty = firstDayIndex <= 4 ? 35 : 42;

	const updateMonth = (step: number) => {
		monthIndex = monthIndex + step;

		if (monthIndex > 11) {
			monthIndex = 0;
			year = year + 1;
		} else if (monthIndex < 0) {
			monthIndex = 0;
			year = year - 1;
		}
	};

	let bookingsInCurrentMonth: unknown[];
	onMount(async () => {
		try {
			loading = true;
			const { data, error, status } = await supabaseClient.from('bokningar').select('*');

			if (data) {
				bookingsInCurrentMonth = data.filter((d) => {
					const fromMonth = parseInt(d.from_date.split('-')[1]);
					const toMonth = parseInt(d.to_date.split('-')[1]);

					if (fromMonth === monthIndex + 1 || toMonth === monthIndex + 1) return true;
				});
			}

			console.log(bookingsInCurrentMonth);

			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	});
</script>

<!-- TODO: Click on calender and open booking on that day -->
<!-- TODO: Display other bookings on page if dates overlap with other -->
<!-- TODO: Possibility to add comment to booking -->
<!-- TODO: Section for overlooking a booking -->

{#if showModal}
	<CalenderForm bind:showModal />
{/if}

<button
	class="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded mb-6"
	on:click={() => (showModal = true)}>Lägg till en bokning</button
>

<section class=" px-3 py-1 w-full bg-sky-900 text-center rounded-t">
	<div class="h-16">
		<button
			class="text-white text-xl uppercase float-left h-16 w-8 text-center"
			on:click={() => updateMonth(-1)}
			>&#10094;
		</button>
		<button
			class="text-white text-xl uppercase float-right h-16 w-8 text-center"
			on:click={() => updateMonth(1)}
			>&#10095;
		</button>
		<p class="text-white my-auto">{month}<br /><span>{year}</span></p>
	</div>
</section>

<section class="m-0 bg-gray-300 w-full grid grid-cols-7">
	<div class="text-center mb-1 text-sm p-1">Må</div>
	<div class="text-center mb-1 text-sm p-1">Ti</div>
	<div class="text-center mb-1 text-sm p-1">On</div>
	<div class="text-center mb-1 text-sm p-1">To</div>
	<div class="text-center mb-1 text-sm p-1">Fr</div>
	<div class="text-center mb-1 text-sm p-1">Lö</div>
	<div class="text-center mb-1 text-sm p-1">Sö</div>
</section>

<section class="m-0 bg-white w-full grid grid-cols-7">
	{#each Array(calendarCellsQty) as _, i}
		{#if i < firstDayIndex}
			<div class="text-center text-sm p-1 border-gray-500 border text-gray-500">
				{i - firstDayIndex + numberOfDaysPreviousMonth + 1}
			</div>
		{:else if i >= numberOfDays + firstDayIndex}
			<div class="text-center text-sm p-1 border-gray-500 border text-gray-500">
				{i - firstDayIndex - numberOfDays + 1}
			</div>
		{:else}
			<div
				class:font-extrabold={i === today.dayNumber + (firstDayIndex - 1) &&
					monthIndex === today.month &&
					year === today.year}
				class="text-center text-md p-1 border-sky-900 border"
				data-dateID={`${month}_${i - firstDayIndex + 1}_${year}`}
			>
				{i - firstDayIndex + 1}
			</div>
		{/if}
	{/each}
</section>
