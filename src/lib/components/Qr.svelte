<script>
	import { browser } from '$app/env';
</script>

<div
	on:click={() => browser && location.reload()}
	class="hidden md:flex space-x-5 items-center font-bold opacity-80 z-50 justify-start"
>
	<div class="uppercase text-xl mt-2 cursor-pointer text-left">
		<p>Написать</p>
		<p>поздравление</p>
	</div>
	<img class="w-20 2xl:w-24" src="/qr-code.png" alt="" />
</div>
