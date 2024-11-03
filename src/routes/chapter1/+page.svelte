<script lang="ts">
	import { onMount } from 'svelte';
	import { createScene, createCamera, createRenderer, createCube } from '$lib/threeHelpers';
	import * as THREE from 'three';

	let threeContainer: HTMLElement | null = null;

	onMount(() => {
		const scene = createScene();
		const camera = createCamera();
		const renderer = createRenderer();

		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}

		const cube = createCube(scene);

		function animate() {
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			renderer.render(scene, camera);
		}

		renderer.setAnimationLoop(animate);

		const onResize = () => {
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

<div class="h-screen w-screen bg-black" id="three" bind:this={threeContainer}></div>
