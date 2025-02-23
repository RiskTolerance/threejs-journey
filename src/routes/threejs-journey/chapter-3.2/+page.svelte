<script lang="ts">
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';
	import GUI from 'lil-gui';

	let threeContainer: HTMLElement;

	onMount(() => {
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.1,
			2000
		);

		camera.position.set(2, 2, 2);
		camera.lookAt(new THREE.Vector3(0, 0, 0));

		new OrbitControls(camera, threeContainer);

		const params = {
			count: 10000,
			size: 0.02,
			radius: 5,
			branches: 3,
			spin: 1,
			randomness: 0.2,
			randomnessPower: 3,
			insideColor: '#ff6030',
			outsideColor: '#1b3984'
		};

		const gui = new GUI({
			width: 340,
			title: 'Galaxy Parameters',
			closeFolders: true
		});

		let geometry: THREE.BufferGeometry | null = null;
		let material: THREE.PointsMaterial | null = null;
		let points: THREE.Points | null = null;

		const generateGalaxy = () => {
			if (points !== null) {
				geometry?.dispose();
				material?.dispose();
				scene.remove(points);
			}

			geometry = new THREE.BufferGeometry();
			const positions = new Float32Array(params.count * 3);
			const colors = new Float32Array(params.count * 3);

			for (let i = 0; i < params.count; i++) {
				const i3 = i * 3;

				const radius = Math.random() * params.radius;
				const spinAngle = radius * params.spin;
				const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

				const insideColor = new THREE.Color(params.insideColor);
				const outsideColor = new THREE.Color(params.outsideColor);
				const mixedColor = insideColor.clone().lerp(outsideColor, radius / params.radius);

				const randomX =
					Math.pow(Math.random(), params.randomnessPower) *
					(Math.random() < 0.5 ? 1 : -1) *
					params.randomness *
					radius;
				const randomY =
					Math.pow(Math.random(), params.randomnessPower) *
					(Math.random() < 0.5 ? 1 : -1) *
					params.randomness *
					radius;
				const randomZ =
					Math.pow(Math.random(), params.randomnessPower) *
					(Math.random() < 0.5 ? 1 : -1) *
					params.randomness *
					radius;

				positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
				positions[i3 + 1] = randomY;
				positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

				colors[i3] = mixedColor.r;
				colors[i3 + 1] = mixedColor.g;
				colors[i3 + 2] = mixedColor.b;
			}

			geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

			material = new THREE.PointsMaterial({
				size: params.size,
				sizeAttenuation: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				vertexColors: true
			});

			points = new THREE.Points(geometry, material);
			scene.add(points);
		};

		generateGalaxy();

		gui.add(params, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy);
		gui.add(params, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
		gui.add(params, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
		gui.add(params, 'branches').min(1).max(20).step(1).onFinishChange(generateGalaxy);
		gui.add(params, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
		gui.add(params, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
		gui.add(params, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
		gui.add(params, 'insideColor').onFinishChange(generateGalaxy);
		gui.add(params, 'outsideColor').onFinishChange(generateGalaxy);

		const animate = () => {
			renderer.render(scene, camera);
		};

		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}
		renderer.setAnimationLoop(animate);
	});
</script>

<div class="h-[calc(100vh-56px)] w-full bg-black" bind:this={threeContainer}></div>
