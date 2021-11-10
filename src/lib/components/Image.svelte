<script>
	export let src;
	export let alt;
    export let classes;

	import { onMount } from 'svelte';

	let loaded = false;
	let thisImage;

	onMount(() => {
		thisImage.onload = () => {
			loaded = true;
		};
	});
</script>

<img {src} {alt} class:loaded class={classes} bind:this={thisImage} />

<style>
	img {
		opacity: 0;
		transition: opacity 1200ms ease-out;
	}
	img.loaded {
		opacity: 1;
	}
</style>
