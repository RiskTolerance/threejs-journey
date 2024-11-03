<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createScene,
		createCamera,
		createRenderer,
		createCube,
		createAxisHelper
	} from '$lib/threeHelpers';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	let threeContainer: HTMLElement | null = null;

	onMount(() => {
		const scene = createScene();
		const camera = createCamera(1, 2, 5);
		const renderer = createRenderer();
		const axisHelper = createAxisHelper(scene);

		const controls = new OrbitControls(camera, threeContainer);
		controls.enableDamping = true;

		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}

		const group = new THREE.Group();
		group.position.set(0, 0, 0);

		const cube1 = createCube(1, 1, 1, 'red');
		const cube2 = createCube(1, 1, 1, 'green');
		const cube3 = createCube(1, 1, 1, 'blue');

		cube2.position.x = 3;
		cube3.position.x = -3;

		group.add(cube1, cube2, cube3);
		scene.add(group);

		gsap.to(group.position, { x: 4, duration: 2, delay: 2 }).then(() => {
			gsap.to(group.position, { x: -4, duration: 2, delay: 2 });
		});

		function animate() {
			// group.rotation.z += 0.01;
			renderer.render(scene, camera);
			controls.update();
		}

		renderer.setAnimationLoop(animate);

		const onResize = () => {
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

<div class="h-screen w-screen bg-black" id="three" bind:this={threeContainer}></div>
