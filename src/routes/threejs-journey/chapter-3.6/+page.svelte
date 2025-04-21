<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as T from 'three';
	import { DRACOLoader, GLTFLoader, OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
	import GUI from 'lil-gui';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';
	import { error } from '@sveltejs/kit';

	// import materials
	import floorAoRoughMetalImage from '$textures/floor/wood_cabinet/wood_cabinet_worn_long_arm_1k.jpg';
	import floorDiffuseImage from '$textures/floor/wood_cabinet/wood_cabinet_worn_long_diff_1k.jpg';
	import floorNormalImage from '$textures/floor/wood_cabinet/wood_cabinet_worn_long_nor_gl_1k.png';

	import wallAoRoughnessMetalImage from '$textures/walls/castle_brick/castle_brick_broken_06_arm_1k.jpg';
	import wallDiffuseImage from '$textures/walls/castle_brick/castle_brick_broken_06_diff_1k.jpg';
	import wallNormalImage from '$textures/walls/castle_brick/castle_brick_broken_06_nor_gl_1k.png';

	// loaded state
	let threeLoaded = $state(false);

	// container state
	let tContainer: {
		div: HTMLDivElement | undefined;
		height: number | undefined;
		width: number | undefined;
	} = $state({
		div: undefined,
		height: undefined,
		width: undefined
	});

	const fullscreen = (container: HTMLDivElement) => {
		if (container && !document.fullscreenElement) {
			container.requestFullscreen().then(() => {
				tContainer.height = container.offsetHeight;
				tContainer.width = container.offsetWidth;
			});
		} else if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			console.log('No element!');
		}
	};

	const updateAllMaterials = (scene: T.Scene) => {
		scene.traverse((child: T.Object3D<T.Object3DEventMap>) => {
			if (child instanceof T.Mesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
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
		tContainer.height = tContainer?.div?.offsetHeight;
		tContainer.width = tContainer?.div?.offsetWidth;

		const renderer = new T.WebGLRenderer({
			antialias: true
		});
		// tone mapping
		renderer.toneMapping = T.ReinhardToneMapping;
		renderer.toneMappingExposure = 1.5;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = T.PCFSoftShadowMap;

		const scene = new T.Scene();
		tContainer?.div?.appendChild(renderer.domElement);

		// set the camera's properties based on the dimensions/aspect ratio of the threejs dom element
		let camera: T.PerspectiveCamera | undefined = undefined;
		if (tContainer.div && tContainer.width && tContainer.height) {
			renderer.setSize(tContainer.width, tContainer.height);
			camera = new T.PerspectiveCamera(75, tContainer.width / tContainer.height, 0.1, 1000);
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
		const floorArm = textureLoader.load(floorAoRoughMetalImage);
		floorArm.wrapS = T.RepeatWrapping;
		floorArm.wrapT = T.RepeatWrapping;
		floorArm.repeat.set(2, 2);
		const floorColor = textureLoader.load(floorDiffuseImage);
		floorColor.wrapS = T.RepeatWrapping;
		floorColor.wrapT = T.RepeatWrapping;
		floorColor.repeat.set(2, 2);
		floorColor.colorSpace = T.SRGBColorSpace;
		const floorNormal = textureLoader.load(floorNormalImage);
		floorNormal.wrapS = T.RepeatWrapping;
		floorNormal.wrapT = T.RepeatWrapping;
		floorNormal.repeat.set(2, 2);

		const floorMaterial = new T.MeshStandardMaterial({
			map: floorColor,
			aoMap: floorArm,
			normalMap: floorNormal,
			metalnessMap: floorArm,
			roughnessMap: floorArm
		});

		const wallArm = textureLoader.load(wallAoRoughnessMetalImage);
		wallArm.wrapS = T.RepeatWrapping;
		wallArm.wrapT = T.RepeatWrapping;
		wallArm.repeat.set(2, 2);
		const wallColor = textureLoader.load(wallDiffuseImage);
		wallColor.wrapS = T.RepeatWrapping;
		wallColor.wrapT = T.RepeatWrapping;
		wallColor.repeat.set(2, 2);
		wallColor.colorSpace = T.SRGBColorSpace;
		const wallNormal = textureLoader.load(wallNormalImage);
		wallNormal.wrapS = T.RepeatWrapping;
		wallNormal.wrapT = T.RepeatWrapping;
		wallNormal.repeat.set(2, 2);

		const wallMaterial = new T.MeshStandardMaterial({
			map: wallColor,
			aoMap: wallArm,
			normalMap: wallNormal,
			metalnessMap: wallArm,
			roughnessMap: wallArm
		});
		// Background + Environment Maps

		// hdr env
		const hdrEnv = rgbeLoader.load('/src/lib/assets/hdrs/0/2k.hdr', (environmentMap) => {
			environmentMap.mapping = T.EquirectangularReflectionMapping;
		});

		scene.background = hdrEnv;
		scene.environment = hdrEnv;
		scene.environmentIntensity = 1;
		scene.backgroundIntensity = 1;
		scene.backgroundBlurriness = 0;

		// Geometries, Materials, Meshes, Helpers, Lights
		// const axisHelper = new T.AxesHelper(2);
		// scene.add(axisHelper);

		const directionalLight = new T.DirectionalLight('#ffffff', 5);
		directionalLight.position.set(-5.5, 5, 0.3);
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.far = 15;
		directionalLight.shadow.mapSize.set(1024, 1024);
		scene.add(directionalLight);
		directionalLight.target.position.set(0, 3, 0);
		directionalLight.target.updateWorldMatrix(false, true);

		// const lightHelper = new T.CameraHelper(directionalLight.shadow.camera);
		// scene.add(lightHelper);

		let helmet: T.Group<T.Object3DEventMap> | undefined = undefined;
		gltfLoader.load('/src/lib/assets/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
			helmet = gltf.scene;
			helmet.scale.set(4, 4, 4);
			scene.add(helmet);
		});

		const floorGeo = new T.PlaneGeometry(4, 4);
		const floor = new T.Mesh(floorGeo, floorMaterial);
		floor.rotateX(T.MathUtils.degToRad(-90));
		scene.add(floor);

		const wallGeo = new T.PlaneGeometry(4, 4);
		const wall = new T.Mesh(wallGeo, wallMaterial);
		wall.position.z = -2;
		wall.position.y = 2;
		scene.add(wall);

		// gui
		const gui = new GUI({
			container: tContainer.div,
			width: 340,
			title: 'My Awesome Debugger',
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
		gui.add(directionalLight, 'intensity', 1, 10, 0.1).name('Light Intensity');
		gui.add(directionalLight.position, 'x', -10, 10, 0.01).name('Light X');
		gui.add(directionalLight.position, 'y', -10, 10, 0.01).name('Light Y');
		gui.add(directionalLight.position, 'z', -10, 10, 0.01).name('Light Z');
		gui.add(directionalLight, 'castShadow');
		$effect(() => {
			if (threeLoaded) {
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

			// animate scene items

			// cube.rotation.x += 0.01;
			// cube.rotation.y += 0.01;
			// cube.rotation.z += 0.01;

			renderer.render(scene, camera);
		};

		renderer.setAnimationLoop(animate);

		// Events
		window.addEventListener('resize', () => {
			if (!tContainer.div) return;
			tContainer.height = tContainer?.div?.offsetHeight;
			tContainer.width = tContainer?.div?.offsetWidth;
			if (tContainer.width && tContainer.height) {
				camera.aspect = tContainer.width / tContainer.height;
				camera.updateProjectionMatrix();
				renderer.setSize(tContainer.width, tContainer.height);
			}
		});
	});
</script>

<div
	class="relative flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip [&>canvas]:h-[calc(100vh-56px)]"
	bind:this={tContainer.div}
>
	<div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full p-8">
		<button
			class="pointer-events-auto"
			onclick={() =>
				tContainer.div ? fullscreen(tContainer.div) : console.log('threejs element does not exsit')}
		>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
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
</div>
