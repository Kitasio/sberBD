<script>
	import { gsap } from 'gsap';
	import Modal from '$lib/components/Modal.svelte';
	import { openModal, updatedShipsCount } from '$lib/functions/utils';
	import { fade } from 'svelte/transition';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/env';
	import {
		collection,
		query,
		orderBy,
		getDocs,
		onSnapshot,
		getFirestore
	} from '@firebase/firestore';
	import { getApp, getApps, initializeApp } from '@firebase/app';
	import ShipCounter from '$lib/components/ShipCounter.svelte';
	import { firebaseConfig } from '$lib/firebaseConfig';
	import Qr from '$lib/components/Qr.svelte';
	import Image from '$lib/components/Image.svelte';

	const firebaseApp =
		browser && (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());
	const db = browser && getFirestore();

	let newShips = []
	let ships = [];
	let count = 0;
	let savedCounter = 0;
	let incomingShipsAmount = 0;
	$: ship = ships[count] || '';

	// onMount(async () => {
	// 	let shipsRef = collection(db, 'ships');
	// 	const q = query(shipsRef, orderBy('createdAt', 'desc'));
	// 	const unsubscribe = onSnapshot(q, (querySnapshot) => {
	// 		let len = 0;
	// 		newShips = []
	// 		querySnapshot.forEach((doc) => {
	// 			let data = { ...doc.data(), id: doc.id };
	// 			newShips = [...newShips, data]
	// 			len++;
	// 		});
	// 		$updatedShipsCount = len;
	// 	});
	// });
	onMount(async () => {
		let shipsRef = collection(db, 'ships');
		const q = query(shipsRef, orderBy('createdAt', 'desc'));
		const qSnapshot = await getDocs(q);
		ships = [];
		qSnapshot.forEach((doc) => {
			let data = { ...doc.data(), id: doc.id };
			ships = [...ships, data];
		});
		ship = ships[count];	
		sendShip()
	})

	// const getShips = async () => {
	// 	let shipsRef = collection(db, 'ships');
	// 	const q = query(shipsRef, orderBy('createdAt', 'desc'));
	// 	const qSnapshot = await getDocs(q);
	// 	ships = [];
	// 	qSnapshot.forEach((doc) => {
	// 		let data = { ...doc.data(), id: doc.id };
	// 		ships = [...ships, data];
	// 	});
	// 	ship = ships[count];
	// };
	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	const sendShip = async () => {
		await tick();
		const tl = gsap.timeline({ onComplete: next });
		const duration = 7;
		const randomNum = getRndInteger(20, 60);
		const randomMedium = getRndInteger(10, 40);
		if (browser && window.innerWidth < 735) {
			tl.set('.ship', { xPercent: 5, yPercent: 20, opacity: 0.7 });
			tl.to('.ship', { duration, yPercent: -140, ease: 'none', opacity: 1, delay: 0.5 });
			tl.set('.ship', { opacity: 0 });
		} else if (browser && window.innerWidth < 1024) {
			tl.set('.ship', { xPercent: randomMedium, yPercent: 100, opacity: 0.7 });
			tl.to('.ship', { duration, yPercent: -40, ease: 'none', opacity: 1, delay: 0.5 });
			tl.set('.ship', { opacity: 0 });
		} else {
			tl.set('.ship', { xPercent: randomNum, yPercent: 100, opacity: 0.7 });
			tl.to('.ship', { duration, yPercent: -40, ease: 'none', opacity: 1, delay: 0.5 });
			tl.set('.ship', { opacity: 0 });
		}
	};

	const next = async () => {
		// Check for incoming ships
		// if (ships.length < $updatedShipsCount) {
		// 	incomingShipsAmount = $updatedShipsCount - ships.length;
		// 	savedCounter = count;
		// 	ships = newShips
		// 	// await getShips();

		// 	count = -1;
		// 	ship = ships[count];
		// } else if (count === incomingShipsAmount - 1) {
		// 	// Resuming where stopped
		// 	count = savedCounter + incomingShipsAmount;
		// 	incomingShipsAmount = null;
		// }
		count++;
		if (count < ships.length) {
			sendShip();
		} else {
			animHandler();
		}
	};

	const animHandler = async () => {
		// if (ships.length != $updatedShipsCount) {
		// 	await getShips();
		// }
		count = 0;
		sendShip();
	};
</script>

<div class="text-white overflow-hidden">
	<!-- <div>updatedShipsCount {updatedShipsCount}</div>
	<div>ships.length {ships.length}</div>
	<div>incomingShipsAmount {incomingShipsAmount}</div>
	<div>count {count}</div>
	<div>savedCounter {savedCounter}</div> -->

	<div class={$openModal ? 'flex flex-col' : 'h-screen flex flex-col justify-between md:h-0'}>
		<div class="flex w-full justify-between p-5 z-50">
			<h1 class="font-bold text-4xl md:text-5xl tracking-wide text-white uppercase z-50">#pvb</h1>
			<img class="w-20 md:w-28" src="/bd.png" alt="" />
		</div>
		<div class={$openModal ? 'hidden' : 'md:hidden mb-5 mx-5 z-50'}>
			<ShipCounter />
		</div>
	</div>
	{#if $openModal}
		<div class="md:h-screen md:flex md:items-center md:justify-center md:-mt-32">
			<div out:fade class="max-w-3xl">
				<Modal on:sendShip={animHandler} />
			</div>
		</div>
	{:else if ship}
		<div class="text-white h-screen ship">
			<div class="flex space-x-8">
				<div>
					<div class="relative">
						<Image
							src={ship.ship || '/ships/ship1/1.png'}
							alt={ship.name}
							classes={'h-28 w-28 min-w-full md:w-48 md:h-48 object-cover'}
						/>
						<img class="absolute w-8 left-10 md:w-16 md:left-16" src="/fire.gif" alt="" />
						{#if ship.img}
							<Image
								src={ship.img}
								alt={ship.name}
								classes={'h-8 w-8 bottom-8  left-10 md:w-14 md:h-14 rounded-full object-cover absolute md:bottom-12 md:left-16 md:ml-1'}
							/>
						{:else}
							<span />
						{/if}
					</div>
				</div>

				<div class="w-48 md:w-full max-w-sm">
					<h1 class="text-lg md:text-2xl font-medium">{ship.msg}</h1>
					<p class="mt-5 md:text-lg italic">{ship.name}</p>
					<p class="opacity-80 md:text-base">{ship.unit}</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="ship" />
	{/if}
	<div class="md:absolute md:flex md:justify-between my-5 px-5 md:px-6 w-full bottom-5">
		<ShipCounter />
		<Qr />
	</div>

	<!-- <div class="absolute bottom-4 md:hidden"><ShipCounter /></div> -->
</div>
