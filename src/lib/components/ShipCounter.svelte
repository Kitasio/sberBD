<script>
	import { updatedShipsCount } from '$lib/functions/utils';
    import { fly } from 'svelte/transition';
</script>

<div class="text-white">
	{#key $updatedShipsCount}
		<div class="flex md:flex-col">
			<div class="text-2xl uppercase font-bold">ракет запущено</div>
			<div in:fly="{{ y: 20, duration: 500}}" class="font-bold tracking-widest text-2xl md:text-5xl">{$updatedShipsCount}</div>
		</div>
	{/key}
</div>
