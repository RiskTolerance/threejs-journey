import * as THREE from 'three';

export function createCube(
	x: number,
	y: number,
	z: number,
	color?: THREE.ColorRepresentation,
	material?: THREE.Material
): THREE.Mesh {
	const geometry = new THREE.BoxGeometry(x, y, z);
	const surface = material ? material : new THREE.MeshBasicMaterial({ color });
	const cube = new THREE.Mesh(geometry, surface);
	return cube;
}

export function createSphere(
	radius: number,
	color?: THREE.ColorRepresentation,
	material?: THREE.Material
): THREE.Mesh {
	const geometry = new THREE.SphereGeometry(radius);
	const surface = material ? material : new THREE.MeshBasicMaterial({ color });
	const sphere = new THREE.Mesh(geometry, surface);
	return sphere;
}

export function createCone(
	radius: number,
	height: number,
	color?: THREE.ColorRepresentation,
	material?: THREE.Material
): THREE.Mesh {
	const geometry = new THREE.ConeGeometry(radius, height);
	const surface = material ? material : new THREE.MeshBasicMaterial({ color });
	const cone = new THREE.Mesh(geometry, surface);
	return cone;
}

export function createTorus(
	radius: number,
	tubeRadius: number,
	color?: THREE.ColorRepresentation,
	material?: THREE.Material
): THREE.Mesh {
	const geometry = new THREE.TorusGeometry(radius, tubeRadius);
	const surface = material ? material : new THREE.MeshBasicMaterial({ color });
	const torus = new THREE.Mesh(geometry, surface);
	return torus;
}
