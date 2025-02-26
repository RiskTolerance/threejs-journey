<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import {
		createScene,
		createCamera,
		createRenderer,
		createAxisHelper
	} from '$lib/threeHelpers/general';

	let threeContainer: HTMLElement | null = null;

	// fonts
	import { FontLoader } from 'three/addons/loaders/FontLoader.js';

	// TODO: add more geometry creation scripts
	import {
		createCapsule,
		createCone,
		createCube,
		createPlane,
		createSphere,
		createTorus,
		createTorusKnot,
		createTextMesh
	} from '$lib/threeHelpers/geometry';

	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

	import { setBasicDebug } from '$lib/threeHelpers/guis';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';
	import GUI from 'lil-gui';

	// import door images
	import doorColorImage from '$textures/door/color.jpg';
	import doorAlphaImage from '$textures/door/alpha.jpg';
	import doorAOImage from '$textures/door/ambientOcclusion.jpg';
	import doorHeightImage from '$textures/door/height.jpg';
	import doorMetalnessImage from '$textures/door/metalness.jpg';
	import doorNormalImage from '$textures/door/normal.jpg';
	import doorRoughnessImage from '$textures/door/roughness.jpg';
	// env maps

	// Font
	import fontGeo from '$lib/assets/fonts/Geo_Regular.json';
	import fontBumb from '$lib/assets/fonts/Bumbdesc_Regular.json';
	import fontVirt from '$lib/assets/fonts/VirtupetPixies_Medium.json';

	import environment from '$textures/environmentMap/4k.hdr';
	// matcaps
	import matcap1 from '$textures/matcaps/1.png';
	import matcap2 from '$textures/matcaps/2.png';
	import matcap3 from '$textures/matcaps/3.png';
	import matcap4 from '$textures/matcaps/4.png';
	import matcap5 from '$textures/matcaps/5.png';
	import matcap6 from '$textures/matcaps/6.png';
	import matcap7 from '$textures/matcaps/7.png';
	import matcap8 from '$textures/matcaps/8.png';
	// gradiants
	import gradient3 from '$textures/gradients/3.jpg';
	import gradient5 from '$textures/gradients/5.jpg';
	// other
	import checkerboard8 from '$textures/checkerboard-8x8.png';
	import checkerboard1024 from '$textures/checkerboard-1024x1024.png';
	import diamondBlock from '$textures/minecraft.png';

	type UI = {
		fullscreen: () => void;
	};

	const ui: UI = $state({
		fullscreen: () => {}
	});

	const onkeydown = (e: KeyboardEvent) => {
		console.log(e, e.key);
		// e.key === 'h' ? gui.show(gui._hidden) : gui.hide();
	};

	onMount(() => {
		const scene = createScene();
		const camera = createCamera(1, 2, 5);
		const renderer = createRenderer();
		const axisHelper = createAxisHelper(scene);
		const controls = new OrbitControls(camera, threeContainer);
		controls.enableDamping = true;

		const textureLoader = new THREE.TextureLoader();
		// assign door textures ---------------------------------------------
		const doorColor = textureLoader.load(doorColorImage);
		const doorAlpha = textureLoader.load(doorAlphaImage);
		const doorAO = textureLoader.load(doorAOImage);
		const doorHeight = textureLoader.load(doorHeightImage);
		const doorMetalness = textureLoader.load(doorMetalnessImage);
		const doorNormal = textureLoader.load(doorNormalImage);
		const doorRoughness = textureLoader.load(doorRoughnessImage);

		const matcap = textureLoader.load(matcap3);
		const gradiant = textureLoader.load(gradient3);

		const diamondBlockColor = textureLoader.load(diamondBlock);

		// load fonts
		const fontLoader = new FontLoader();
		const projectFont = fontLoader.parse(fontVirt);

		// set colorspace (for map and matcap) ------------------------------
		doorColor.colorSpace = THREE.SRGBColorSpace;
		matcap.colorSpace = THREE.SRGBColorSpace;

		ui.fullscreen = () => {
			if (threeContainer && !document.fullscreenElement) {
				threeContainer.requestFullscreen();
			} else if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				console.log('No element!');
			}
		};

		if (threeContainer) {
			threeContainer.appendChild(renderer.domElement);
		}

		const group = new THREE.Group();
		group.position.set(0, 0, 0);

		// door material setup
		const doorColorMat = new THREE.MeshStandardMaterial({ map: doorColor });
		const plane1 = createPlane(1, 1, undefined, doorColorMat);
		const p1m = plane1.material;
		p1m.side = THREE.DoubleSide;
		p1m.transparent = true;

		if (p1m instanceof THREE.MeshStandardMaterial) {
			p1m.alphaMap = doorAlpha;
			p1m.aoMapIntensity = 1.5;
			p1m.aoMap = doorAO;
			p1m.normalScale = new THREE.Vector2(2, 2);
			p1m.normalMap = doorNormal;
			p1m.displacementScale = 0.03;
			p1m.displacementMap = doorHeight;
			p1m.metalness = 0.8;
			p1m.metalnessMap = doorMetalness;
			p1m.roughness = 1;
			p1m.roughnessMap = doorRoughness;
		}

		// diamond block material
		diamondBlockColor.generateMipmaps = false;
		diamondBlockColor.magFilter = THREE.NearestFilter;
		const diamondBlockMat = new THREE.MeshStandardMaterial({ map: diamondBlockColor });
		diamondBlockMat.metalness = 2;
		const cube2 = createCube(1, 1, 1, undefined, diamondBlockMat);
		if (cube2.material instanceof THREE.MeshStandardMaterial) {
			cube2.material.metalness = 0.5;
			cube2.material.roughness = 0.1;
		}

		// standard material
		const genericBasicMat = new THREE.MeshBasicMaterial({
			color: 'green',
			wireframe: false,
			transparent: false,
			opacity: 1
		});

		// mesh normal material
		const genericMeshNormalMat = new THREE.MeshNormalMaterial();

		// mesh matcap material
		const genericMeshMatcapMat = new THREE.MeshMatcapMaterial({
			matcap: matcap,
			opacity: 0.5,
			transparent: true
		});

		// mesh phong material
		const genericMeshPhongMaterial = new THREE.MeshPhongMaterial({
			color: 'blue',
			shininess: 50,
			specular: new THREE.Color(0x188ff)
		});

		// mesh lambert material
		const genericMeshLambertMat = new THREE.MeshLambertMaterial();

		// mesh toon material
		gradiant.minFilter = THREE.NearestFilter;
		gradiant.magFilter = THREE.NearestFilter;
		const genericToonMaterial = new THREE.MeshToonMaterial({
			gradientMap: gradiant
		});

		const cone1 = createCone(0.5, 1, 16, undefined, genericBasicMat);
		const sphere1 = createSphere(0.75, undefined, genericMeshNormalMat);
		const cube3 = createCube(1, 1, 1, 'pink', genericMeshLambertMat);
		const torus1 = createTorus(1, 0.2, undefined, genericMeshMatcapMat);
		const torusKnot = createTorusKnot(0.4, 0.13, undefined, genericMeshPhongMaterial);
		const pill = createCapsule(0.25, 0.5, 'yellow', genericToonMaterial);
		const text = createTextMesh('Hello, Three', projectFont, undefined, genericMeshNormalMat);

		pill.position.y = -2.5;
		pill.rotateX(0.9);
		torusKnot.position.y = 2.5;
		sphere1.position.z = -3;
		cube2.position.x = 3;
		cube3.position.x = -3;
		cone1.position.z = 3;
		torus1.position.z = -3;

		text.position.x = 4;
		text.position.z = 4;

		// create the GUI,
		const gui = new GUI({
			width: 340,
			title: 'My Awesome Debugger',
			closeFolders: true
		});
		// create a folder for each object, grouping each object is necessary considering the number of variables we're adding.
		const cube2Tweaks = gui.addFolder('Cube 2');
		// pass the object to the debug
		setBasicDebug(cube2, 12, cube2Tweaks);
		const sphere1Tweaks = gui.addFolder('Sphere 1');
		setBasicDebug(sphere1, 12, sphere1Tweaks);
		const cone1Tweaks = gui.addFolder('Cone 1');
		setBasicDebug(cone1, 12, cone1Tweaks);

		// environment + HDR
		const rgbeLoader = new RGBELoader();
		rgbeLoader.load(environment, (envMap) => {
			envMap.mapping = THREE.EquirectangularRefractionMapping;
			scene.background = envMap;
			scene.environment = envMap;
		});
		// lights
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
		scene.add(ambientLight);

		const pointLight1 = new THREE.PointLight(0xffffff, 100);
		pointLight1.position.x = 4;
		scene.add(pointLight1);

		// add objects to scene -----------------------------------------
		group.add(plane1, sphere1, cube2, cube3, cone1, torus1, torusKnot, pill, text);
		scene.add(group);

		function animate() {
			renderer.render(scene, camera);
			controls.update();
			torus1.rotateX(0.005);
			torus1.rotateZ(0.0055);
			torus1.rotateX(0.0025);
			cube2.rotateZ(-0.005);
			cube3.rotateZ(0.005);
			cube3.rotateY(0.0025);
			cone1.rotateY(-0.005);
			pill.rotateY(0.005);
			pill.rotateX(0.004);
			// group.rotateY(0.001);
		}
		renderer.setAnimationLoop(animate);

		const onResize = () => {
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<svelte:window {onkeydown} />

<div class="relative h-screen w-full bg-black" id="three" bind:this={threeContainer}>
	<canvas class="pointer-events-none absolute h-0 w-0"></canvas>
	<div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full p-8 text-[#cc3]">
		<button class="pointer-events-auto" onclick={ui.fullscreen}>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
	</div>
</div>

<style>
	#three > canvas {
		z-index: 0;
		outline: none;
	}
</style>
