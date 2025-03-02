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
		containerHeight = threeContainer.offsetHeight;
		containerWidth = threeContainer.offsetWidth;
		const gltfLoader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/src/lib/assets/draco/');
		gltfLoader.setDRACOLoader(dracoLoader);
		const renderer = new T.WebGLRenderer();
		renderer.setSize(containerWidth, containerHeight);

		const scene = new T.Scene();
		const camera = new T.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
		threeContainer.appendChild(renderer.domElement);
		const light = new T.AmbientLight(0xffffff, 0.5);
		light.position.set(0, 10, 0);
		scene.add(light);

		const pointLight = new T.PointLight(0xff0000, 20);
		pointLight.position.set(3, 3, 3);
		scene.add(pointLight);
		const pointLight2 = new T.PointLight('#3466ef', 80);
		pointLight2.position.set(-3, -3, 3);
		scene.add(pointLight2);

		let burger: T.Group | null = null;
		gltfLoader.load('/src/lib/assets/models/Burger/burger.glb', (gltf) => {
			burger = gltf.scene;
			scene.add(burger);
		});
		camera.position.set(0, 2, 5);

		new OrbitControls(camera, renderer.domElement);

		const Clock = new T.Clock();
		let prevTime = 0;
		const animate = function () {
			const elapsedTime = Clock.getElapsedTime();
			const deltaTime = elapsedTime - prevTime;
			prevTime = elapsedTime;
			if (burger) {
				burger.rotation.y += 0.01;
			}

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
	<div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full p-8">
		<button class="pointer-events-auto" onclick={() => fullscreen(threeContainer)}>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
	</div>
</div>
