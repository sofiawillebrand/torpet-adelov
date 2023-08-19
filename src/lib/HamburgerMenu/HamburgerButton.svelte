<script lang="ts">
	export let isOpen = true;
	const handleButtonClick = () => {
		isOpen = !isOpen;
	};
</script>

<button class="space-y-2 z-20" on:click={handleButtonClick}>
	<div
		class:rotate-45={isOpen}
		class:translate-y-2={isOpen}
		class="w-8 h-0.5 bg-sky-800 transform transition-all"
	/>
	<div class:opacity-0={isOpen} class="w-8 h-0.5 bg-sky-800 transform transition-all" />
	<div
		class:-rotate-45={isOpen}
		class:-translate-y-3={isOpen}
		class="w-8 h-0.5 bg-sky-800 transform transition-all"
	/>
</button>
