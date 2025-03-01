<script lang="ts">
	import { onMount } from 'svelte';
	import * as T from 'three';
	import { OrbitControls } from 'three/examples/jsm/Addons.js';
	let threeContainer: HTMLElement;

	const mousePos = $state({
		x: 0,
		y: 0
	});

	const handleMouseMove = (e: MouseEvent) => {
		mousePos.x = (e.clientX / threeContainer.offsetWidth) * 2 - 1;
		mousePos.y = -(((e.clientY - 56) / threeContainer.offsetHeight) * 2 - 1);
	};

	onMount(() => {
		const renderer = new T.WebGLRenderer();
		renderer.setSize(threeContainer.offsetWidth, threeContainer.offsetHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// scene, lights, camera!
		const scene = new T.Scene();
		const camera = new T.PerspectiveCamera(
			75,
			threeContainer.offsetWidth / threeContainer.offsetHeight
		);
		camera.position.set(3, 3, 3);
		const light = new T.AmbientLight('#ffffff', 8);

		const mat1 = new T.MeshStandardMaterial({
			metalness: 0.1,
			roughness: 0.2,
			color: '#f00000'
		});
		const mat2 = new T.MeshStandardMaterial({
			metalness: 0.1,
			roughness: 0.2,
			color: '#f00000'
		});
		const mat3 = new T.MeshStandardMaterial({
			metalness: 0.1,
			roughness: 0.2,
			color: '#f00000'
		});
		const sphere1Geo = new T.SphereGeometry(1);
		const sphere2Geo = new T.SphereGeometry(1);
		const sphere3Geo = new T.SphereGeometry(1);

		const sphere1 = new T.Mesh(sphere1Geo, mat1);
		sphere1.position.x = 3;
		const sphere3 = new T.Mesh(sphere2Geo, mat2);

		const sphere2 = new T.Mesh(sphere3Geo, mat3);
		sphere3.position.x = -3;

		const mat4 = new T.MeshStandardMaterial({
			metalness: 0.1,
			roughness: 0.2,
			color: '#f00000'
		});
		const mat5 = new T.MeshStandardMaterial({
			metalness: 0.1,
			roughness: 0.2,
			color: '#f00000'
		});
		const mat6 = new T.MeshStandardMaterial({
			metalness: 0.1,
			roughness: 0.2,
			color: '#f00000'
		});
		const cube1Geo = new T.BoxGeometry(1, 1, 1);
		const cube2Geo = new T.BoxGeometry(1, 1, 1);
		const cube3Geo = new T.BoxGeometry(1, 1, 1);

		const cube1 = new T.Mesh(cube1Geo, mat4);
		sphere1.position.x = 3;
		cube1.position.set(3, 0, -3);
		const cube3 = new T.Mesh(cube2Geo, mat5);
		cube3.position.set(-3, 0, -3);
		const cube2 = new T.Mesh(cube3Geo, mat6);
		cube2.position.z = -3;

		// window.addEventListener('mousemove', (e) => {
		// 	mouseRay.x = (e.clientX / window.innerWidth) * 2;
		// 	mouseRay.y = (e.clientY / window.innerHeight) * 2;
		// 	console.log(mouseRay.x, mouseRay.y);
		// });

		const sphereSceneObjects = [sphere1, sphere2, sphere3];
		const cubeSceneObjects = [cube1, cube2, cube3];

		const raycaster1 = new T.Raycaster();
		const raycaster2 = new T.Raycaster();

		// const intersect = raycaster.intersectObject(sphere1);
		// console.log(intersect);
		// const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
		// console.log(intersects);

		new OrbitControls(camera, threeContainer);

		scene.add(camera, light, sphere1, sphere2, sphere3, cube1, cube2, cube3);

		const clock = new T.Clock();
		let prevElapsed = 0;

		let intersects = raycaster1.intersectObjects(sphereSceneObjects);
		let intersects2 = raycaster2.intersectObjects(cubeSceneObjects);
		let currentIntersect: T.Mesh | null = null;

		const animate = () => {
			const elapsedTime = clock.getElapsedTime();
			const deltaTime = elapsedTime - prevElapsed;
			prevElapsed = elapsedTime;

			sphere1.position.y = Math.sin(elapsedTime * 0.3) * 4;
			sphere2.position.y = Math.sin(elapsedTime * 0.8) * 4;
			sphere3.position.y = Math.sin(elapsedTime * 1.3) * 4;

			const rayOrigin = new T.Vector3(-4, 0, 0);
			const rayDirection = new T.Vector3(1, 0, 0);
			rayDirection.normalize();
			raycaster1.set(rayOrigin, rayDirection);

			intersects = raycaster1.intersectObjects(sphereSceneObjects);

			for (const object of sphereSceneObjects) {
				object.material.color.set('#f00000');
				for (const intersect of intersects) {
					if (intersect.object.uuid === object.uuid) {
						currentIntersect = object;
						object.material.color.set('#1f31d6');
					}
				}
			}

			const mouseRay = new T.Vector2(mousePos.x, mousePos.y);
			raycaster2.setFromCamera(mouseRay, camera);

			intersects2 = raycaster2.intersectObjects(cubeSceneObjects);

			for (const object of cubeSceneObjects) {
				object.material.color.set('#f00000');
				for (const intersect of intersects2) {
					if (intersect.object.uuid === object.uuid) {
						currentIntersect = object;
						object.material.color.set('#1f31d6');
					}
				}
			}

			renderer.render(scene, camera);
		};
		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}
		renderer.setAnimationLoop(animate);
	});
</script>

<div
	role="img"
	onmousemove={handleMouseMove}
	class="flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip [&>canvas]:h-[calc(100vh-56px)]"
	bind:this={threeContainer}
></div>
