<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as T from 'three';
	import { DRACOLoader, GLTFLoader, OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
	import GUI from 'lil-gui';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';
	import { error } from '@sveltejs/kit';

	// loaded state
	import { tState } from '$lib/chapter_files/4.1/state.svelte';
	// fullscreen function (linked to tState in function file)
	import { fullscreen } from '$lib/chapter_files/4.1/fullscreen';
	import { updateAllMaterials } from '$lib/chapter_files/4.1/updateAllMaterials';

	onMount(() => {
		// Loading Manager
		const loadingManager = new T.LoadingManager(
			() => {
				console.log('Loading Complete!');
				tState.loaded = true;
			},
			(url, loaded, total) => {
				console.log(`Loading ${url}: ${loaded} / ${total}`);
			},
			(url) => {
				console.error(`Error loading ${url}`);
			}
		);
		// Setup - Loaders, Scene, Camera, Renderer, Initial Container Size
		tState.height = tState?.container?.offsetHeight;
		tState.width = tState?.container?.offsetWidth;

		const renderer = new T.WebGLRenderer({
			antialias: true
		});
		// tone mapping
		renderer.toneMapping = T.ReinhardToneMapping;
		renderer.toneMappingExposure = 1.5;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = T.PCFSoftShadowMap;

		const scene = new T.Scene();
		tState?.container?.appendChild(renderer.domElement);

		// set the camera's properties based on the dimensions/aspect ratio of the threejs dom element
		let camera: T.PerspectiveCamera | undefined = undefined;
		if (tState.container && tState.width && tState.height) {
			renderer.setSize(tState.width, tState.height);
			camera = new T.PerspectiveCamera(75, tState.width / tState.height, 0.1, 1000);
			camera.position.set(0, 2, 5);
		} else {
			error(404, {
				message: 'Threejs element not found'
			});
		}

		// orbit controls
		if (renderer && scene) {
			new OrbitControls(camera, renderer.domElement);
		}

		// loaders
		const gltfLoader = new GLTFLoader(loadingManager);
		const dracoLoader = new DRACOLoader(loadingManager);
		dracoLoader.setDecoderPath('/src/lib/assets/draco/');
		gltfLoader.setDRACOLoader(dracoLoader);
		const rgbeLoader = new RGBELoader(loadingManager);
		const textureLoader = new T.TextureLoader(loadingManager);

		// Textures

		// Background + Environment Maps

		// Geometries, Materials, Meshes, Helpers, Lights
		const axisHelper = new T.AxesHelper(2);
		scene.add(axisHelper);

		// const lightHelper = new T.CameraHelper(directionalLight.shadow.camera);
		// scene.add(lightHelper);

		// gui
		const gui = new GUI({
			container: tState.container,
			width: 340,
			title: 'Debug',
			closeFolders: true
		});
		gui.domElement.classList.add('absolute', 'top-0', 'right-0');
		gui.add(scene, 'environmentIntensity', 1, 4, 1);
		gui.add(renderer, 'toneMapping', {
			No: T.NoToneMapping,
			Linear: T.LinearToneMapping,
			Reinhard: T.ReinhardToneMapping,
			Cineon: T.CineonToneMapping,
			ACESFilmic: T.ACESFilmicToneMapping
		});
		gui.add(renderer, 'toneMappingExposure').min(1).max(10).step(0.5);

		$effect(() => {
			if (tState.loaded) {
				updateAllMaterials(scene);
			}
		});

		// Animation Loop
		const Clock = new T.Clock();
		let prevTime = 0;

		const animate = function () {
			const elapsedTime = Clock.getElapsedTime();
			const deltaTime = elapsedTime - prevTime;
			prevTime = elapsedTime;

			renderer.render(scene, camera);
		};

		renderer.setAnimationLoop(animate);

		// Events
		window.addEventListener('resize', () => {
			if (!tState.container) return;
			tState.height = tState?.container?.offsetHeight;
			tState.width = tState?.container?.offsetWidth;
			if (tState.width && tState.height) {
				camera.aspect = tState.width / tState.height;
				camera.updateProjectionMatrix();
				renderer.setSize(tState.width, tState.height);
			}
		});
	});
</script>

<div
	class="relative flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip [&>canvas]:h-[calc(100vh-56px)]"
	bind:this={tState.container}
>
	<div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full p-8">
		<button
			class="pointer-events-auto"
			onclick={() =>
				tState.container ? fullscreen() : console.log('threejs element does not exsit')}
		>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
		<div
			class="z-100 absolute left-0 top-0 h-full w-full items-center justify-center bg-black {tState.loaded
				? 'hidden'
				: 'flex'}"
		>
			<div class="flex animate-pulse items-center gap-2 text-2xl text-white">
				Loading <span
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-loader-circle animate-spin"
						><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg
					></span
				>
			</div>
		</div>
	</div>
</div>
