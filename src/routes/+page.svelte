<script lang="ts">
	import dayjs from 'dayjs';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	export let data: PageData;

	const now = dayjs();
</script>

<h1 class="text-center text-xl font-bold mt-2">Benchakiti Park, Table Tennis</h1>
<div class="flex flex-row space-x-4 justify-center mt-2">
	{#each data.tableTennis as day, i}
		<div>
			<h2 class="text-lg font-bold">{now.add(i, 'd').format('YYYY-MM-DD')}</h2>
			{#each day as info}
				<div class="grid grid-rows-3 grid-cols-1">
					<p>{info.start} - {info.end}</p>
					<p>Available: {info.available.length}</p>
					<Button size="sm" disabled={info.available.length === 0}>Reserve</Button>
				</div>
				<Separator class="mt-2" />
			{/each}
		</div>
	{/each}
</div>
