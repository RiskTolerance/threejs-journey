import * as THREE from 'three';

export function createCube(
	x: number,
	y: number,
	z: number,
	color: THREE.ColorRepresentation
): THREE.Mesh {
	const geometry = new THREE.BoxGeometry(x, y, z);
	const material = new THREE.MeshBasicMaterial({ color });
	const cube = new THREE.Mesh(geometry, material);
	return cube;
}

export function createSphere(radius: number, color: THREE.ColorRepresentation): THREE.Mesh {
	const geometry = new THREE.SphereGeometry(radius);
	const material = new THREE.MeshBasicMaterial({ color });
	const sphere = new THREE.Mesh(geometry, material);
	return sphere;
}

export function createCone(
	radius: number,
	height: number,
	color: THREE.ColorRepresentation
): THREE.Mesh {
	const geometry = new THREE.ConeGeometry(radius, height);
	const material = new THREE.MeshBasicMaterial({ color });
	const cone = new THREE.Mesh(geometry, material);
	return cone;
}
