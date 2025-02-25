<script lang="ts">
	import { onMount } from 'svelte';
	import * as T from 'three';
	import { Timer } from 'three/addons/misc/Timer.js';
	import threeBandGradiant from '$textures/gradients/3.jpg';

	let threeContainer: HTMLElement | null = null;

	onMount(() => {
		console.log('mounted!');
		const renderer = new T.WebGLRenderer({
			alpha: true
		});

		const winInfo = {
			innerHeight: window.innerHeight,
			innerWidth: window.innerWidth
		};

		window.addEventListener('resize', () => {
			winInfo.innerHeight = window.innerHeight;
			winInfo.innerWidth = window.innerWidth;
		});

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const scene = new T.Scene();

		const camera = new T.PerspectiveCamera(35, window.innerWidth / window.innerHeight);
		camera.position.x = 5;
		camera.lookAt(new T.Vector3(0, 0, 0));

		const loader = new T.TextureLoader();

		const objectDistance = 3;

		let scrollY = 0;
		window.addEventListener('scroll', () => {
			scrollY = window.scrollY;
		});

		const cursor = {
			x: 0,
			y: 0
		};

		window.addEventListener('mousemove', (e) => {
			cursor.x = e.clientX;
			cursor.y = e.clientY;
		});

		const toonMat = loader.load(threeBandGradiant);
		toonMat.magFilter = T.NearestFilter;
		const cubeGeo = new T.BoxGeometry(1, 1, 1);
		const mat = new T.MeshToonMaterial({
			color: '#ffee22',
			gradientMap: toonMat
		});
		const cube = new T.Mesh(cubeGeo, mat);

		const torusGeo = new T.TorusGeometry(0.5, 0.25);
		const torus = new T.Mesh(torusGeo, mat);

		const coneGeo = new T.ConeGeometry(0.75, 1.2);
		const cone = new T.Mesh(coneGeo, mat);

		const meshes = [cube, torus, cone];

		const directionalLight = new T.DirectionalLight('#ffffff', 3);
		directionalLight.position.set(0, 2, 2);

		cube.position.y = 0;
		torus.position.y = -objectDistance;
		cone.position.y = -objectDistance * 2;

		scene.add(camera, cube, torus, cone, directionalLight);

		const timer = new Timer();

		const animate = () => {
			renderer.render(scene, camera);
			timer.update();
			for (const mesh of meshes) {
				mesh.rotation.x = timer.getElapsed() * 0.5;
				mesh.rotation.y = timer.getElapsed() * 0.3;
				mesh.rotation.z = timer.getElapsed() * 0.6;
			}
			camera.position.y = (-scrollY / winInfo.innerHeight) * objectDistance;
		};

		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}
		renderer.setAnimationLoop(animate);
	});
</script>

<div class="relative">
	<div
		class="fixed left-0 top-0 z-10 h-[calc(100vh-59px)] w-full translate-y-[56px]"
		bind:this={threeContainer}
	></div>
	<div class="z-0 flex h-[calc(100vh-56px)] w-full items-center justify-center bg-red-300">
		<h1 class="z-20 text-8xl font-bold text-red-600">Section 1</h1>
	</div>
	<div class="z-0 flex h-[calc(100vh-56px)] w-full items-center justify-center bg-blue-300">
		<h1 class="z-20 text-8xl font-bold text-blue-600">Section 2</h1>
	</div>
	<div class="z-0 flex h-[calc(100vh-56px)] w-full items-center justify-center bg-green-300">
		<h1 class="z-20 text-8xl font-bold text-green-600">Section 3</h1>
	</div>
</div>
