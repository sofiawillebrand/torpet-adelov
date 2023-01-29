<script>
	import img from '$lib/images/torpet-nelson.jpg';
</script>

<svelte:head>
	<title>Info</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<!-- TODO: Add info about torpet, such as: -->
<!-- - Bokningsinformation -->
<!-- - Generell info om torpet som tex stänga och starta, dasset -->

<div class=" px-8 pt-6 pb-8 mb-4 bg-white rounded">
	<p class="font-medium mb-2">Välkommen till torpets hemsida!</p>
	<p class="mb-1">
		Här har du möjlighet att boka datum då du ska besöka torpet och se diverse information.
	</p>
	<img src={img} alt="Image" class="rounded" />
</div>
