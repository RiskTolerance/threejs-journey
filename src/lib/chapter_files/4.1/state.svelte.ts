import * as T from 'three';
import { DRACOLoader, GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js';
export interface ThreeState {
	loaded: boolean;
	container: HTMLDivElement | undefined;
	height: number | undefined;
	width: number | undefined;
	loadingManager: T.LoadingManager | undefined;
	renderer: T.WebGLRenderer | undefined;
	scene: T.Scene | undefined;
	camera: T.PerspectiveCamera | undefined;
	loaders: {
		gltf: GLTFLoader | undefined;
		draco: DRACOLoader | undefined;
		rgbe: RGBELoader | undefined;
		texture: T.TextureLoader | undefined;
	};
}

export const tState: ThreeState = $state({
	loaded: false,
	container: undefined,
	height: undefined,
	width: undefined,
	loadingManager: undefined,
	renderer: undefined,
	scene: undefined,
	camera: undefined,
	loaders: {
		// add any needed loaders here
		gltf: undefined,
		draco: undefined,
		rgbe: undefined,
		texture: undefined
	}
});
