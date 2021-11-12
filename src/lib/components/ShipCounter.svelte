<script>
	import { updatedShipsCount } from '$lib/functions/utils';
    import { fly } from 'svelte/transition';
</script>

<div class="text-white">
	{#key $updatedShipsCount}
		<div class="flex justify-between items-center w-full md:items-start md:flex-col md:space-y-3">
			<div class="text-xl md:text-2xl uppercase font-medium">ракет запущено</div>
			{#if $updatedShipsCount + 2500 === 2500}
				<div in:fly="{{ y: 20, duration: 700}}" class="font-medium tracking-widest text-5xl">0</div>
			{:else}
				<div in:fly="{{ y: 20, duration: 700}}" class="font-medium tracking-widest text-5xl">{$updatedShipsCount + 2500}</div>
			{/if}
		</div>
	{/key}
</div>
