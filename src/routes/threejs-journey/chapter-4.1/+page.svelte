<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as T from 'three';
	import { DRACOLoader, GLTFLoader, OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
	import GUI from 'lil-gui';
	import Fullscreen from '$lib/components/icons/Fullscreen.svelte';

	// loaded state
	import { tState } from '$lib/chapter_files/4.1/state.svelte';
	// fullscreen function (linked to tState in function file)
	import { setup, updateAllMaterials, fullscreen } from '$lib/chapter_files/4.1/utils';
	onMount(() => {
		// run setup function - this will create state for the scene
		setup().then((res) => {
			if (tState.renderer && tState.container && tState.renderer && tState.scene) {
				// tone mapping
				tState.renderer.toneMapping = T.ReinhardToneMapping;
				tState.renderer.toneMappingExposure = 1.5;
				tState.renderer.shadowMap.enabled = true;
				tState.renderer.shadowMap.type = T.PCFSoftShadowMap;

				const gui = new GUI({
					container: tState.container,
					width: 340,
					title: 'Debug',
					closeFolders: true
				});
				gui.domElement.classList.add('absolute', 'top-0', 'right-0');
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
