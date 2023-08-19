<script lang="ts">
	import { page } from '$app/stores';

	export let isOpen = false;

	$: onRoute = $page.route.id;
</script>

<div class=" fixed bottom-0 right-0 left-0 top-0 bg-sky-500 z-10">
	<div class="flex flex-col mx-auto md:w-2/4">
		<div class="flex items-center flex-shrink-0 text-white p-6">
			<span class="font-semibold text-xl tracking-tight">Torpet</span>
		</div>
		<a
			on:click={() => (isOpen = false)}
			href="/"
			class="mt-4 ml-6 inline-block lg:mt-0 hover:text-white mr-2 
      {onRoute === '/' ? 'font-bold text-white' : 'text-teal-200'}"
		>
			Info
		</a>
		{#if $page.data.session}
			<a
				on:click={() => (isOpen = false)}
				href="/kalender"
				class="mt-4 ml-6 inline-block lg:mt-0 hover:text-white mr-2
      {onRoute === '/kalender' ? 'font-bold text-white' : 'text-teal-200'}"
			>
				Kalender
			</a>
			<a
				on:click={() => (isOpen = false)}
				href="/mina-bokningar"
				class="mt-4 ml-6 inline-block lg:mt-0  hover:text-white mr-2
    {onRoute === '/mina-bokningar' ? 'font-bold text-white' : 'text-teal-200'}"
			>
				Mina bokningar
			</a>
			<a
				on:click={() => (isOpen = false)}
				href="/torstens-levnadsbeskrivning"
				class="mt-4 ml-6 inline-block lg:mt-0  hover:text-white
    {onRoute === '/torstens-levnadsbeskrivning' ? 'font-bold text-white' : 'text-teal-200'}"
			>
				Torstens Levnadsbeskrivning
			</a>
			<a
				on:click={() => (isOpen = false)}
				href="/mina-uppgifter"
				class="mt-4 ml-6 inline-block lg:mt-0  hover:text-white
      {onRoute === '/mina-uppgifter' ? 'font-bold text-white' : 'text-teal-200'}"
			>
				Mina uppgifter
			</a>
		{/if}
	</div>
</div>
