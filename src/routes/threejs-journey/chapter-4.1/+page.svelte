<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as T from 'three';
	import GUI from 'lil-gui';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';
	import { tState } from '$lib/chapter_files/4.1/state.svelte';
	import { setup, updateAllMaterials, fullscreen } from '$lib/chapter_files/4.1/utils';

	// shader imports
	import vertexShader from '$lib/chapter_files/4.1/shaders/vertex.vert?raw';
	import fragmentShader from '$lib/chapter_files/4.1/shaders/fragment.frag?raw';

	let gui: any;

	onMount(() => {
		// run setup function - this will create state for the scene
		setup().then((res) => {
			// if res contains an error
			if (tState.renderer && tState.container && tState.scene) {
				const { container, renderer, scene } = tState;

				const geometry = new T.PlaneGeometry(1, 1, 32, 32);
				const count = geometry.attributes.position.count;
				const randoms = new Float32Array(count);
				for (let i = 0; i < count; i++) {
					randoms[i] = Math.random();
				}
				geometry.setAttribute('aRandom', new T.BufferAttribute(randoms, 1));

				const material = new T.RawShaderMaterial({
					vertexShader,
					fragmentShader,
					side: T.DoubleSide,
					uniforms: {
						uFrequency: { value: new T.Vector2(10, 5) },
						uTime: { value: 0 }
					}
				});
				const mesh = new T.Mesh(geometry, material);
				scene.add(mesh);

				gui = new GUI({
					container: container,
					width: 340,
					title: 'Debug',
					closeFolders: true
				});
				gui.domElement.classList.add('absolute', 'top-0', 'right-0');
				gui
					.add(material.uniforms.uFrequency.value, 'x')
					.min(0)
					.max(20)
					.step(0.01)
					.name('frequencyX');
				gui
					.add(material.uniforms.uFrequency.value, 'y')
					.min(0)
					.max(20)
					.step(0.01)
					.name('frequencyY');
			}
		});

		$effect(() => {
			if (tState.loaded && tState.scene) {
				updateAllMaterials(tState.scene);
			}
		});

		// Events
		window.addEventListener('resize', () => {
			if (!tState.container) return;
			tState.height = tState?.container?.offsetHeight;
			tState.width = tState?.container?.offsetWidth;
			if (tState.width && tState.height && tState.camera && tState.renderer) {
				tState.camera.aspect = tState.width / tState.height;
				tState.camera.updateProjectionMatrix();
				tState.renderer.setSize(tState.width, tState.height);
			}
		});
	});

	onDestroy(() => {
		if (tState.renderer && tState.container) {
			tState.renderer.dispose();
			tState.container.removeChild(tState.renderer.domElement);
			gui.destroy();
		}
	});
</script>

<div
	class="relative flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-clip [&>canvas]:h-[calc(100vh-56px)]"
	bind:this={tState.container}
>
	<div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full p-8">
		<button
			class="pointer-events-auto"
			onclick={() =>
				tState.container ? fullscreen() : console.log('threejs element does not exsit')}
		>
			<Fullscreen width="24" height="24" stroke="white"></Fullscreen>
		</button>
		<div
			class="z-100 absolute left-0 top-0 h-full w-full items-center justify-center bg-black {!tState.loaded
				? 'hidden'
				: 'flex'}"
		>
			<div class="flex animate-pulse items-center gap-2 text-2xl text-white">
				Loading <span
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-loader-circle animate-spin"
						><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg
					></span
				>
			</div>
		</div>
	</div>
</div>
