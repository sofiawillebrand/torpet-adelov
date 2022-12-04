<script lang="ts">
	const date = new Date();
	const monthNames = [
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
	$: month = monthNames[monthIndex];
</script>

<svelte:head>
	<title>Torpet Kalender</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<section class=" px-20 py-6 w-full bg-sky-900 text-center">
	<div class="m-0 p-0">
		<button class="text-white text-xl uppercase float-left pt-3">&#10094;</button>
		<button class="text-white text-xl uppercase float-right pt-3">&#10095;</button>
		<p class="text-white">Augusti<br /><span style="font-size:18px">2021</span></p>
	</div>
</section>

<section class="m-0 px-3 py-0 bg-gray-500">
	<div class="inline-block w-1/7 text-gray-900 text-center">Mån</div>
	<div class="inline-block w-1/7 text-gray-900 text-center">Tis</div>
	<div class="inline-block w-1/7 text-gray-900 text-center">Ons</div>
	<div class="inline-block w-1/7 text-gray-900 text-center">Tors</div>
	<div class="inline-block w-1/7 text-gray-900 text-center">Fre</div>
	<div class="inline-block w-1/7 text-gray-900 text-center">Lör</div>
	<div class="inline-block w-1/7 text-gray-900 text-center">Sön</div>
</section>

<section class="m-0 px-3 py-0 bg-gray-400">
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">1</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">2</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">3</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">4</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">5</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">6</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">7</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">8</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">9</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">
		<span class="active">10</span>
	</div>
	<div class="list-none inline-block w-1/7 text-center mb-1 text-xs">11</div>
	...etc
</section>
