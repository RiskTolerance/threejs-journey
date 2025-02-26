<script lang="ts">
	import * as R from '@dimforge/rapier3d-compat';
	import * as T from 'three';
	import { onMount } from 'svelte';
	import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
	import Stats from 'three/addons/libs/stats.module.js';
	import hdr from '$lib/assets/hdrs/chinese_garden_2k.hdr';
	import floorArmImage from '$textures/floor/marble_01_arm_1k.jpg';
	import floorDiffImage from '$textures/floor/marble_01_diff_1k.jpg';
	import floorNormalImage from '$textures/floor/marble_01_nor_gl_1k.jpg';
	import floorRoughImage from '$textures/floor/marble_01_rough_1k.jpg';

	let threeContainer: HTMLElement | null = null;

	onMount(() => {
		R.init().then(() => {
			const renderer = new T.WebGLRenderer();
			const rgbeLoader = new RGBELoader();
			const textureLoader = new T.TextureLoader();
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			renderer.toneMapping = T.ACESFilmicToneMapping;

			const scene = new T.Scene();

			let gravity = { x: 0.0, y: -9.81, z: 0.0 };
			let world = new R.World(gravity);

			const floorCollider = R.ColliderDesc.cuboid(7.5, 0.1, 7.5);
			const worldFloorCollider = world.createCollider(floorCollider);
			const worldFloorTranslation = new R.Vector3(0, -1.1, 0);
			worldFloorCollider.setTranslation(worldFloorTranslation);

			// create dynamic rigid body
			const rigidBodySphereDesc = R.RigidBodyDesc.dynamic().setTranslation(0, 1, 0);
			const rigidBodySphere = world.createRigidBody(rigidBodySphereDesc);

			// create a sphere collider attached to the rigid body
			const colliderSphereDesc = R.ColliderDesc.ball(1);
			const colliderSphere = world.createCollider(colliderSphereDesc, rigidBodySphere);
			rigidBodySphere.setTranslation(new R.Vector3(2, 10, 0), true);
			colliderSphere.setTranslation(new R.Vector3(2, 10, 0));

			rgbeLoader.load(hdr, (envMap) => {
				envMap.mapping = T.EquirectangularReflectionMapping;
				scene.background = envMap;
				scene.environment = envMap;
			});

			const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

			const material2 = new T.MeshStandardMaterial();

			const material = new T.MeshStandardMaterial({
				roughness: 0.01,
				metalness: 0.2
			});

			// add geometry
			const sphere = new T.Mesh(new T.SphereGeometry(), material);
			const cube = new T.Mesh(new T.BoxGeometry(1, 1, 1), material2);
			const ico = new T.Mesh(new T.IcosahedronGeometry(), material2);
			sphere.position.x = 2;
			sphere.position.y = 10;
			cube.position.x = -2;
			ico.position.y = 5;

			const floorColor = textureLoader.load(floorDiffImage);
			floorColor.wrapS = T.RepeatWrapping;
			floorColor.wrapT = T.RepeatWrapping;
			floorColor.repeat.set(6, 6);
			const floorARM = textureLoader.load(floorArmImage);
			floorARM.wrapS = T.RepeatWrapping;
			floorARM.wrapT = T.RepeatWrapping;
			floorARM.repeat.set(6, 6);
			const floorNormal = textureLoader.load(floorNormalImage);
			floorNormal.wrapS = T.RepeatWrapping;
			floorNormal.wrapT = T.RepeatWrapping;
			floorNormal.repeat.set(6, 6);
			const floorRoughness = textureLoader.load(floorRoughImage);
			floorRoughness.wrapS = T.RepeatWrapping;
			floorRoughness.wrapT = T.RepeatWrapping;
			floorRoughness.repeat.set(6, 6);

			const floor = new T.PlaneGeometry(15, 15);
			const floorMat = new T.MeshStandardMaterial({
				normalMap: floorNormal,
				aoMap: floorARM,
				metalnessMap: floorARM,
				roughnessMap: floorARM,
				map: floorColor,
				roughness: 0.1
			});
			const floorMesh = new T.Mesh(floor, floorMat);

			floorMesh.rotateX(-(Math.PI * 2) / 4);
			floorMesh.position.y = -1;

			camera.position.z = 5;
			camera.position.y = 5;
			camera.position.x = 5;

			new OrbitControls(camera, threeContainer);

			scene.add(camera, floorMesh, sphere, cube, ico);

			// get the vertices of the debug lines
			const { vertices } = world.debugRender();

			// setup the geometry buffer for the Three scene
			const debugGeometry = new T.BufferGeometry();
			// create a float32 that's the same length as the debug array
			const positions = new Float32Array(vertices.length);
			// use setAttribute to set a position attribute
			debugGeometry.setAttribute('position', new T.BufferAttribute(positions, 3));

			// put the values of the debug vertices to the debug geometry
			for (let i = 0; i < vertices.length / 3; i++) {
				const i3 = i * 3;
				positions[i3] = vertices[i3];
				positions[i3 + 1] = vertices[i3 + 1];
				positions[i3 + 2] = vertices[i3 + 2];
			}

			const debugLines = new T.LineSegments(debugGeometry);
			scene.add(debugLines);

			// const clock = new T.Clock();
			// let oldElapsed = 0;

			const eventQueue = new R.EventQueue(true);

			const animate = () => {
				// const elapsedTime = clock.getElapsedTime();
				// const deltaTime = elapsedTime - oldElapsed;
				// oldElapsed = elapsedTime;
				const position = rigidBodySphere.translation();
				console.log(position);
				sphere.position.copy(position);
				world.step(eventQueue);
				renderer.render(scene, camera);
			};

			if (threeContainer) {
				threeContainer.appendChild(renderer.domElement);
			}

			renderer.setAnimationLoop(animate);
		});
	});
</script>

<div
	class="flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip"
	bind:this={threeContainer}
></div>
