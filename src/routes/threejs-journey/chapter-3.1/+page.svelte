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
			console.log(worldFloorCollider);

			rgbeLoader.load(hdr, (envMap) => {
				envMap.mapping = T.EquirectangularReflectionMapping;
				scene.background = envMap;
				scene.environment = envMap;
			});

			const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

			const cubeRenderTarget = new T.WebGLCubeRenderTarget(120);
			cubeRenderTarget.texture.type = T.HalfFloatType;
			const cubeCamera = new T.CubeCamera(1, 1000, cubeRenderTarget);

			const material2 = new T.MeshStandardMaterial();

			const material = new T.MeshPhysicalMaterial({
				envMap: cubeRenderTarget.texture,
				roughness: 0.01,
				metalness: 0.2,
				transmission: 1
			});

			// add geometry
			const sphere = new T.Mesh(new T.SphereGeometry(), material);
			const cube = new T.Mesh(new T.BoxGeometry(1, 1, 1), material2);
			const ico = new T.Mesh(new T.IcosahedronGeometry(), material2);
			sphere.position.x = 2;
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
			const floorMat = new T.MeshPhysicalMaterial({
				normalMap: floorNormal,
				aoMap: floorARM,
				metalnessMap: floorARM,
				roughnessMap: floorARM,
				map: floorColor,
				clearcoat: 0.1,
				roughness: 0.1,
				reflectivity: 1
			});
			const floorMesh = new T.Mesh(floor, floorMat);

			floorMesh.rotateX(-(Math.PI * 2) / 4);
			floorMesh.position.y = -1;

			camera.position.z = 5;
			camera.position.y = 5;
			camera.position.x = 5;

			new OrbitControls(camera, threeContainer);

			scene.add(camera, floorMesh, cubeCamera, sphere, cube, ico);

			const debugMaterial = new T.LineBasicMaterial({ vertexColors: true });
			const debugGeometry = new T.BufferGeometry();
			const debugLines = new T.LineSegments(debugGeometry, debugMaterial);
			scene.add(debugLines);

			const { vertices } = world.debugRender();

			// Prepare arrays to hold our 3D positions and vertex colors.
			const positions = [];
			const vertexColors = [];

			// Each line segment is defined by 4 numbers (x1, y1, x2, y2)
			// and each segment’s color is given by 8 numbers (r, g, b, a for each end).

			function getRandomColor() {
				// Generate a random hexadecimal color code
				const letters = '0123456789ABCDEF';
				let color = '#';
				for (let i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 16)];
				}
				return color;
			}
			const randomColor = getRandomColor();
			const randomThreeColor = new T.Color(randomColor);

			const numSegments = vertices.length / 4;

			for (let i = 0; i < numSegments; i++) {
				const x1 = vertices[i * 4];
				const y1 = vertices[i * 4 + 1];
				const x2 = vertices[i * 4 + 2];
				const y2 = vertices[i * 4 + 3];

				// Convert the 2D positions to 3D (here, we set z = 0).
				// Note: we also flip the y-axis to match the pixi example.
				positions.push(x1, -y1, 0);
				positions.push(x2, -y2, 0);

				// Use the same color for both endpoints.
				vertexColors.push(randomThreeColor.r, randomThreeColor.g, randomThreeColor.b);
				vertexColors.push(randomThreeColor.r, randomThreeColor.g, randomThreeColor.b);
			}

			// Update the geometry attributes.
			debugGeometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
			debugGeometry.setAttribute('color', new T.Float32BufferAttribute(vertexColors, 3));
			debugGeometry.attributes.position.needsUpdate = true;
			debugGeometry.attributes.color.needsUpdate = true;

			const animate = () => {
				sphere.visible = false;
				cubeCamera.position.copy(sphere.position);
				cubeCamera.update(renderer, scene);
				sphere.visible = true;

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
