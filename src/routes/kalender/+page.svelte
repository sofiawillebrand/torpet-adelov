<script lang="ts">
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
		console.log('first day', firstDayIndex);
	};
</script>

<svelte:head>
	<title>Torpet Kalender</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<section class=" px-20 py-6 w-full bg-sky-900 text-center">
	<div class="m-0 p-0">
		<button class="text-white text-xl uppercase float-left pt-3" on:click={() => updateMonth(-1)}
			>&#10094;</button
		>
		<button class="text-white text-xl uppercase float-right pt-3" on:click={() => updateMonth(1)}
			>&#10095;</button
		>
		<p class="text-white">{month}<br /><span style="font-size:18px">{year}</span></p>
	</div>
</section>

<section class="m-0 bg-gray-500 w-full grid grid-cols-7">
	<div class="text-center mb-1 text-xs p-1">Må</div>
	<div class="text-center mb-1 text-xs p-1">Ti</div>
	<div class="text-center mb-1 text-xs p-1">On</div>
	<div class="text-center mb-1 text-xs p-1">To</div>
	<div class="text-center mb-1 text-xs p-1">Fr</div>
	<div class="text-center mb-1 text-xs p-1">Lö</div>
	<div class="text-center mb-1 text-xs p-1">Sö</div>
</section>

<section class="m-0 bg-gray-400 w-full grid grid-cols-7">
	{#each Array(calendarCellsQty) as _, i}
		{#if i < firstDayIndex}
			<div class="text-center text-xs p-1 border-gray-500 border text-gray-500">
				{i - firstDayIndex + numberOfDaysPreviousMonth + 1}
			</div>
		{:else if i >= numberOfDays + firstDayIndex}
			<div class="text-center text-xs p-1 border-gray-500 border text-gray-500">
				{i - firstDayIndex - numberOfDays + 1}
			</div>
		{:else}
			<div
				class:font-extrabold={i === today.dayNumber + (firstDayIndex - 1) &&
					monthIndex === today.month &&
					year === today.year}
				class="text-center text-xs p-1 border-sky-900 border"
				data-dateID={`${month}_${i - firstDayIndex + 1}_${year}`}
			>
				{i - firstDayIndex + 1}
			</div>
		{/if}
	{/each}
</section>
