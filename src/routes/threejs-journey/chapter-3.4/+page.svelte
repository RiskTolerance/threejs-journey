<script lang="ts">
	import { onMount } from 'svelte';
	import * as T from 'three';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';

	let threeContainer: HTMLDivElement;

	let containerHeight: number = $state(0);
	let containerWidth: number = $state(0);

	const fullscreen = (container: HTMLDivElement) => {
		if (container && !document.fullscreenElement) {
			container.requestFullscreen().then(() => {
				containerHeight = container.offsetHeight;
				containerWidth = container.offsetWidth;
			});
		} else if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			console.log('No element!');
		}
	};

	onMount(() => {
		containerHeight = threeContainer.offsetHeight;
		containerWidth = threeContainer.offsetWidth;

		const renderer = new T.WebGLRenderer();
		renderer.setSize(containerWidth, containerHeight);

		const scene = new T.Scene();
		const camera = new T.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
		threeContainer.appendChild(renderer.domElement);

		const geometry = new T.BoxGeometry();
		const material = new T.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new T.Mesh(geometry, material);
		scene.add(cube);

		camera.position.set(0, 2, 5);

		new OrbitControls(camera, renderer.domElement);

		const Clock = new T.Clock();
		let prevTime = 0;
		const animate = function () {
			const elapsedTime = Clock.getElapsedTime();
			const deltaTime = elapsedTime - prevTime;
			prevTime = elapsedTime;

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			cube.rotation.z += 0.01;

			renderer.render(scene, camera);
		};

		renderer.setAnimationLoop(animate);

		window.addEventListener('resize', () => {
			if (!threeContainer) return;
			containerHeight = threeContainer.offsetHeight;
			containerWidth = threeContainer.offsetWidth;
			camera.aspect = containerWidth / containerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(containerWidth, containerHeight);
		});
	});
</script>

<div
	class="relative flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip [&>canvas]:h-[calc(100vh-56px)]"
	bind:this={threeContainer}
>
	<div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full p-8 text-[#cc3]">
		<button class="pointer-events-auto" onclick={() => fullscreen(threeContainer)}>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
	</div>
</div>
