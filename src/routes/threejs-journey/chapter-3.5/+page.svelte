<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as T from 'three';
	import { DRACOLoader, GLTFLoader, OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
	import GUI from 'lil-gui';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';
	import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';

	let threeContainer: HTMLDivElement;

	let gui: GUI | null = null;

	let containerHeight: number = $state(0);
	let containerWidth: number = $state(0);

	let threeLoaded = $state(false);

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
		// Loading Manager
		const loadingManager = new T.LoadingManager(
			() => {
				console.log('Loading Complete!');
				threeLoaded = true;
			},
			(url, loaded, total) => {
				console.log(`Loading ${url}: ${loaded} / ${total}`);
			},
			(url) => {
				console.error(`Error loading ${url}`);
			}
		);

		// Setup - Loaders, Scene, Camera, Renderer, Initial Container Size
		containerHeight = threeContainer.offsetHeight;
		containerWidth = threeContainer.offsetWidth;

		const renderer = new T.WebGLRenderer();
		renderer.setSize(containerWidth, containerHeight);
		const scene = new T.Scene();
		const camera = new T.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
		camera.position.set(0, 2, 5);

		threeContainer.appendChild(renderer.domElement);

		const gltfLoader = new GLTFLoader(loadingManager);
		const dracoLoader = new DRACOLoader(loadingManager);
		dracoLoader.setDecoderPath('/src/lib/assets/draco/');
		gltfLoader.setDRACOLoader(dracoLoader);

		const rgbeLoader = new RGBELoader(loadingManager);

		const textureLoader = new T.TextureLoader(loadingManager);

		const cubeTextureLoader = new T.CubeTextureLoader(loadingManager);

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

		const environmentMap4 = rgbeLoader.load('/src/lib/assets/hdrs/0/2k.hdr', (environmentMap) => {
			environmentMap.mapping = T.EquirectangularReflectionMapping;
		});
		const environmentMap5 = rgbeLoader.load('/src/lib/assets/hdrs/1/2k.hdr', (environmentMap) => {
			environmentMap.mapping = T.EquirectangularReflectionMapping;
		});
		const environmentMap6 = rgbeLoader.load('/src/lib/assets/hdrs/2/2k.hdr', (environmentMap) => {
			environmentMap.mapping = T.EquirectangularReflectionMapping;
		});

		const environmentMap7 = textureLoader.load(
			'/src/lib/assets/hdrs/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg',
			(environmentMap) => {
				environmentMap.mapping = T.EquirectangularReflectionMapping;
				environmentMap.colorSpace = T.SRGBColorSpace;
			}
		);
		const environmentMap8 = textureLoader.load(
			'/src/lib/assets/hdrs/blockadesLabsSkybox/digital_painting_neon_city_night_orange_lights_.jpg',
			(environmentMap) => {
				environmentMap.mapping = T.EquirectangularReflectionMapping;
				environmentMap.colorSpace = T.SRGBColorSpace;
			}
		);
		const environmentMap9 = textureLoader.load(
			'/src/lib/assets/hdrs/blockadesLabsSkybox/scifi_white_sky_scrapers_in_clouds_at_day_time.jpg',
			(environmentMap) => {
				environmentMap.mapping = T.EquirectangularReflectionMapping;
				environmentMap.colorSpace = T.SRGBColorSpace;
			}
		);

		const environmentMap10 = rgbeLoader.load(
			'/src/lib/assets/hdrs/blender_render_1.hdr',
			(environmentMap) => {
				environmentMap.mapping = T.EquirectangularReflectionMapping;
			}
		);

		const environmentMap11 = rgbeLoader.load(
			'/src/lib/assets/hdrs/chinese_garden_2k.hdr',
			(environmentMap) => {
				environmentMap.mapping = T.EquirectangularReflectionMapping;
			}
		);

		scene.background = environmentMap3;
		scene.environment = environmentMap3;
		scene.environmentIntensity = 4;
		scene.backgroundIntensity = 1;
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

		// Helpers

		const gridHelper = new T.GridHelper(10, 40);
		scene.add(gridHelper);

		const axisHelper = new T.AxesHelper(2);
		scene.add(axisHelper);

		// GUI - this should come (close to) last, so we have access to all the objects we want to control

		gui = new GUI({
			width: 300,
			closeFolders: true
		});
		gui.domElement.style.position = 'absolute';
		gui.domElement.style.top = '0';
		gui.domElement.style.right = '0';
		threeContainer.appendChild(gui.domElement);

		// gui.add(pointLight, 'intensity').min(0).max(100).step(0.01).name('Point Light Intensity');
		const bgEnvFolder = gui.addFolder('Background & Environment');

		bgEnvFolder
			.add(scene, 'backgroundIntensity')
			.min(0)
			.max(10)
			.step(0.01)
			.name('Background Intensity');

		bgEnvFolder
			.add(scene, 'environmentIntensity')
			.min(0)
			.max(10)
			.step(0.01)
			.name('Environment Intensity');
		bgEnvFolder
			.add(scene, 'backgroundBlurriness')
			.min(0)
			.max(0.3)
			.step(0.01)
			.name('Background Blurriness');

		const environmentOptions: { [key: string]: T.CubeTexture | T.DataTexture | T.Texture } = {
			Environment1: environmentMap1,
			Environment2: environmentMap2,
			Environment3: environmentMap3,
			'Environment 4 (HDR)': environmentMap4,
			'Environment 5 (HDR)': environmentMap5,
			'Environment 6 (HDR)': environmentMap6,
			'Environment 7 (Texture)': environmentMap7,
			'Environment 8 (Texture)': environmentMap8,
			'Environment 9 (Texture)': environmentMap9,
			'Environment 10 (Blender HDR)': environmentMap10,
			'Environment 11 (Grounded Example)': environmentMap11
		};

		gui
			.add({ environment: 'Environment3' }, 'environment', Object.keys(environmentOptions))
			.name('Environment Map')
			.onChange((value: string) => {
				if (value.includes('Grounded')) {
					scene.background = null;
					scene.environment = environmentOptions[value];
					scene.children.forEach((child) => {
						if (child instanceof GroundedSkybox) {
							scene.remove(child);
						}
					});
					const skybox = new GroundedSkybox(environmentOptions[value], 15, 70);
					skybox.material.wireframe = false;
					skybox.position.y = 15;
					scene.add(skybox);
				} else {
					scene.children.forEach((child) => {
						if (child instanceof GroundedSkybox) {
							scene.remove(child);
						}
					});
					scene.background = environmentOptions[value];
					scene.environment = environmentOptions[value];
				}
			})
			.domElement.childNodes.forEach((child) => {
				if (child.firstChild instanceof HTMLSelectElement) {
					child.firstChild.style.backgroundColor = '#1f1f1f';
				}
			});

		const helpersFolder = gui.addFolder('Helpers');
		const helpers = {
			gridHelper: true,
			axisHelper: true
		};

		helpersFolder
			.add(helpers, 'gridHelper')
			.name('Grid Helper')
			.onChange((value: boolean) => {
				gridHelper.visible = value;
			});
		helpersFolder
			.add(helpers, 'axisHelper')
			.name('Axis Helper')
			.onChange((value: boolean) => {
				axisHelper.visible = value;
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
	<div
		class="z-100 absolute left-0 top-0 h-full w-full items-center justify-center bg-black {threeLoaded
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
