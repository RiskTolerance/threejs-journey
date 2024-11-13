import * as THREE from 'three';

type MaterialTypes =
	| THREE.MeshBasicMaterial
	| THREE.MeshStandardMaterial
	| THREE.MeshStandardMaterial
	| THREE.MeshMatcapMaterial
	| THREE.MeshLambertMaterial
	| THREE.MeshPhongMaterial;

export function createCube(
	x: number,
	y: number,
	z: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
): THREE.Mesh {
	const geometry = new THREE.BoxGeometry(x, y, z);
	const surface: MaterialTypes = material ? material : new THREE.MeshBasicMaterial({ color });
	// the MeshStandardMaterial doesn't have the color property, so we need to be sure that surface is using MeshBasicMaterial before applying a color
	if (color && material && !(surface instanceof THREE.MeshStandardMaterial)) {
		surface.color = new THREE.Color(color);
	}

	const cube = new THREE.Mesh(geometry, surface);
	return cube;
}

export function createSphere(
	radius: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
): THREE.Mesh {
	const geometry = new THREE.SphereGeometry(radius);
	const surface: MaterialTypes = material ? material : new THREE.MeshBasicMaterial({ color });
	if (color && material && !(surface instanceof THREE.MeshStandardMaterial)) {
		surface.color = new THREE.Color(color);
	}
	const sphere = new THREE.Mesh(geometry, surface);
	return sphere;
}

export function createCone(
	radius: number,
	height: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
): THREE.Mesh {
	const geometry = new THREE.ConeGeometry(radius, height);
	const surface: MaterialTypes = material ? material : new THREE.MeshBasicMaterial({ color });
	if (color && material && !(surface instanceof THREE.MeshStandardMaterial)) {
		surface.color = new THREE.Color(color);
	}
	const cone = new THREE.Mesh(geometry, surface);
	return cone;
}

export function createTorus(
	radius: number,
	tubeRadius: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
): THREE.Mesh {
	const geometry = new THREE.TorusGeometry(radius, tubeRadius);
	const surface: MaterialTypes = material ? material : new THREE.MeshBasicMaterial({ color });
	if (color && material && !(surface instanceof THREE.MeshStandardMaterial)) {
		surface.color = new THREE.Color(color);
	}

	const torus = new THREE.Mesh(geometry, surface);
	return torus;
}

export function createPlane(
	width: number,
	height: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
) {
	const geometry = new THREE.PlaneGeometry(width, height, 80, 80);
	const surface: MaterialTypes = material ? material : new THREE.MeshBasicMaterial({ color });
	if (color && material && surface instanceof THREE.MeshStandardMaterial) {
		surface.color = new THREE.Color(color);
	}
	const plane = new THREE.Mesh(geometry, surface);
	return plane;
}
