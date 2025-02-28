<script lang="ts">
	import { onMount } from 'svelte';
	import * as T from 'three';
	import { DRACOLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';

	let threeContainer: HTMLElement | null = null;
	onMount(() => {
		const gltfLoader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/src/lib/assets/draco/');
		gltfLoader.setDRACOLoader(dracoLoader);
		const renderer = new T.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.toneMapping = T.ACESFilmicToneMapping;

		const scene = new T.Scene();

		const sceneObjects: T.Mesh[] = [];

		gltfLoader.load('/src/lib/assets/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
			const children = [...gltf.scene.children];
			children[0].position.x = 2;
			scene.add(children[0]);
		});

		gltfLoader.load('/src/lib/assets/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
			const children = [...gltf.scene.children];
			for (const child of children) {
				child.scale.x = 3;
				child.scale.y = 3;
				child.scale.z = 3;
				scene.add(child);
			}
		});

		let mixer: T.AnimationMixer | null = null;

		gltfLoader.load('/src/lib/assets/models/Fox/glTF/Fox.gltf', (gltf) => {
			gltf.scene.scale.set(0.025, 0.025, 0.025);
			gltf.scene.position.x = -2;
			scene.add(gltf.scene);
			mixer = new T.AnimationMixer(gltf.scene);
			const action = mixer.clipAction(gltf.animations[2]);
			action.play();
			// const children = [...gltf.scene.children];
			// for (const child of children) {
			// 	child.scale.set(0.025, 0.025, 0.025);
			// 	child.position.x = -2;
			// 	scene.add(child);
			// }
		});

		const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
		camera.position.z = 3;
		camera.position.y = 3;
		camera.position.x = 3;
		camera.lookAt(new T.Vector3(0, 0, 0));

		const axisHelper = new T.AxesHelper(5);

		const light = new T.AmbientLight(0x404040, 1);

		new OrbitControls(camera, threeContainer);

		// test objects
		const material = new T.MeshStandardMaterial({
			metalness: 0,
			roughness: 0.1,
			transparent: true,
			opacity: 0.5
		});

		const floor = new T.PlaneGeometry(60, 60);
		const floorMesh = new T.Mesh(floor, material);

		floorMesh.rotateX(-(Math.PI * 2) / 4);
		floorMesh.position.y = -1;

		const directionalLight = new T.DirectionalLight('#ffffff', 1);
		directionalLight.position.set(0, 2, 2);
		scene.add(light, floorMesh, camera, axisHelper, directionalLight);

		const clock = new T.Clock();

		let oldElapsed = 0;

		const animate = () => {
			const elapsedTime = clock.getElapsedTime();
			const deltaTime = elapsedTime - oldElapsed;
			oldElapsed = elapsedTime;
			if (mixer) {
				mixer.update(deltaTime);
			}
			//console.log('animating');
			renderer.render(scene, camera);
		};

		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}
		renderer.setAnimationLoop(animate);
	});
</script>

<div
	class="z-0 flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip"
	bind:this={threeContainer}
></div>
