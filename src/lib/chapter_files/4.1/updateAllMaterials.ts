import * as T from 'three';

export const updateAllMaterials = (scene: T.Scene) => {
	scene.traverse((child: T.Object3D<T.Object3DEventMap>) => {
		if (child.type === 'Mesh') {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
};
