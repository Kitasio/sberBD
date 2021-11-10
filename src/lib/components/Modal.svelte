<script>
	import Counter from './Counter.svelte';
	import Dropdown from './Dropdown.svelte';
	import PickShip from './PickShip.svelte';
	import { createEventDispatcher } from 'svelte';
	import { imgPath, openModal } from '$lib/functions/utils'
	import { getApp, getApps, initializeApp } from '@firebase/app';
	import { browser } from '$app/env';
	import { firebaseConfig } from '$lib/firebaseConfig';
	import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
	import { getFirestore, collection, doc, setDoc, serverTimestamp } from '@firebase/firestore';

	const firebaseApp = browser && (getApps().length === 0 ? initializeApp(firebaseConfig): getApp())
	const db = browser && getFirestore()
	const ts = browser && serverTimestamp()
	const storage = browser && getStorage()

	const upload = async (file, filename) => {
  		const storageRef = browser && ref(storage, 'public/' + filename);
		await uploadBytes(storageRef, file).then((snapshot) => {
			console.log('Uploaded a blob or file!');
		});
		await getDownloadURL(ref(storage, 'public/' + filename)).then(url => {
			$imgPath = url
			shipInfo.img = $imgPath
		})
	}
	export const saveToDB = async (col, item) => {
		const newShipRef = doc(collection(db, col))
		await setDoc(newShipRef, item)
	}

	const dispatch = createEventDispatcher();
	const close = () => {
		dispatch('sendShip')
		$openModal = false
	}
	const saveAndClose = (coll, item) => {
		saveToDB(coll, item)
		dispatch('sendShip')
		$openModal = false
	}

	const unitChange = (e) => {
		shipInfo.unit = e.detail
	}
	const shipChange = (e) => {
		shipInfo.ship = e.detail
	}

	let shipInfo = {
		name: '',
		msg: '',
		unit: '',
		img: $imgPath,
		ship: '',
		createdAt: ts,
	};

	$: postOk = shipInfo.name !== '' && shipInfo.msg !== '' && shipInfo.unit !== '';

	const handleChange = async (e) => {
		// selected file
		const file = e.target.files[0];
		console.log(URL.createObjectURL(file))
		shipInfo.img = URL.createObjectURL(file)
		if (file) {
			await upload(file, file.name);
		}
	};
</script>

<div class="p-0.5 m-5 mb-0 rounded-lg bg-gradient-to-br from-green to-yellow">
	<div class="text-white pb-5 p-5 bg-black rounded-lg">
		<div class="flex w-full justify-end">
			<img on:click={close} class="cursor-pointer" src="/x.svg" alt="" />
		</div>
		<div>
			<h1 class="mb-5 font-bold text-xl md:text-3xl">Сбер празднует 180 лет!</h1>
			<div class="text-xs md:text-base leading-relaxed">
				<p>Друзья! Сегодня у нас космический юбилей.</p>
				<p>
					Поздравь команду с праздником и запусти свою ракету в <span class="font-bold italic"
						>СберВселенную!</span
					>
				</p>
			</div>
		</div>

		<div class="md:flex md:mt-10 w-full">
			<div class="w-full">
				<div class="mt-10 md:mt-0">
					<div class="flex items-center space-x-3">
						<div>
							{#if $imgPath || shipInfo.img}
								<div class="w-16 h-16">
									<label for="image">
										<img
											class="cursor-pointer inline-block h-16 w-16 rounded-full object-cover"
											src={$imgPath || shipInfo.img}
											alt=""
										/>
									</label>
									<input class="hidden" on:change={(e) => handleChange(e)} type="file" id="image" />
								</div>
							{:else}
								<div>
									<label for="image" class="w-14 h-14">
										<img class="w-full -ml-2 cursor-pointer" src="/pickPic.png" alt="" />
									</label>
									<input class="hidden" on:change={(e) => handleChange(e)} type="file" id="image" />
								</div>
							{/if}
						</div>
						<input
							bind:value={shipInfo.name}
							class={shipInfo.name
								? 'w-full -mt-4 bg-transparent border-0 border-b-2 focus:ring-0 border-green focus:border-green'
								: 'w-full -mt-4 bg-transparent border-0 border-b-2 focus:ring-0 focus:border-green'}
							type="text"
							placeholder="ФИО пилота"
						/>
					</div>
				</div>
				<div class="mt-5">
					<Dropdown on:unitChange={e => unitChange(e)} />
				</div>

				<div class="relative">
					<textarea
						bind:value={shipInfo.msg}
						class={shipInfo.msg
							? 'w-full bg-transparent rounded-md mt-5 border border-green focus:ring-0 focus:border-green'
							: 'w-full bg-transparent rounded-md mt-5 border border-white border-opacity-70 focus:ring-0 focus:border-green'}
						maxlength="100"
						cols="30"
						rows="5"
						placeholder="Напишите послание или поздравление"
					/>
					<div class="absolute right-2 bottom-4">
						<Counter count={shipInfo.msg.length} />
					</div>
				</div>
			</div>

			<div class="w-full">
				<div class="mt-5">
					<PickShip on:shipChange={e => shipChange(e)} />
				</div>
			</div>
		</div>

		<div class="flex justify-center md:justify-start my-10 md:my-7">
			<button
				on:click={() => saveAndClose('ships', shipInfo)}
				disabled={!postOk}
				class={postOk
					? 'uppercase transition-all text-sm duration-700 tracking-wider hover:text-black hover:bg-gradient-to-br hover:from-green hover:to-yellow border border-green rounded-md px-5 py-3'
					: 'uppercase text-gray-400 border rounded-md px-5 py-3 transition-all text-sm duration-700'}
				>Запустить ракету!</button>
		</div>
	</div>
</div>
