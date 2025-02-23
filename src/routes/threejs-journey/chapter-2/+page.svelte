<script lang="ts">
	import { onMount } from 'svelte';
	import { Timer } from 'three/addons/misc/Timer.js';
	import { Sky } from 'three/addons/objects/Sky.js';
	import * as THREE from 'three';
	import { createScene, createCamera, createRenderer } from '$lib/threeHelpers/general';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';

	let threeContainer: HTMLElement | null = null;

	import { createHouse } from '$lib/threeHelpers/hauntedHouse/house';
	import { createBushes } from '$lib/threeHelpers/hauntedHouse/bushes';
	import { createGraves } from '$lib/threeHelpers/hauntedHouse/graves';
	import { createFloor } from '$lib/threeHelpers/hauntedHouse/floor';

	onMount(() => {
		const scene = createScene();
		const camera = createCamera(1, 2, 5);
		const renderer = createRenderer();
		const controls = new OrbitControls(camera, threeContainer);
		const axisHelper = new THREE.AxesHelper(10);
		scene.add(axisHelper);
		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}

		const textureLoader = new THREE.TextureLoader();

		// split out parts of the scene into individual files
		const house = createHouse(textureLoader);
		const bushes = createBushes(textureLoader);
		const graves = createGraves(textureLoader);
		for (const grave of graves.children) {
			grave.castShadow = true;
			grave.receiveShadow = true;
		}
		const floor = createFloor();

		scene.add(bushes, house, floor, graves);

		// lights
		const ambientLight = new THREE.AmbientLight('#02343F', 0.05);
		scene.add(ambientLight);
		const pointLight = new THREE.DirectionalLight('#02343F', 1);

		pointLight.position.x = 4;
		pointLight.position.z = 4;
		pointLight.position.y = 6;
		scene.add(pointLight);
		pointLight.lookAt(new THREE.Vector3(0, 15, 0));

		const doorLight = new THREE.PointLight('#ff7d46', 10);

		doorLight.position.set(2.2, 2.4, 0);
		house.add(doorLight);

		const ghost1 = new THREE.PointLight('#8800ff', 8);
		const ghost2 = new THREE.PointLight('#ff0088', 6);
		const ghost3 = new THREE.PointLight('#ff0000', 6);
		pointLight.castShadow = true;
		doorLight.castShadow = true;
		ghost1.castShadow = true;
		ghost2.castShadow = true;
		ghost3.castShadow = true;

		ghost1.shadow.mapSize.width = 256;
		ghost1.shadow.mapSize.height = 256;
		ghost1.shadow.camera.far = 10;

		ghost2.shadow.mapSize.width = 256;
		ghost2.shadow.mapSize.height = 256;
		ghost2.shadow.camera.far = 10;

		ghost3.shadow.mapSize.width = 256;
		ghost3.shadow.mapSize.height = 256;
		ghost3.shadow.camera.far = 10;
		scene.add(ghost1, ghost2, ghost3);

		const sky = new Sky();
		sky.scale.set(100, 100, 100);
		scene.add(sky);

		sky.material.uniforms['turbidity'].value = 10;
		sky.material.uniforms['rayleigh'].value = 3;
		sky.material.uniforms['mieCoefficient'].value = 0.1;
		sky.material.uniforms['mieDirectionalG'].value = 0.95;
		sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

		scene.fog = new THREE.FogExp2('#02343F', 0.1);

		const timer = new Timer();
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;

		const animate = () => {
			renderer.render(scene, camera);
			timer.update();
			const elapsedTime = timer.getElapsed();

			const ghost1Angle = elapsedTime * 0.5;
			ghost1.position.x = Math.cos(ghost1Angle) * 4;
			ghost1.position.z = Math.sin(ghost1Angle) * 4;
			ghost1.position.y = Math.abs(
				Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)
			);

			const ghost2Angle = -elapsedTime * 0.8;
			ghost2.position.x = Math.cos(ghost2Angle) * 5;
			ghost2.position.z = Math.sin(ghost2Angle) * 5;
			ghost2.position.y = Math.abs(
				Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.2) * Math.sin(ghost2Angle * 3.6)
			);

			const ghost3Angle = elapsedTime * 0.23;
			ghost3.position.x = Math.cos(ghost3Angle) * 6;
			ghost3.position.z = Math.sin(ghost3Angle) * 6;
			ghost3.position.y = Math.abs(
				Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.2) * Math.sin(ghost3Angle * 3.6)
			);
		};
		renderer.setAnimationLoop(animate);
	});
</script>

<div class="relative h-screen w-full bg-black" id="three" bind:this={threeContainer}>
	<canvas class="pointer-events-none absolute h-0 w-0"></canvas>
</div>
