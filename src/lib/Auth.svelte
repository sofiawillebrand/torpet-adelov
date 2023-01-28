<script lang="ts">
	import { supabaseClient } from '$lib/db';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabaseClient.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('En magic link borde dyka upp i din inkorg inom några minuter!');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<form class=" px-8 pt-6 pb-8 mb-4 rounded bg-white" on:submit|preventDefault={handleLogin}>
	<p class="mb-4">
		Logga in genom att ange din mail nedan. Du kommer sedan att få ett mail till den adress du
		skrivit in, det mailet kommer att innehålla en "magic link" som du ska klicka på. När du klickat
		på länken kommer du att loggas in i en ny flik på samma enhet som du öppnar länken.
	</p>
	<div class="mb-4">
		<input
			type="email"
			placeholder="E-mail"
			bind:value={email}
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
		/>
	</div>
	<div class="mb-4">
		<button
			class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded mb-6"
			value={loading ? 'Loading' : 'Send magic link'}
			disabled={loading}>Logga in</button
		>
	</div>
</form>
