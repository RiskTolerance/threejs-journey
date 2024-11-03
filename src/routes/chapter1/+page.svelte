<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createScene,
		createCamera,
		createRenderer,
		createCube,
		createAxisHelper
	} from '$lib/threeHelpers';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';

	let threeContainer: HTMLElement | null = null;

	const fullscreen = () => {
		if (threeContainer && !document.fullscreenElement) {
			console.log('go fullscreen!');
			threeContainer.requestFullscreen();
		} else if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			console.log('No element!');
		}
	};

	onMount(() => {
		const scene = createScene();
		const camera = createCamera(1, 2, 5);
		const renderer = createRenderer();
		const axisHelper = createAxisHelper(scene);

		const controls = new OrbitControls(camera, threeContainer);
		controls.enableDamping = true;

		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}

		const group = new THREE.Group();
		group.position.set(0, 0, 0);

		const cube1 = createCube(1, 1, 1, 'red');
		const cube2 = createCube(1, 1, 1, 'green');
		const cube3 = createCube(1, 1, 1, 'blue');

		cube2.position.x = 3;
		cube3.position.x = -3;

		group.add(cube1, cube2, cube3);
		scene.add(group);

		gsap.to(group.position, { x: 4, duration: 2, delay: 2 }).then(() => {
			gsap.to(group.position, { x: -4, duration: 2, delay: 2 });
		});

		function animate() {
			// group.rotation.z += 0.01;
			renderer.render(scene, camera);
			controls.update();
		}

		renderer.setAnimationLoop(animate);

		const onResize = () => {
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<div class="relative h-screen w-screen bg-black" id="three" bind:this={threeContainer}>
	<canvas class="pointer-events-none absolute h-0 w-0"></canvas>
	<div class="absolute left-0 top-0 z-10 h-full w-full p-8">
		<button onclick={fullscreen}>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
	</div>
</div>

<style>
	#three > canvas {
		z-index: 0;
		outline: none;
	}
</style>
