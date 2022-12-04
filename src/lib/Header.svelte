<script lang="ts">
	import { page } from '$app/stores';
	$: onRoute = $page.route.id;
</script>

<nav class="flex items-center justify-between flex-wrap bg-sky-500 p-6 mb-5 rounded-b">
	<div class="flex items-center flex-shrink-0 text-white mr-6">
		<span class="font-semibold text-xl tracking-tight">Torpet</span>
	</div>
	<div class="block lg:hidden">
		<button
			class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
		>
			<svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
				><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg
			>
		</button>
	</div>
	<div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
		<div class="text-sm lg:flex-grow">
			<a
				href="/info"
				class="block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4 
				{onRoute === '/info' ? 'font-bold text-white' : 'text-teal-200'}"
			>
				Info
			</a>
			<a
				href="/kalender"
				class="block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4
				{onRoute === '/kalender' ? 'font-bold text-white' : 'text-teal-200'}"
			>
				Kalender
			</a>
			<a
				href="#responsive-header"
				class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white
				{onRoute === '/responsive header' ? 'font-bold' : ''}"
			>
				Dina uppgifter
			</a>
		</div>
	</div>
</nav>
