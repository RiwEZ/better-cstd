<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let cid = form?.cid ?? '';
</script>

<div class="flex justify-center mt-4">
	<form method="POST" class="flex flex-col">
		<div class="flex flex-col gap-1.5">
			<Label for="cid">Thai Citizen Card ID</Label>
			<Input type="number" id="cid" name="cid" bind:value={cid} class="border border-black" />

			{#if form?.incorrect}
				<p class="text-sm text-red-600">Invalid input</p>
			{/if}
			{#if form?.registerFailed}
				<p class="text-sm text-red-600">Register as guest have failed</p>
			{/if}
		</div>
		<Button type="submit" size="sm" class="mt-2">Submit</Button>
	</form>
</div>
