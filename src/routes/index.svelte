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

	const sendShip = async () => {
		await tick();
		const tl = gsap.timeline({ onComplete: next });
		const duration = 12;
		if (browser && window.innerWidth < 735) {
			tl.fromTo(
				'.ship',
				{ duration, yPercent: 100 },
				{ duration, yPercent: -100 }
			);
		} else {
			tl.fromTo(
				'.ship',
				{ duration, yPercent: 100, xPercent: 50 },
				{ duration, yPercent: -100, xPercent: 50 }
			);
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
			incomingShipsAmount = null;
			console.log('count is saved counter now!');
			count = savedCounter;
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

<div class="text-white">
	<div class="flex w-full justify-between p-5">
		<h1 class="font-bold text-3xl text-white uppercase">#pvb</h1>
		<img src="/bd.png" alt="" />
	</div>
	{#if $openModal}
		<div out:fade class="max-w-3xl mx-auto">
			<Modal on:sendShip={animHandler} />
		</div>
	{:else if ship}
		<div class="text-white h-screen ship">
			<div class="flex space-x-8">
				<div class="relative">
					<img in:fade class="w-40 h-40 object-cover" src={ship.ship || '/ships/ship1/1.png'} alt="" />
					{#if ship.img}
						<img
							in:fade={{ duration: 500 }}
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
		</div>
	{:else}
		<div class="ship" />
	{/if}
</div>
