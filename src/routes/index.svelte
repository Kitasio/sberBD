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

	const firebaseApp =
		browser && (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());
	const db = browser && getFirestore();

	let ships = [];
	let count = 0;
	let savedCounter = 0;
	let incomingShipsAmount = 0;
	$: ship = ships[count] || '';

	onMount(async () => {
		let shipsRef = collection(db, 'ships');
		const q = query(shipsRef, orderBy('createdAt', 'desc'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let len = 0;
			querySnapshot.forEach((doc) => {
				len++;
			});
			$updatedShipsCount = len;
		});
	});

	const getShips = async () => {
		let shipsRef = collection(db, 'ships');
		const q = query(shipsRef, orderBy('createdAt', 'desc'));
		const qSnapshot = await getDocs(q);
		ships = [];
		qSnapshot.forEach((doc) => {
			let data = { ...doc.data(), id: doc.id };
			ships = [...ships, data];
		});
		ship = ships[count];
	};
	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	const sendShip = async () => {
		await tick();
		const tl = gsap.timeline({ onComplete: next });
		const duration = 5.6;
		const randomNum = getRndInteger(20, 60);
		if (browser && window.innerWidth < 735) {
			tl.set('.ship', { xPercent: 5, yPercent: 100, opacity: 0.7 });
			tl.to('.ship', { duration, yPercent: -40, ease: 'none', opacity: 1 });
			tl.set('.ship', { opacity: 0 });
		} else {
			tl.set('.ship', { xPercent: randomNum, yPercent: 100, opacity: 0.7 });
			tl.to('.ship', { duration, yPercent: -40, ease: 'none', opacity: 1 });
			tl.set('.ship', { opacity: 0 });
		}
	};

	const next = async () => {
		// Check for incoming ships
		if (ships.length < $updatedShipsCount) {
			incomingShipsAmount = $updatedShipsCount - ships.length;
			savedCounter = count;
			await getShips();

			count = -1;
			ship = ships[count];
		} else if (count === incomingShipsAmount - 1) {
			// Resuming where stopped
			count = savedCounter + incomingShipsAmount;
			incomingShipsAmount = null;
			console.log('count is saved counter now!');
		}
		count++;
		if (count < ships.length) {
			sendShip();
		} else {
			animHandler();
		}
	};

	const animHandler = async () => {
		await getShips();
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

	<div class="flex flex-col">
		<div class="flex w-full justify-between p-5 z-50">
			<h1 class="font-bold text-3xl text-white uppercase z-50">#pvb</h1>
			<img src="/bd.png" alt="" />
		</div>
	</div>
	{#if $openModal}
		<div out:fade class="max-w-3xl mx-auto">
			<Modal on:sendShip={animHandler} />
		</div>
	{:else if ship}
		<div class="text-white h-screen ship">
			<div class="flex space-x-8">
				<div>
					<div class="relative">
						<img
							in:fade
							class="h-28 w-28 min-w-full md:w-48 md:h-48 object-cover"
							src={ship.ship || '/ships/ship1/1.png'}
							alt=""
						/>
						<img class="absolute w-8 left-10 md:w-16 md:left-16" src="/fire.gif" alt="" />
						{#if ship.img}
							<img
								in:fade={{ duration: 500 }}
								class="h-8 w-8 bottom-8  left-10 md:w-14 md:h-14 rounded-full object-cover absolute md:bottom-12 md:left-16 md:ml-1"
								src={ship.img}
								alt=""
							/>
						{/if}
					</div>
				</div>

				<div class="w-48 md:w-full max-w-sm">
					<h1 class="md:text-2xl font-medium">{ship.msg}</h1>
					<p class="mt-5 text-sm md:text-lg italic">{ship.name}</p>
					<p class="opacity-80 text-sm md:text-base">{ship.unit}</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="ship" />
	{/if}
	<div class="md:absolute md:flex md:justify-between my-5 px-5 md:px-10 w-full bottom-5">
		<ShipCounter />
		<Qr />
	</div>
</div>
