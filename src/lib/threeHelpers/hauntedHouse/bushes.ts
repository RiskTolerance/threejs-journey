import * as THREE from 'three';
import { createSphere } from '$lib/threeHelpers/geometry';

import armImage from '$textures/bushes/leaves_forest_ground_arm_1k.jpg';
import diffuseImage from '$textures/bushes/leaves_forest_ground_diff_1k.jpg';
import normalImage from '$textures/bushes/leaves_forest_ground_nor_gl_1k.jpg';

export function createBushes(textureLoader: THREE.TextureLoader) {
	const bushGroup = new THREE.Group();

	const arm = textureLoader.load(armImage);
	const diffuse = textureLoader.load(diffuseImage);
	const normal = textureLoader.load(normalImage);

	const material = new THREE.MeshStandardMaterial({
		map: diffuse,
		aoMap: arm,
		roughnessMap: arm,
		metalnessMap: arm,
		normalMap: normal
	});

	const bushes: { size: number; position: [number, number, number] }[] = [
		{ size: 0.5, position: [1, 0.2, 2] },
		{ size: 0.6, position: [2, 0.2, 2] },
		{ size: 0.6, position: [1, 0.2, -2] },
		{ size: 0.4, position: [2, 0.2, -2] }
	];

	bushes.forEach(({ size, position }) => {
		const bush = createSphere(size, undefined, material);
		bush.position.set(...position);
		bushGroup.add(bush);
	});

	return bushGroup;
}
