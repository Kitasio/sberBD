<script>
	import gsap from 'gsap';
	import { onMount } from 'svelte';

	let textures
	let main
	// let frag = document.createDocumentFragment();

	let appearMin = 0.3;
	let appearMax = 0.8;

	let delayMin = 2;
	let delayMax = 6;

	let durationMin = 0.3;
	let durationMax = 1;

	let numAnimations = 50;
	let numStars = 300;

	let stars = [];
	let eases = [];

	// for (let i = 0; i < numAnimations; i++) {
	// 	let ease = new RoughEase({
	// 		template: Linear.easeNone,
	// 		strength: random(1, 3),
	// 		points: random(50, 200) | 0,
	// 		taper: 'both',
	// 		randomize: true,
	// 		clamp: true
	// 	});

	// 	eases.push(ease);
	// }

	// Wait for images to load

	onMount(() => {
		for (let i = 0; i < numStars; i++) {
			stars.push(createStar());
		}

		// main.appendChild(frag);
	});

	function createStar() {
		let vw = window.innerWidth;
		let vh = window.innerHeight;

		let index = random(textures.length) | 0;
		let star = textures[index].cloneNode(true);
		// frag.appendChild(star);

		gsap.set(star, {
			rotation: random(360),
			xPercent: -50,
			yPercent: -50,
			scale: 0,
			x: random(vw),
			y: random(vh)
		});

		const tl = gsap.timeline({ repeat: -1, yoyo: true });

		for (let i = 0; i < numAnimations; i++) {
			let ease1 = eases[random(numAnimations) | 0];
			let ease2 = eases[random(numAnimations) | 0];

			let alpha = random(0.7, 1);
			let scale = random(0.15, 0.4);

			let appear = '+=' + random(appearMin, appearMax);
			let delay = '+=' + random(delayMin, delayMax);
			let duration1 = random(durationMin, durationMax);
			let duration2 = random(durationMin, durationMax);

			tl.to(star, { duration1, autoAlpha: alpha, scale: scale, ease: ease1 }, delay).to(
				star,
				{ duration2, autoAlpha: 0, scale: 0, ease: ease2 },
				appear
			);
		}

		tl.progress(random(1));

		return {
			element: star,
			timeline: tl
		};
	}

	function random(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		if (min > max) {
			let tmp = min;
			min = max;
			max = tmp;
		}
		return min + (max - min) * Math.random();
	}
</script>

<main bind:this="{main}" />

<aside style="display:none">
	<div bind:this="{textures}" class="bg-white w-1 h1 star" />
	<div bind:this="{textures}" class="bg-white w-1 h1 star" />
	<div bind:this="{textures}" class="bg-white w-1 h1 star" />
	<div bind:this="{textures}" class="bg-white w-1 h1 star" />
	<div bind:this="{textures}" class="bg-white w-1 h1 star" />
</aside>

<style>
	* {
		box-sizing: border-box;
	}

	main {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #000;
	}

	.star {
		position: absolute;
		visibility: hidden;
		opacity: 0;
	}
</style>
