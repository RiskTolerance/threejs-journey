<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import {
		createScene,
		createCamera,
		createRenderer,
		createAxisHelper
	} from '$lib/ threeHelpers/general';
	// TODO: add more geometry creation scripts
	import {
		createCone,
		createCube,
		createPlane,
		createSphere,
		createTorus
	} from '$lib/ threeHelpers/geometry';
	import { setBasicDebug } from '$lib/ threeHelpers/guis';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';
	import GUI from 'lil-gui';

	// import door images
	import doorColorImage from '$lib/assets/textures/door/color.jpg';
	import doorAlphaImage from '$lib/assets/textures/door/alpha.jpg';
	import doorAOImage from '$lib/assets/textures/door/ambientOcclusion.jpg';
	import doorHeightImage from '$lib/assets/textures/door/height.jpg';
	import doorMetalnessImage from '$lib/assets/textures/door/metalness.jpg';
	import doorNormalImage from '$lib/assets/textures/door/normal.jpg';
	import doorRoughnessImage from '$lib/assets/textures/door/roughness.jpg';
	import matcapImage from '$lib/assets/textures/matcaps/1.png';
	import gradiantImage from '$lib/assets/textures/gradients/3.jpg';
	// assign door textures ---------------------------------------------
	const textureLoader = new THREE.TextureLoader();
	const doorColor = textureLoader.load(doorColorImage);
	const doorAlpha = textureLoader.load(doorAlphaImage);
	const doorAO = textureLoader.load(doorAOImage);
	const doorHeight = textureLoader.load(doorHeightImage);
	const doorMetalness = textureLoader.load(doorMetalnessImage);
	const doorNormal = textureLoader.load(doorNormalImage);
	const doorRoughness = textureLoader.load(doorRoughnessImage);
	const matcap = textureLoader.load(matcapImage);
	const gradiant = textureLoader.load(gradiantImage);
	// --------------------------------------------------------------------
	type UI = {
		fullscreen: () => void;
	};

	const ui: UI = $state({
		fullscreen: () => {}
	});

	let threeContainer: HTMLElement | null = null;

	const onkeydown = (e: KeyboardEvent) => {
		console.log(e, e.key);
		// e.key === 'h' ? gui.show(gui._hidden) : gui.hide();
	};

	onMount(() => {
		const scene = createScene();
		const camera = createCamera(1, 2, 5);
		const renderer = createRenderer();
		const axisHelper = createAxisHelper(scene);
		const controls = new OrbitControls(camera, threeContainer);
		controls.enableDamping = true;

		ui.fullscreen = () => {
			if (threeContainer && !document.fullscreenElement) {
				threeContainer.requestFullscreen();
			} else if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				console.log('No element!');
			}
		};

		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}

		const group = new THREE.Group();
		group.position.set(0, 0, 0);

		const plane1 = createPlane(1, 1, 'green');
		plane1.material.side = THREE.DoubleSide;
		const sphere1 = createSphere(0.75, 'yellow');
		const cube2 = createCube(1, 1, 1, 'red');
		const cube3 = createCube(1, 1, 1, 'blue');
		const cone1 = createCone(0.5, 1, 'pink');
		const torus1 = createTorus(1, 0.2, 'white');

		sphere1.position.z = -3;
		cube2.position.x = 3;
		cube3.position.x = -3;
		cone1.position.z = 3;
		torus1.position.z = -3;

		// create the GUI,
		const gui = new GUI({
			width: 340,
			title: 'My Awesome Debugger',
			closeFolders: true
		});
		// create a folder for each object, grouping each object is necessary considering the number of variables we're adding.
		const cube2Tweaks = gui.addFolder('Cube 2');
		// pass the object to the debug
		setBasicDebug(cube2, 12, cube2Tweaks);
		const sphere1Tweaks = gui.addFolder('Sphere 1');
		setBasicDebug(sphere1, 12, sphere1Tweaks);
		const cone1Tweaks = gui.addFolder('Cone 1');
		setBasicDebug(cone1, 12, cone1Tweaks);
		group.add(plane1, sphere1, cube2, cube3, cone1, torus1);
		scene.add(group);

		function animate() {
			renderer.render(scene, camera);
			controls.update();
			torus1.rotateX(0.01);
			cube2.rotateZ(-0.01);
			cube3.rotateZ(0.01);
			cone1.rotateY(-0.01);
			group.rotateY(0.001);
		}
		renderer.setAnimationLoop(animate);

		const onResize = () => {
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<svelte:window {onkeydown} />

<div class="relative h-screen w-screen bg-black" id="three" bind:this={threeContainer}>
	<canvas class="pointer-events-none absolute h-0 w-0"></canvas>
	<div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full p-8">
		<button class="pointer-events-auto" onclick={ui.fullscreen}>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
	</div>
</div>

<style>
	#three > canvas {
		z-index: 0;
		outline: none;
	}
</style>
