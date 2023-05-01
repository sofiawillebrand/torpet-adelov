<script lang="ts">
	import CalenderForm from './CalenderForm.svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/db';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { BookingDto, ContentOfDate } from '../DataDto';
	import { bookingStore } from '../../booking-store';
	import Account from '$lib/Account.svelte';

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
	let selectedDate: string = date.toISOString().split('T')[0];

	$: month = monthNames[monthIndex];
	$: firstDayIndex = new Date(year, monthIndex, 1 - 1).getDay();
	$: numberOfDays = new Date(year, monthIndex + 1, 0).getDate();
	$: numberOfDaysPreviousMonth = new Date(year, monthIndex, 0).getDate();
	$: calendarCellsQty = firstDayIndex <= 4 ? 35 : 42;

	const openDate = (day: ContentOfDate) => {
		let selectedYear = year;
		let selectedMonth = monthIndex;
		if (day.beforeFirstIndex) {
			if (monthIndex - 1 === -1) {
				selectedYear -= 1;
				selectedMonth = 11;
			} else {
				selectedMonth -= 1;
			}
			const dayOfMonth = day.id - firstDayIndex + numberOfDaysPreviousMonth + 1;
			selectedDate = new Date(selectedYear, selectedMonth, dayOfMonth, 3)
				.toISOString()
				.split('T')[0];
		} else if (day.afterLastIndex) {
			if (monthIndex + 1 === 12) {
				selectedYear += 1;
				selectedMonth = 1;
			} else {
				selectedMonth += 1;
			}
			const dayOfMonth = day.id - firstDayIndex - numberOfDays + 1;
			selectedDate = new Date(selectedYear, selectedMonth, dayOfMonth, 3)
				.toISOString()
				.split('T')[0];
		} else {
			day.id;
			const dayOfMonth = day.id - firstDayIndex + 1;
			selectedDate = new Date(selectedYear, selectedMonth, dayOfMonth, 3)
				.toISOString()
				.split('T')[0];
		}
		bookingStore.update((booking) => ({
			...booking,
			startdate: selectedDate,
			enddate: selectedDate
		}));
		showModal = true;
	};

	const updateMonth = (step: number) => {
		fetchAndPrepareCalender();
		monthIndex = monthIndex + step;

		if (monthIndex === 12) {
			monthIndex = 0;
			year = year + 1;
		} else if (monthIndex === -1) {
			monthIndex = 11;
			year = year - 1;
		}
	};

	const fetchAndPrepareCalender = async () => {
		try {
			loading = true;
			const { data, error, status } = await supabaseClient.from('bokningar').select('*');

			if (data) {
				bookingsCurrentAdjacentMonth = data.filter((d) => {
					let fromMonth = parseInt(d.from_date.split('-')[1]);
					let toMonth = parseInt(d.to_date.split('-')[1]);

					if (fromMonth === monthIndex + 2 || toMonth === monthIndex + 2) return true;
					else if (fromMonth === monthIndex || toMonth === monthIndex) return true;
					else if (fromMonth === monthIndex + 1 || toMonth === monthIndex + 1) return true;
				});
			}

			displayedDays = Array.from({ length: calendarCellsQty }, (x, i) => ({
				id: i,
				currentDay:
					i === today.dayNumber + (firstDayIndex - 1) &&
					i >= firstDayIndex &&
					i < numberOfDays + firstDayIndex,
				beforeFirstIndex: i < firstDayIndex,
				afterLastIndex: i >= numberOfDays + firstDayIndex,
				isBooked: false,
				nrOfBookings: 0,
				privateBooking: false
			}));

			bookingsCurrentAdjacentMonth.forEach((b) => {
				const startDay = parseInt(b.from_date.split('-')[2]);
				const endDay = parseInt(b.to_date.split('-')[2]);
				const startDayMonth = parseInt(b.from_date.split('-')[1]);
				const endDayMonth = parseInt(b.to_date.split('-')[1]);
				const startDayYear = parseInt(b.from_date.split('-')[0]);
				const endDayYear = parseInt(b.to_date.split('-')[0]);
				const fromDate = new Date(b.from_date);

				if (startDayMonth !== monthIndex + 1 && endDayMonth !== monthIndex + 1) return;
				if (startDayYear !== year && endDayYear !== year) return;
				else {
					let fromDateAsDate = new Date(b.from_date).valueOf();
					let toDateAsDate = new Date(b.to_date).valueOf();
					//
					const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
					let lengthOfBooking = Math.round(Math.abs((fromDateAsDate - toDateAsDate) / oneDay));
					const lastDayOfPreviousMonth = new Date(
						fromDate.getFullYear(),
						fromDate.getMonth() + 1,
						0
					).getDate();

					// booking start before month that is viewed
					let daysInPreviousMonth: number = 0;
					let isOvelappingPreviousMonth = false;
					if (startDayMonth < monthIndex + 1) {
						const firstDayBooked = new Date(b.from_date).getDate();

						if (lastDayOfPreviousMonth - endDay !== lengthOfBooking) {
							isOvelappingPreviousMonth = true;
							daysInPreviousMonth = lastDayOfPreviousMonth - firstDayBooked + 1;
						}
					}

					// booking end after month that is viewed
					let daysInNextMonth: number = 0;
					let isOvelappingNextMonth = false;
					if (endDayMonth > monthIndex + 1) {
						const endDate = new Date(b.to_date);
						const lastDayOfNextMonth = new Date(
							endDate.getFullYear(),
							endDate.getMonth() + 1,
							0
						).getDate();

						if (lastDayOfNextMonth - startDay !== lengthOfBooking) {
							isOvelappingNextMonth = true;
							daysInNextMonth = lastDayOfNextMonth - startDay;
						}
					}

					let daysInCurrentMonth: number[] = [];
					let lastDayBookedInCurrentMonth = endDay;
					let firstDayBookedInCurrentMonth = startDay;
					let dayToUseForCurrentMonthStart = startDay;

					if (isOvelappingNextMonth && isOvelappingPreviousMonth) {
						firstDayBookedInCurrentMonth = 1;
						lastDayBookedInCurrentMonth = new Date(
							date.getFullYear(),
							date.getMonth() + 1,
							0
						).getDate();
					} else if (isOvelappingNextMonth) {
						firstDayBookedInCurrentMonth = new Date(
							date.getFullYear(),
							date.getMonth(),
							1
						).getDate();
					} else if (isOvelappingPreviousMonth) {
						firstDayBookedInCurrentMonth = 1;
						dayToUseForCurrentMonthStart = 1;
					}

					daysInCurrentMonth = Array.from(
						{ length: lastDayBookedInCurrentMonth - firstDayBookedInCurrentMonth + 1 },
						(x, i) => i + dayToUseForCurrentMonthStart + firstDayIndex
					);

					let daysInPreviousBooked: number[] = [];
					if (daysInPreviousMonth > 0) {
						daysInPreviousBooked = Array.from(
							{ length: daysInPreviousMonth },
							(x, i) => firstDayIndex - i
						);
					}

					let daysInNextBooked: number[] = [];
					if (daysInNextMonth > 0) {
						daysInNextBooked = Array.from(
							{ length: daysInNextMonth },
							(x, i) => i + startDay + firstDayIndex + daysInNextMonth
						);
					}

					const daysBooked = daysInPreviousBooked
						.concat(daysInCurrentMonth)
						.concat(daysInNextBooked);

					daysBooked.forEach((element) => {
						const index = displayedDays.findIndex((dd) => dd.id === element - 1);
						if (index != null) {
							displayedDays[index].isBooked = true;
							displayedDays[index].nrOfBookings = displayedDays[index].nrOfBookings + 1;
							displayedDays[index].privateBooking = b.type === 1;
						}
					});
				}
			});

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

<!-- TODO: Display other bookings on page if dates overlap with other -->

{#if showModal}
	<CalenderForm bind:showModal />
{/if}

<div class=" md:px-8 pt-6 pb-8 mb-4 bg-white rounded">
	<p>
		Kostnaden är 100 kr per natt och familj. Om man är student/arbetslös behöver man inte betala
		något.
	</p>
	<button
		class="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded mb-6"
		on:click={() => (showModal = true)}>Lägg till en bokning</button
	>

	<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Färgkodning</h2>
	<div class="flex">
		<div class="bg-teal-300 p-1 w-max my-2">Öppen bokning</div>
		<div class="bg-fuchsia-300 p-1 w-max my-2">Privat bokning</div>
	</div>

	<section class=" w-full bg-sky-900 text-center rounded-t">
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
					<button
						class:bg-teal-300={day.isBooked && !day.privateBooking}
						class:bg-fuchsia-300={day.isBooked && day.privateBooking}
						class="text-center text-sm p-1 border-gray-500 border text-gray-500 relative"
						on:click={() => openDate(day)}
					>
						{i - firstDayIndex + numberOfDaysPreviousMonth + 1}
						{#if day.nrOfBookings > 0}
							<span class="absolute bottom-0 right-1 text-xs font-semibold">
								{day.nrOfBookings}</span
							>
						{/if}
					</button>
				{:else if day.afterLastIndex}
					<button
						class:bg-teal-300={day.isBooked && !day.privateBooking}
						class:bg-fuchsia-300={day.isBooked && day.privateBooking}
						class="text-center text-sm p-1 border-gray-500 border text-gray-500 relative"
						on:click={() => openDate(day)}
					>
						{i - firstDayIndex - numberOfDays + 1}
						{#if day.nrOfBookings > 0}
							<span class="absolute bottom-0 right-1 text-xs font-semibold">
								{day.nrOfBookings}</span
							>
						{/if}
					</button>
				{:else}
					<button
						class:font-extrabold={day.currentDay && monthIndex === today.month}
						class:bg-teal-300={day.isBooked && !day.privateBooking}
						class:bg-fuchsia-300={day.isBooked && day.privateBooking}
						class="text-center text-md p-1 border-sky-900 border relative"
						data-dateID={`${month}_${i - firstDayIndex + 1}_${year}`}
						on:click={() => openDate(day)}
					>
						{i - firstDayIndex + 1}
						{#if day.nrOfBookings > 0}
							<span class="absolute bottom-0 right-1 text-xs font-semibold">
								{day.nrOfBookings}</span
							>
						{/if}
					</button>
				{/if}
			{/each}
		{/if}
	</section>
</div>
