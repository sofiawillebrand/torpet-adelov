<script lang="ts">
	import CalenderForm from './CalenderForm.svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/db';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { BookingDto, ContentOfDate } from './Calender';

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
	let displayedDays: ContentOfDate[] = [];

	$: month = monthNames[monthIndex];
	$: firstDayIndex = new Date(year, monthIndex, 1).getDay();
	$: numberOfDays = new Date(year, monthIndex + 1, 0).getDate();
	$: numberOfDaysPreviousMonth = new Date(year, monthIndex, 0).getDate();
	$: calendarCellsQty = firstDayIndex <= 4 ? 35 : 42;

	const updateMonth = (step: number) => {
		fetchAndPrepareCalender();
		monthIndex = monthIndex + step;

		if (monthIndex > 11) {
			monthIndex = 0;
			year = year + 1;
		} else if (monthIndex < 0) {
			monthIndex = 0;
			year = year - 1;
		}
	};

	const fetchAndPrepareCalender = async () => {
		try {
			loading = true;
			const { data, error, status } = await supabaseClient.from('bokningar').select('*');

			if (data) {
				bookingsCurrentAdjacentMonth = data.filter((d) => {
					let fromMonth = parseInt(d.from_date.split('-')[1]) - 1;
					let toMonth = parseInt(d.to_date.split('-')[1]) + 1;

					if (fromMonth === monthIndex + 1 || toMonth === monthIndex + 1) return true;
					else if (fromMonth === monthIndex || toMonth === monthIndex) return true;
				});
			}

			console.log(bookingsCurrentAdjacentMonth);

			displayedDays = Array.from({ length: calendarCellsQty }, (x, i) => ({
				id: i,
				currentDay:
					i === today.dayNumber + (firstDayIndex - 1) &&
					i >= firstDayIndex &&
					i < numberOfDays + firstDayIndex,
				beforeFirstIndex: i < firstDayIndex,
				afterLastIndex: i >= numberOfDays + firstDayIndex,
				isBooked: false,
				privateBooking: false
			}));

			bookingsCurrentAdjacentMonth.forEach((b) => {
				const startDay = parseInt(b.from_date.split('-')[2]);
				const endDay = parseInt(b.to_date.split('-')[2]);
				const startDayMonth = parseInt(b.from_date.split('-')[1]);
				const endDayMonth = parseInt(b.to_date.split('-')[1]);

				if (startDayMonth !== monthIndex + 1 && endDayMonth !== monthIndex + 1) {
					return;
				} else if (startDayMonth !== monthIndex + 1 || endDayMonth !== monthIndex + 1) {
					console.log('b', b);
					let daysWithinMonthBooked: number[];
					let daysOutsideMonthBooked: number[];
					let daysOverlappingBooked: number[];

					let fromDateAsDate = new Date(b.from_date).valueOf();
					let toDateAsDate = new Date(b.to_date).valueOf();

					const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
					let lengthOfBooking = Math.round(Math.abs((fromDateAsDate - toDateAsDate) / oneDay));

					console.log('days booked', daysOverlappingBooked);

					daysOverlappingBooked.forEach((element) => {
						const index = displayedDays.findIndex((dd) => dd.id === element - 1);
						if (index != null) {
							displayedDays[index].isBooked = true;
							displayedDays[index].privateBooking = b.type === 1;
						}
					});
				} else {
					const daysBooked = Array.from(
						{ length: endDay - startDay + 1 },
						(x, i) => i + startDay + firstDayIndex
					);

					console.log('days within month booked', daysBooked);

					daysBooked.forEach((element) => {
						const index = displayedDays.findIndex((dd) => dd.id === element - 1);
						if (index != null) {
							displayedDays[index].isBooked = true;
							displayedDays[index].privateBooking = b.type === 1;
						}
					});
				}
			});

			console.log(displayedDays);

			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	let bookingsCurrentAdjacentMonth: BookingDto[];
	onMount(async () => {
		await fetchAndPrepareCalender();
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
	{#if displayedDays.length > 0}
		{#each displayedDays as day, i}
			{#if day.beforeFirstIndex}
				<div class="text-center text-sm p-1 border-gray-500 border text-gray-500 ">
					{i - firstDayIndex + numberOfDaysPreviousMonth + 1}
				</div>
			{:else if day.afterLastIndex}
				<div class="text-center text-sm p-1 border-gray-500 border text-gray-500">
					{i - firstDayIndex - numberOfDays + 1}
				</div>
			{:else}
				<div
					class:font-extrabold={day.currentDay && monthIndex === today.month}
					class:bg-green-300={day.isBooked}
					class="text-center text-md p-1 border-sky-900 border"
					data-dateID={`${month}_${i - firstDayIndex + 1}_${year}`}
				>
					{i - firstDayIndex + 1}
				</div>
			{/if}
		{/each}
	{/if}
</section>
