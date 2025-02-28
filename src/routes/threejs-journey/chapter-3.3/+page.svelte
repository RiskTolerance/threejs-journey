<script lang="ts">
	import { onMount } from 'svelte';
	import * as T from 'three';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';
	let threeContainer: HTMLElement | null = null;

	onMount(() => {
		const renderer = new T.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// scene, lights, camera!
		const scene = new T.Scene();
		const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
		camera.position.set(3, 3, 3);
		const light = new T.AmbientLight('#ffffff', 8);

		const defaultMaterial = new T.MeshStandardMaterial({
			metalness: 0.1,
			roughness: 0.2,
			color: '#f00000'
		});
		const sphere1Geo = new T.SphereGeometry(1);
		const sphere2Geo = new T.SphereGeometry(1);
		const sphere3Geo = new T.SphereGeometry(1);

		const sphere1 = new T.Mesh(sphere1Geo, defaultMaterial);
		sphere1.position.x = 3;
		const sphere3 = new T.Mesh(sphere2Geo, defaultMaterial);

		const sphere2 = new T.Mesh(sphere3Geo, defaultMaterial);
		sphere3.position.x = -3;

		new OrbitControls(camera, threeContainer);

		scene.add(camera, light, sphere1, sphere2, sphere3);

		const animate = () => {
			renderer.render(scene, camera);
		};
		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}
		renderer.setAnimationLoop(animate);
	});
</script>

<div
	class="flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip"
	bind:this={threeContainer}
></div>
