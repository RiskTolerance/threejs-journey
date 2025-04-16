<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as T from 'three';
	import { DRACOLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
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
		// Setup - Loaders, Scene, Camera, Renderer, Initial Container Size
		containerHeight = threeContainer.offsetHeight;
		containerWidth = threeContainer.offsetWidth;

		const renderer = new T.WebGLRenderer();
		renderer.setSize(containerWidth, containerHeight);
		const scene = new T.Scene();
		const camera = new T.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
		camera.position.set(0, 2, 5);

		threeContainer.appendChild(renderer.domElement);

		const gltfLoader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/src/lib/assets/draco/');
		gltfLoader.setDRACOLoader(dracoLoader);

		new OrbitControls(camera, renderer.domElement);

		// Geometries, Materials, Meshes, Helpers, Lights

		const axisHelper = new T.AxesHelper(2);
		scene.add(axisHelper);

		const geometry = new T.BoxGeometry();
		const material = new T.MeshStandardMaterial({ color: '#ffffff' });
		const cube = new T.Mesh(geometry, material);
		scene.add(cube);

		const ambientLight = new T.AmbientLight(0xffffff, 1);
		scene.add(ambientLight);

		const pointLight = new T.PointLight(0xffffff, 40);
		pointLight.position.set(3, 3, 0);
		scene.add(pointLight);

		// Animation Loop
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

		// Events
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
	<div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full p-8">
		<button class="pointer-events-auto" onclick={() => fullscreen(threeContainer)}>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
	</div>
</div>
