<script>
	import { gsap } from 'gsap';
	import Modal from '$lib/components/Modal.svelte';
	import { openModal } from '$lib/functions/utils';
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
	import { firebaseConfig } from '$lib/firebaseConfig';

	const firebaseApp =
		browser && (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());
	const db = browser && getFirestore();

	let ships = [];
	let updatedShipsCount = 0;
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
			updatedShipsCount = len;
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
		const duration = 8;
		const randomNum = getRndInteger(20, 60);
		if (browser && window.innerWidth < 735) {
			tl.set('.ship', { xPercent: 5, yPercent: 95, opacity: 0.7 });
			tl.to('.ship', { duration, yPercent: -33, ease: 'none', opacity: 1 });
			tl.set('.ship', { opacity: 0 });
		} else {
			tl.set('.ship', { xPercent: randomNum, yPercent: 95, opacity: 0.7 });
			tl.to('.ship', { duration, yPercent: -33, ease: 'none', opacity: 1 });
			tl.set('.ship', { opacity: 0 });
		}
	};

	const next = async () => {
		// Check for incoming ships
		if (ships.length < updatedShipsCount) {
			incomingShipsAmount = updatedShipsCount - ships.length;
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

	<div class="flex w-full justify-between p-5 z-50">
		<h1 class="font-bold text-3xl text-white uppercase z-50">#pvb</h1>
		<img src="/bd.png" alt="" />
	</div>
	{#if $openModal}
		<div out:fade class="max-w-3xl mx-auto">
			<Modal on:sendShip={animHandler} />
		</div>
	{:else if ship}
		<div
			in:fade={{ delay: 1000 }}
			class="lg:flex absolute right-5 h-5/6 flex-col justify-center"
		>
			<div on:click={() => browser && location.reload()} class="hidden md:flex space-x-5 font-bold opacity-80 z-50 items-center">
				<div class="uppercase text-xl cursor-pointer">
					<p>Написать</p>
					<p>поздравление</p>
				</div>
				<img class="w-20 2xl:w-32" src="/qr-code.png" alt="" />
			</div>
		</div>
		<div class="text-white h-screen ship">
			<div class="flex space-x-8">
				<div>
					<div class="relative">
						<img
							in:fade
							class="h-28 w-28 min-w-full md:w-40 md:h-40 object-cover"
							src={ship.ship || '/ships/ship1/1.png'}
							alt=""
						/>
						<img class="absolute w-8 left-10 md:w-16 md:left-12" src="/fire.gif" alt="" />
						{#if ship.img}
							<img
								in:fade={{ duration: 500 }}
								class="h-8 w-8 bottom-8  left-10 md:w-12 md:h-12 rounded-full object-cover absolute md:bottom-10 md:left-14"
								src={ship.img}
								alt=""
							/>
						{/if}
					</div>
				</div>

				<div class="w-48 md:w-full max-w-sm">
					<h1 class="md:text-xl font-medium">{ship.msg}</h1>
					<p class="mt-5 text-sm md:text-lg italic">{ship.name}</p>
					<p class="opacity-80 text-sm md:text-base">{ship.unit}</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="ship" />
	{/if}
</div>
