import * as T from 'three';
import { tState } from '$lib/chapter_files/4.1/state.svelte';
import { error } from '@sveltejs/kit';
import { DRACOLoader, GLTFLoader, OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';

export const setup = async () => {
	try {
		// set up the basic scene, and assign to state
		console.log('Setting up Three.js scene...');
		// loading manager
		tState.loadingManager = new T.LoadingManager(
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

		// renderer
		tState.renderer = new T.WebGLRenderer({
			antialias: true
		});

		// dom
		tState?.container?.appendChild(tState.renderer.domElement);
		tState.height = tState?.container?.offsetHeight;
		tState.width = tState?.container?.offsetWidth;

		// scene
		tState.scene = new T.Scene();

		// camera
		if (tState.container && tState.width && tState.height) {
			tState.renderer.setSize(tState.width, tState.height);
			tState.camera = new T.PerspectiveCamera(75, tState.width / tState.height, 0.1, 1000);
			tState.camera.position.set(0, 2, 5);
		} else {
			error(404, {
				message: 'Threejs element not found'
			});
		}

		// loaders
		tState.loaders.gltf = new GLTFLoader(tState.loadingManager);
		tState.loaders.draco = new DRACOLoader(tState.loadingManager);
		tState.loaders.draco.setDecoderPath('/src/lib/assets/draco/');
		tState.loaders.gltf.setDRACOLoader(tState.loaders.draco);
		tState.loaders.rgbe = new RGBELoader(tState.loadingManager);
		tState.loaders.texture = new T.TextureLoader(tState.loadingManager);

		// orbit controls
		if (tState.camera && tState.renderer) {
			new OrbitControls(tState.camera, tState.renderer.domElement);
		}

		// axis helper
		const axisHelper = new T.AxesHelper(2);
		tState.scene.add(axisHelper);

		// render loop
		const Clock = new T.Clock();
		let prevTime = 0;

		const animate = (scene: T.Scene, camera: T.Camera, renderer: T.Renderer) => {
			const elapsedTime = Clock.getElapsedTime();
			// const deltaTime = elapsedTime - prevTime;
			prevTime = elapsedTime;
			renderer.render(scene, camera);
		};
		if (tState.renderer && tState.scene && tState.camera) {
			tState.renderer.setAnimationLoop(() => animate(tState.scene, tState.camera, tState.renderer));
		}
		console.log('Three.js scene setup complete!');
	} catch (err) {
		console.error('Error setting up Three.js scene:', err);
	}
};

export const updateAllMaterials = (scene: T.Scene) => {
	scene.traverse((child: T.Object3D<T.Object3DEventMap>) => {
		if (child.type === 'Mesh') {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
};

export const fullscreen = () => {
	if (tState.container && !document.fullscreenElement) {
		tState.container.requestFullscreen().then(() => {
			tState.height = tState.container?.offsetHeight;
			tState.width = tState.container?.offsetWidth;
		});
	} else if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		console.log('No element!');
	}
};
