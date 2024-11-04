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
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';
	import GUI from 'lil-gui';

	const debugObject = $state({
		color: '#31fbfb',
		spin: false,
		subdivisions: 2
	});

	let threeContainer: HTMLElement | null = null;

	const fullscreen = () => {
		if (threeContainer && !document.fullscreenElement) {
			threeContainer.requestFullscreen();
		} else if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			console.log('No element!');
		}
	};

	const gui = new GUI({
		width: 340,
		title: 'My Awesome Debugger',
		closeFolders: true
	});
	gui.hide();

	const onkeydown = (e) => {
		console.log(e, e.key);
		e.key === 'd' ? gui.show(gui._hidden) : gui.hide();
	};

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

		// triangle buffer geometry
		const triGeometry = new THREE.BufferGeometry();
		const positions32 = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
		const positionsBuffersAttr = new THREE.BufferAttribute(positions32, 3);
		triGeometry.setAttribute('position', positionsBuffersAttr);
		const material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: true
		});
		const triMesh = new THREE.Mesh(triGeometry, material);
		scene.add(triMesh);

		const cube2 = createCube(1, 1, 1, debugObject.color);
		const cube3 = createCube(1, 1, 1, 'blue');

		cube2.position.x = 3;
		cube3.position.x = -3;

		const cube2Tweaks = gui.addFolder('Cube 2');
		cube2Tweaks.add(cube2.position, 'x').min(-5).max(5).step(0.01).name('horizontal');
		cube2Tweaks.add(cube2, 'visible');
		cube2Tweaks.add(cube2.material, 'wireframe');
		cube2Tweaks.addColor(debugObject, 'color').onChange(() => {
			console.log(debugObject.color);
			cube2.material.color.set(debugObject.color);
		});
		cube2Tweaks
			.add(debugObject, 'subdivisions')
			.min(1)
			.max(20)
			.step(1)
			.onFinishChange(() => {
				cube2.geometry.dispose();
				cube2.geometry = new THREE.BoxGeometry(
					1,
					1,
					1,
					debugObject.subdivisions,
					debugObject.subdivisions,
					debugObject.subdivisions
				);
			});

		debugObject.spin = () => {
			gsap.to(cube2.rotation, { y: cube2.rotation.y + Math.PI * 2 });
		};
		cube2Tweaks.add(debugObject, 'spin');

		group.add(triMesh, cube2, cube3);
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
	<div class="absolute left-0 top-0 z-10 h-full w-full p-8">
		<button onclick={fullscreen}>
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
