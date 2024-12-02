import * as THREE from 'three';

type MaterialTypes =
	| THREE.MeshBasicMaterial
	| THREE.MeshStandardMaterial
	| THREE.MeshNormalMaterial
	| THREE.MeshMatcapMaterial
	| THREE.MeshLambertMaterial
	| THREE.MeshPhongMaterial
	| THREE.MeshToonMaterial;

function isColorableMaterial(
	material: MaterialTypes
): material is
	| THREE.MeshBasicMaterial
	| THREE.MeshLambertMaterial
	| THREE.MeshPhongMaterial
	| THREE.MeshMatcapMaterial
	| THREE.MeshToonMaterial {
	return (
		material instanceof THREE.MeshBasicMaterial ||
		material instanceof THREE.MeshLambertMaterial ||
		material instanceof THREE.MeshPhongMaterial ||
		material instanceof THREE.MeshMatcapMaterial ||
		material instanceof THREE.MeshToonMaterial
	);
}

export function createCube(
	x: number,
	y: number,
	z: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
): THREE.Mesh {
	const geometry = new THREE.BoxGeometry(x, y, z);
	if (color && material && isColorableMaterial(material)) {
		material.color = new THREE.Color(color);
	}
	const surface: MaterialTypes = material || new THREE.MeshBasicMaterial({ color });

	const cube = new THREE.Mesh(geometry, surface);
	return cube;
}

export function createSphere(
	radius: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
): THREE.Mesh {
	const geometry = new THREE.SphereGeometry(radius);
	if (color && material && isColorableMaterial(material)) {
		material.color = new THREE.Color(color);
	}
	const surface: MaterialTypes = material || new THREE.MeshBasicMaterial({ color });
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
	if (color && material && isColorableMaterial(material)) {
		material.color = new THREE.Color(color);
	}
	const surface: MaterialTypes = material || new THREE.MeshBasicMaterial({ color });
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
	if (color && material && isColorableMaterial(material)) {
		material.color = new THREE.Color(color);
	}
	const surface: MaterialTypes = material || new THREE.MeshBasicMaterial({ color });
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
	if (color && material && isColorableMaterial(material)) {
		material.color = new THREE.Color(color);
	}
	const surface: MaterialTypes = material || new THREE.MeshBasicMaterial({ color });
	const plane = new THREE.Mesh(geometry, surface);
	return plane;
}

export function createTorusKnot(
	radius?: number,
	tubeRadius?: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
) {
	const geometry = new THREE.TorusKnotGeometry(radius ?? 1, tubeRadius ?? 0.4);
	if (color && material && isColorableMaterial(material)) {
		material.color = new THREE.Color(color);
	}
	const surface: MaterialTypes = material || new THREE.MeshBasicMaterial({ color });
	const torusKnot = new THREE.Mesh(geometry, surface);
	return torusKnot;
}

export function createCapsule(
	radius: number,
	length: number,
	color?: THREE.ColorRepresentation,
	material?: MaterialTypes
) {
	const geometry = new THREE.CapsuleGeometry(radius, length);
	if (color && material && isColorableMaterial(material)) {
		material.color = new THREE.Color(color);
	}
	const surface: MaterialTypes = material || new THREE.MeshBasicMaterial({ color });
	const mesh = new THREE.Mesh(geometry, surface);
	return mesh;
}
