<script lang="ts">
	import * as R from '@dimforge/rapier3d-compat';
	import * as T from 'three';
	import { onMount, tick } from 'svelte';
	import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
	import Stats from 'three/addons/libs/stats.module.js';
	import hdr from '$lib/assets/hdrs/chinese_garden_2k.hdr';
	import floorArmImage from '$textures/floor/marble_01_arm_1k.jpg';
	import floorDiffImage from '$textures/floor/marble_01_diff_1k.jpg';
	import floorNormalImage from '$textures/floor/marble_01_nor_gl_1k.jpg';
	import floorRoughImage from '$textures/floor/marble_01_rough_1k.jpg';

	import hitSoundFile from '$lib/assets/sounds/hit.mp3';

	let threeContainer: HTMLElement | null = null;
	let addSphereButton: HTMLButtonElement | null = null;
	let addCubeButton: HTMLButtonElement | null = null;

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

			interface SceneObject {
				mesh: T.Mesh;
				body: R.RigidBody;
			}
			const sceneObjects: SceneObject[] = [];

			const hitSound = new Audio(hitSoundFile);
			// hitSound.play().then(() => {
			// 	console.log('played');
			// });

			// default material for new objects

			const material = new T.MeshStandardMaterial({
				roughness: 0.01,
				metalness: 0.2
			});

			const createSphere = (
				diameter: number = 1,
				position: T.Vector3 = new T.Vector3(0, 0, 0),
				bounce: number = 1
			) => {
				// THREE
				const geometry = new T.SphereGeometry(diameter);
				const mesh = new T.Mesh(geometry, material);
				scene.add(mesh);
				// RAPIER
				// rigid body
				const bodyDesc = R.RigidBodyDesc.dynamic()
					.setTranslation(position.x, position.y, position.z)
					.setCanSleep(true);
				const body = world.createRigidBody(bodyDesc);
				// collider
				const colliderDesc = R.ColliderDesc.ball(diameter)
					.setRestitution(bounce)
					.setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS);
				const collider = world.createCollider(colliderDesc, body);

				sceneObjects.push({
					mesh,
					body
				});
			};

			interface cubeDims {
				x: number;
				y: number;
				z: number;
			}
			const createCube = (
				dimensions: cubeDims = { x: 1, y: 1, z: 1 },
				position: T.Vector3 = new T.Vector3(0, 0, 0),
				bounce: number = 1
			) => {
				// THREE
				const geometry = new T.BoxGeometry(dimensions.x * 2, dimensions.y * 2, dimensions.z * 2);
				const mesh = new T.Mesh(geometry, material);
				mesh.position.x = position.x;
				mesh.position.y = position.y;
				mesh.position.z = position.z;
				scene.add(mesh);
				// RAPIER
				// body
				const bodyDesc = R.RigidBodyDesc.dynamic()
					.setTranslation(position.x, position.y, position.z)
					.setCanSleep(true);
				const body = world.createRigidBody(bodyDesc);
				// collider
				const colliderDesc = R.ColliderDesc.cuboid(dimensions.x, dimensions.y, dimensions.z)
					.setRestitution(bounce)
					.setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS);
				const collider = world.createCollider(colliderDesc, body);

				sceneObjects.push({
					mesh,
					body
				});
			};

			if (addSphereButton && addCubeButton) {
				addSphereButton.addEventListener('click', () => {
					const randDiameter = Math.max(Math.random(), 0.25);
					const randPos: T.Vector3 = new T.Vector3(
						(Math.random() - 0.5) * 3,
						10,
						(Math.random() - 0.5) * 3
					);
					createSphere(randDiameter, randPos);
				});

				addCubeButton.addEventListener('click', () => {
					const randDim1 = Math.max(Math.random(), 0.1);
					const randDim2 = Math.max(Math.random(), 0.1);
					const randDim3 = Math.max(Math.random(), 0.1);
					const randPos: T.Vector3 = new T.Vector3(
						(Math.random() - 0.5) * 3,
						5,
						(Math.random() - 0.5) * 3
					);
					createCube({ x: randDim1, y: randDim2, z: randDim3 }, randPos);
				});
			}

			const floorCollider = R.ColliderDesc.cuboid(30, 0.1, 30).setRestitution(0.5);
			const worldFloorCollider = world.createCollider(floorCollider);
			const worldFloorTranslation = new R.Vector3(0, -1.1, 0);
			worldFloorCollider.setTranslation(worldFloorTranslation);

			rgbeLoader.load(hdr, (envMap) => {
				envMap.mapping = T.EquirectangularReflectionMapping;
				scene.background = envMap;
				scene.environment = envMap;
			});

			const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

			const floorRepeatVal = 18;
			const floorColor = textureLoader.load(floorDiffImage);
			floorColor.wrapS = T.RepeatWrapping;
			floorColor.wrapT = T.RepeatWrapping;
			floorColor.repeat.set(floorRepeatVal, floorRepeatVal);
			const floorARM = textureLoader.load(floorArmImage);
			floorARM.wrapS = T.RepeatWrapping;
			floorARM.wrapT = T.RepeatWrapping;
			floorARM.repeat.set(floorRepeatVal, floorRepeatVal);
			const floorNormal = textureLoader.load(floorNormalImage);
			floorNormal.wrapS = T.RepeatWrapping;
			floorNormal.wrapT = T.RepeatWrapping;
			floorNormal.repeat.set(floorRepeatVal, floorRepeatVal);
			const floorRoughness = textureLoader.load(floorRoughImage);
			floorRoughness.wrapS = T.RepeatWrapping;
			floorRoughness.wrapT = T.RepeatWrapping;
			floorRoughness.repeat.set(floorRepeatVal, floorRepeatVal);

			const floor = new T.PlaneGeometry(60, 60);
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

			camera.position.z = 12;
			camera.position.y = 12;
			camera.position.x = 12;

			new OrbitControls(camera, threeContainer);

			scene.add(camera, floorMesh);

			// DEBUG BLOCK ---------------------
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

			// -----------------------------------

			const clock = new T.Clock();
			let oldElapsed = 0;

			const eventQueue = new R.EventQueue(true);

			const clamp = (num: number, min: number, max: number) => {
				return num <= min ? min : num >= max ? max : num;
			};

			const animate = () => {
				const elapsedTime = clock.getElapsedTime();
				const deltaTime = elapsedTime - oldElapsed;
				oldElapsed = elapsedTime;
				world.timestep = deltaTime * 1.25;

				for (const object of sceneObjects) {
					object.mesh.position.copy(object.body.translation());
					object.mesh.quaternion.copy(object.body.rotation());
				}

				world.step(eventQueue);

				eventQueue.drainContactForceEvents((e) => {
					const force = e.maxForceMagnitude();
					if (force > 100) {
						// clamp the force between 50 and 5000
						// then set the volume between 0 and 1:
						const volume = clamp(force, 100, 4000) / 4000;
						console.log(volume);
						hitSound.volume = volume;
						hitSound.currentTime = 0;
						hitSound.play();
					}
				});

				renderer.render(scene, camera);
			};

			if (threeContainer) {
				threeContainer.appendChild(renderer.domElement);
			}

			renderer.setAnimationLoop(animate);
		});
	});
</script>

<div class="relative">
	<div
		class="z-0 flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip"
		bind:this={threeContainer}
	></div>
	<div class="absolute left-0 top-0 flex h-20 w-fit gap-4 p-4">
		<button class="rounded-md border p-2 text-white backdrop-blur-md" bind:this={addSphereButton}
			>Add Sphere</button
		>
		<button class="rounded-md border p-2 text-white backdrop-blur-md" bind:this={addCubeButton}
			>Add Cube</button
		>
	</div>
</div>
