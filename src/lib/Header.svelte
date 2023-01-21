<script lang="ts">
	import { page } from '$app/stores';
	$: onRoute = $page.route.id;
</script>

<nav class="flex items-center justify-between flex-wrap bg-sky-500 p-6 mb-5 rounded-b">
	<div class="flex items-center flex-shrink-0 text-white mr-6">
		<span class="font-semibold text-xl tracking-tight">Torpet</span>
	</div>
	<div class="w-full block flex-grow flex lg:w-auto">
		<div class="text-sm flex-grow">
			<a
				href="/"
				class="mt-4 inline-block lg:mt-0 hover:text-white mr-2 
				{onRoute === '/' ? 'font-bold text-white' : 'text-teal-200'}"
			>
				Info
			</a>
			{#if $page.data.session}
				<a
					href="/kalender"
					class="mt-4 inline-block lg:mt-0 hover:text-white mr-2
				{onRoute === '/kalender' ? 'font-bold text-white' : 'text-teal-200'}"
				>
					Kalender
				</a>
				<a
					href="/mina-bokningar"
					class="mt-4 inline-block lg:mt-0  hover:text-white mr-2
			{onRoute === '/mina-bokningar' ? 'font-bold text-white' : 'text-teal-200'}"
				>
					Mina bokningar
				</a>
				<a
					href="/mina-uppgifter"
					class="mt-4 inline-block lg:mt-0  hover:text-white
				{onRoute === '/mina-uppgifter' ? 'font-bold text-white' : 'text-teal-200'}"
				>
					Mina uppgifter
				</a>
			{/if}
		</div>
	</div>
</nav>
