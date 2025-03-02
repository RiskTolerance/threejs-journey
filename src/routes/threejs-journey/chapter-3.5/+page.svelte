<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as T from 'three';
	import { DRACOLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
	import GUI from 'lil-gui';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';

	let threeContainer: HTMLDivElement;

	let gui: GUI | null = null;

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
		const cubeTextureLoader = new T.CubeTextureLoader();

		new OrbitControls(camera, renderer.domElement);

		// Background, Environment, Fog

		const environmentMap1 = cubeTextureLoader.load([
			'/src/lib/assets/hdrs/0/px.png',
			'/src/lib/assets/hdrs/0/nx.png',
			'/src/lib/assets/hdrs/0/py.png',
			'/src/lib/assets/hdrs/0/ny.png',
			'/src/lib/assets/hdrs/0/pz.png',
			'/src/lib/assets/hdrs/0/nz.png'
		]);

		const environmentMap2 = cubeTextureLoader.load([
			'/src/lib/assets/hdrs/1/px.png',
			'/src/lib/assets/hdrs/1/nx.png',
			'/src/lib/assets/hdrs/1/py.png',
			'/src/lib/assets/hdrs/1/ny.png',
			'/src/lib/assets/hdrs/1/pz.png',
			'/src/lib/assets/hdrs/1/nz.png'
		]);

		const environmentMap3 = cubeTextureLoader.load([
			'/src/lib/assets/hdrs/2/px.png',
			'/src/lib/assets/hdrs/2/nx.png',
			'/src/lib/assets/hdrs/2/py.png',
			'/src/lib/assets/hdrs/2/ny.png',
			'/src/lib/assets/hdrs/2/pz.png',
			'/src/lib/assets/hdrs/2/nz.png'
		]);

		scene.background = environmentMap3;
		scene.environment = environmentMap3;
		scene.environmentIntensity = 4;
		scene.backgroundBlurriness = 0;

		// const pointLight = new T.PointLight(0xffffff, 40);
		// pointLight.position.set(3, 3, 0);
		// scene.add(pointLight);

		// Geometries, Materials, Meshes,

		gltfLoader.load('/src/lib/assets/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
			const helmet = gltf.scene;
			helmet.scale.set(4, 4, 4);
			scene.add(helmet);
		});

		const torusKnot = new T.Mesh(
			new T.TorusKnotGeometry(0.5, 0.15, 100, 16),
			new T.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.3 })
		);
		torusKnot.position.set(-2, 1, 0);
		scene.add(torusKnot);

		const doughnut = new T.Mesh(
			new T.TorusGeometry(3, 0.05, 100, 80),
			new T.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.3 })
		);
		doughnut.rotateOnAxis(new T.Vector3(1, 0, 0), Math.PI / 2);
		doughnut.position.set(0, 1, 0);
		scene.add(doughnut);

		const doughnut2 = new T.Mesh(
			new T.TorusGeometry(3.2, 0.05, 100, 80),
			new T.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.3 })
		);
		doughnut2.rotateOnAxis(new T.Vector3(1, 0, 0), Math.PI);
		doughnut2.rotateOnAxis(new T.Vector3(0, 1, 0), Math.PI / 2);
		doughnut2.position.set(0, 1, 0);
		scene.add(doughnut2);

		// Helpers & GUI

		gui = new GUI({
			width: 300,
			closeFolders: true
		});
		gui.domElement.style.position = 'absolute';
		gui.domElement.style.top = '0';
		gui.domElement.style.right = '0';
		threeContainer.appendChild(gui.domElement);

		// gui.add(pointLight, 'intensity').min(0).max(100).step(0.01).name('Point Light Intensity');
		gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.01).name('Background Intensity');
		gui.add(scene, 'backgroundBlurriness').min(0).max(0.3).step(0.01).name('Background Blurriness');

		const environmentOptions: { [key: string]: T.CubeTexture } = {
			Environment1: environmentMap1,
			Environment2: environmentMap2,
			Environment3: environmentMap3
		};

		gui
			.add({ environment: 'Environment3' }, 'environment', Object.keys(environmentOptions))
			.name('Environment Map')
			.onChange((value: string) => {
				scene.background = environmentOptions[value];
				scene.environment = environmentOptions[value];
			})
			.domElement.childNodes.forEach((child) => {
				if (child.firstChild instanceof HTMLSelectElement) {
					child.firstChild.style.backgroundColor = '#1f1f1f';
				}
			});

		const gridHelper = new T.GridHelper(10, 40);
		scene.add(gridHelper);

		const axisHelper = new T.AxesHelper(2);
		scene.add(axisHelper);

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
			if (!threeContainer) return;
			containerHeight = threeContainer.offsetHeight;
			containerWidth = threeContainer.offsetWidth;
			camera.aspect = containerWidth / containerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(containerWidth, containerHeight);
		});
	});

	onDestroy(() => {
		if (gui) {
			gui.destroy();
		}
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
