<script>
	import { gsap } from 'gsap';
	import Modal from '$lib/components/Modal.svelte';
	import { openModal } from '$lib/functions/utils';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { db } from '$lib/functions/firebase';

	let ships = [];
	const sendShips = async () => {
		let shipsRef = db.collection('ships');
		let allShips = await shipsRef.orderBy('createdAt', 'desc').get();
		for (const doc of allShips.docs) {
			let data = { ...doc.data(), id: doc.id };
			ships = [...ships, data];
		}
		console.log(ships);
        await tick()
		const tl = gsap.timeline();
		const duration = 10;
		tl.fromTo('.ship', { duration, yPercent: 100 }, {duration, yPercent: -100});
	};
</script>

<div class="overflow-hidden">
	<div class="flex w-full justify-between p-5">
		<h1 class="font-bold text-3xl text-white uppercase">#pvb</h1>
		<img src="/bd.png" alt="" />
	</div>
	{#if $openModal}
		<div out:fade class="max-w-3xl mx-auto">
			<Modal on:sendShip={sendShips} />
		</div>
	{:else}
		<div class="text-white ship">
			{#each ships as ship}
				<div class="flex space-x-8">
					<div class="relative">
						<img class="w-40 h-40 object-cover" src={ship.ship} alt="" />
						{#if ship.img}
							<img
								class="w-12 h-12 rounded-full object-cover absolute bottom-10 left-14"
								src={ship.img}
								alt=""
							/>
						{/if}
					</div>

					<div class="max-w-sm">
						<h1 class="text-xl font-medium">{ship.msg}</h1>
						<p class="mt-5 text-lg italic">{ship.name}</p>
						<p class="opacity-80">{ship.unit}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
