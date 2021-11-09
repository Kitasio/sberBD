<script>
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	const dispatch = createEventDispatcher()

	let items = [
		'Аппарат ПБ',
		'Самарское ГОСБ',
		'Саратовское ГОСБ',
		'Волгоградское ГОСБ',
		'Астраханское ГОСБ',
		'Ульяновское ГОСБ',
		'Пензенское ГОСБ',
		'Оренбургское ГОСБ',
		'ПЦП и УРМ ЦА'
	];
	let toggled = false;
	let selectedUnit
	const select = (item) => {
		selectedUnit = item;
		dispatch('unitChange', item)
		toggled = false;
	};
</script>

<div class="relative">
	<div
		on:click={() => (toggled = !toggled)}
		class={selectedUnit
			? 'flex cursor-pointer justify-between py-2 px-3 rounded-md border border-green text-white'
			: 'flex cursor-pointer justify-between py-2 px-3 rounded-md border border-white text-gray-400 border-opacity-70'}
	>
		<h1 class="text-sm">{selectedUnit || 'Выберите подразделение'}</h1>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	</div>

	{#if toggled}
		<div
			transition:slide={{ duration: 200 }}
			class="flex mt-2 absolute w-full bg-black z-10 py-2 px-3 rounded-md border border-white text-gray-400 border-opacity-70"
		>
			<div class="space-y-1 text-sm">
				{#each items as item, index (index)}
					<p class="cursor-pointer" on:click={() => select(item)}>{item}</p>
				{/each}
			</div>
		</div>
	{/if}
</div>
