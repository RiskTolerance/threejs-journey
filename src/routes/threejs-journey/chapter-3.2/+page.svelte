<script lang="ts">
	import { onMount } from 'svelte';
	import * as T from 'three';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';

	let threeContainer: HTMLElement | null = null;
	onMount(() => {
		const renderer = new T.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.toneMapping = T.ACESFilmicToneMapping;
		const scene = new T.Scene();

		const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
		camera.position.z = 3;
		camera.position.y = 3;
		camera.position.x = 3;
		camera.lookAt(new T.Vector3(0, 0, 0));

		const axisHelper = new T.AxesHelper(5);

		const light = new T.AmbientLight(0x404040, 1);

		const controls = new OrbitControls(camera, threeContainer);

		const sceneObjects: T.Mesh[] = [];

		// test objects
		const material = new T.MeshStandardMaterial({
			metalness: 0,
			roughness: 0.1,
			transparent: true,
			opacity: 0.5
		});
		const testGeo = new T.SphereGeometry(1);
		const testMesh = new T.Mesh(testGeo, material);

		const floor = new T.PlaneGeometry(60, 60);
		const floorMesh = new T.Mesh(floor, material);

		floorMesh.rotateX(-(Math.PI * 2) / 4);
		floorMesh.position.y = -1;

		const directionalLight = new T.DirectionalLight('#ffffff', 1);
		directionalLight.position.set(0, 2, 2);
		scene.add(light, testMesh, floorMesh, camera, axisHelper, directionalLight);

		const animate = () => {
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
