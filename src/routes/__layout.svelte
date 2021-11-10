<script>
	import '../app.css';
	import { openModal } from '$lib/functions/utils';
</script>

<div
	style="background-image: url(/bg.gif)"
	class={$openModal
		? 'bg-cover bg-center min-h-screen md:h-screen md:overflow-hidden font-mont'
		: 'bg-cover bg-center h-screen overflow-hidden font-mont'}
>
	<slot />
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,700;1,700&display=swap');
</style>
