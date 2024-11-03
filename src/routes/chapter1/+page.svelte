<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	function animate() {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		renderer.render(scene, camera);
	}

	let renderer;
	let scene;
	let camera;
	let threeContainer;
	let cube;

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		threeContainer = document.querySelector('#three');
		console.log(threeContainer);
		document.querySelector('#three')?.appendChild(renderer.domElement);
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		camera.position.z = 5;
		renderer.setAnimationLoop(animate);
	});
</script>

<div class="h-screen w-screen bg-black" id="three"></div>
