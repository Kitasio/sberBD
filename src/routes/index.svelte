<script>
	import { gsap } from 'gsap';
	import Modal from '$lib/components/Modal.svelte';
	import { openModal } from '$lib/functions/utils';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { browser } from '$app/env';
	import { collection, query, orderBy, getDocs, getFirestore, limit, startAt } from '@firebase/firestore';
	import { getApp, getApps, initializeApp } from '@firebase/app';
	import { firebaseConfig } from '$lib/firebaseConfig';

	const firebaseApp = browser && (getApps().length === 0 ? initializeApp(firebaseConfig): getApp())
	const db = browser && getFirestore()


	let ships = [];
	const getShips = async () => {
		let shipsRef = collection(db, 'ships');
		const q = query(shipsRef, orderBy('createdAt', 'desc'), limit(3))
		const qSnapshot = await getDocs(q)
		qSnapshot.forEach(doc => {
			let data = { ...doc.data(), id: doc.id };
			ships = [...ships, data];
		})
	};
	const sendShips = async () => {
        await tick()
		const tl = gsap.timeline();
		const duration = 10;
		tl.fromTo('.ship', { duration, yPercent: 140 }, {duration, yPercent: -140});
	}
</script>

<div class="">
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
