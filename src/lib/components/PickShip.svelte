<script>
	import { fly } from 'svelte/transition';
	import { imgPath } from '$lib/functions/utils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher()
	let ships = [
		['/ships/ship1/1.png', '/ships/ship1/2.png', '/ships/ship1/3.png', '/ships/ship1/4.png'],
		['/ships/ship2/1.png', '/ships/ship2/2.png', '/ships/ship2/3.png', '/ships/ship2/4.png'],
		['/ships/ship3/1.png', '/ships/ship3/2.png', '/ships/ship3/3.png', '/ships/ship3/4.png'],
		['/ships/ship4/1.png', '/ships/ship4/2.png', '/ships/ship4/3.png', '/ships/ship4/4.png']
	];

	let ship = 0;
	let color = 0;
	$: selectedShip = ships[ship][color];

	$: {
		dispatch('shipChange', selectedShip)
	}

	const nextShip = () => {
		if (ship >= 3) {
			ship = 0;
		} else {
			ship++;
		}
	};
	const prevShip = () => {
		if (ship <= 0) {
			ship = 3;
		} else {
			ship--;
		}
	};
</script>

<div>
	<div class="flex justify-center">
		<h1 class="uppercase text-sm">ваш корабль</h1>
	</div>

	<div class="flex space-x-5 w-full mt-3 justify-center items-center">
		<img class="cursor-pointer" on:click={prevShip} src="/ships/icons/arrow-left.png" alt="" />
		{#key selectedShip}
			<div class="relative">
				<img in:fly class="w-40 h-40 object-cover" src={selectedShip} alt="" />
				{#if $imgPath}
					<img
						class="w-12 h-12 rounded-full object-cover absolute bottom-10 left-14"
						src={$imgPath}
						alt=""
					/>
				{/if}
			</div>
		{/key}
		<img class="cursor-pointer" on:click={nextShip} src="/ships/icons/arrow-right.png" alt="" />
	</div>

	<div class="flex justify-center space-x-5 mt-5">
		<img on:click={() => (color = 0)} class="cursor-pointer" src="/ships/icons/one.png" alt="" />
		<img on:click={() => (color = 1)} class="cursor-pointer" src="/ships/icons/two.png" alt="" />
		<img on:click={() => (color = 2)} class="cursor-pointer" src="/ships/icons/tree.png" alt="" />
		<img on:click={() => (color = 3)} class="cursor-pointer" src="/ships/icons/four.png" alt="" />
	</div>
</div>
