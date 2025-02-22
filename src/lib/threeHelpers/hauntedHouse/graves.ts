import * as THREE from 'three';

// import grave image textures
import diffuseImage from '$textures/graves/plastered_stone_wall_diff_1k.jpg';
import armImage from '$textures/graves/plastered_stone_wall_arm_1k.jpg';
import normalImage from '$textures/graves/plastered_stone_wall_nor_gl_1k.jpg';

export function createGraves(textureLoader: THREE.TextureLoader) {
	const group = new THREE.Group();

	const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);

	const color = textureLoader.load(diffuseImage);
	const arm = textureLoader.load(armImage);
	const normal = textureLoader.load(normalImage);

	const graveMaterial = new THREE.MeshStandardMaterial({
		map: color,
		aoMap: arm,
		roughnessMap: arm,
		metalnessMap: arm,
		normalMap: normal
	});

	for (let i = 0; i < 30; i++) {
		const grave = new THREE.Mesh(graveGeometry, graveMaterial);

		const angle = Math.random() * Math.PI * 2;
		const radius = 3 + Math.random() * 4;
		const x = Math.sin(angle) * radius;
		const z = Math.cos(angle) * radius;

		grave.position.x = x;
		grave.position.z = z;
		grave.position.y = Math.random() * 0.4;

		grave.rotation.x = (Math.random() - 0.5) * 0.4;
		grave.rotation.y = Math.PI / 2 + (Math.random() - 0.5);
		grave.rotation.z = (Math.random() - 0.5) * 0.4;

		group.add(grave);
	}

	return group;
}
