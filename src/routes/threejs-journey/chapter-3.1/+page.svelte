<script lang="ts">
	import { createCamera, createRenderer, createScene } from '$lib/threeHelpers/general';
	import { Timer } from 'three/addons/misc/Timer.js';
	import { onMount } from 'svelte';
	let threeContainer: HTMLElement | null = null;
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';
	import sprite from '$textures/sprites/1.png';

	onMount(() => {
		const renderer = createRenderer();
		const scene = createScene();
		const camera = createCamera(2, 2, 2);
		const controls = new OrbitControls(camera, threeContainer);
		const axisHelper = new THREE.AxesHelper(1);
		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}

		const ambientLight = new THREE.AmbientLight('0xffffff', 16);

		const textureLoader = new THREE.TextureLoader();
		const spriteTexture = textureLoader.load(sprite);

		const particlesMaterial = new THREE.PointsMaterial({
			size: 0.04,
			sizeAttenuation: true,
			map: spriteTexture,
			transparent: true,
			alphaMap: spriteTexture,
			depthWrite: false,
			vertexColors: true
		});

		const particlesGeometry = new THREE.BufferGeometry();
		const particleCount: number = 50000;

		const particlePositions = new Float32Array(particleCount * 3);
		const particleColors = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount * 3; i++) {
			particlePositions[i] = (Math.random() - 0.5) * 4;
			particleColors[i] = Math.random();
		}

		particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
		particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

		const particles = new THREE.Points(particlesGeometry, particlesMaterial);

		// maybe just add everything to the scene at the end
		scene.add(axisHelper, ambientLight, camera, particles);

		const clock = new Timer();
		const animate = () => {
			renderer.render(scene, camera);
			clock.update();
			const elapsedTime = clock.getElapsed();
			// particles.rotation.y = elapsedTime * 0.2;
			for (let i = 0; i < particleCount; i++) {
				const third = i * 3;
				const x = particlesGeometry.attributes.position.array[third];
				particlesGeometry.attributes.position.array[third + 1] = Math.sin(elapsedTime + x);
			}
			particlesGeometry.attributes.position.needsUpdate = true;
		};
		renderer.setAnimationLoop(animate);
	});
</script>

<div class="relative h-screen w-full bg-black" bind:this={threeContainer}></div>
