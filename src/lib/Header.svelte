<script lang="ts">
	import HamburgerButton from './HamburgerMenu/HamburgerButton.svelte';
	import HamburgerMenu from './HamburgerMenu/HamburgerMenu.svelte';

	export let isOpen = false;
</script>

<nav class="flex items-center justify-between flex-wrap bg-sky-500 p-6 mb-5 rounded-b ">
	<div class="flex items-center flex-shrink-0 text-white mr-6">
		<span class="font-semibold text-xl tracking-tight">Torpet</span>
	</div>
	<HamburgerButton bind:isOpen />
	{#if isOpen}
		<HamburgerMenu bind:isOpen />
	{/if}
</nav>
