import * as THREE from 'three';
import GUI from 'lil-gui';

// Type guard to check if the geometry has parameters
function hasParameters(
	geometry: THREE.BufferGeometry
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): geometry is THREE.BufferGeometry & { parameters: Record<string, any> } {
	return 'parameters' in geometry;
}

// Mapping each geometry type to its relevant subdivision parameter keys
const subdivisionParameterMapping: Record<string, string[]> = {
	_BoxGeometry: ['widthSegments', 'heightSegments', 'depthSegments'],
	_SphereGeometry: ['widthSegments', 'heightSegments'],
	_CylinderGeometry: ['radialSegments', 'heightSegments'],
	_ConeGeometry: ['radialSegments', 'heightSegments'],
	_TorusGeometry: ['radialSegments', 'tubularSegments'],
	_PlaneGeometry: ['widthSegments', 'heightSegments'],
	_CircleGeometry: ['segments'],
	_DodecahedronGeometry: ['detail'],
	_IcosahedronGeometry: ['detail'],
	_OctahedronGeometry: ['detail'],
	_TetrahedronGeometry: ['detail'],
	_RingGeometry: ['thetaSegments', 'phiSegments'],
	_TorusKnotGeometry: ['radialSegments', 'tubularSegments'],
	_ExtrudeGeometry: ['steps'],
	_LatheGeometry: ['segments']
};

export function setBasicDebug(mesh: THREE.Mesh, displacementClamp: number, folder?: GUI) {
	// Ensure `geometryType` is treated as a constructor function
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const geometryType = mesh.geometry.constructor as new (...args: any[]) => THREE.BufferGeometry;

	const geometryParameters = hasParameters(mesh.geometry) ? { ...mesh.geometry.parameters } : {};
	const geometryName = geometryType.name;
	const relevantParams = subdivisionParameterMapping[geometryName] || [];
	const initialSegments =
		relevantParams.length > 0 && geometryParameters[relevantParams[0]] !== undefined
			? geometryParameters[relevantParams[0]]
			: 2;

	if (
		(mesh.material instanceof THREE.MeshBasicMaterial ||
			mesh.material instanceof THREE.MeshStandardMaterial) &&
		hasParameters(mesh.geometry)
	) {
		const materialColor = mesh.material;

		type DebugObject = {
			color: THREE.Color;
			spinFunction: () => void;
			subdivisions: number;
		};

		const debugObject: DebugObject = {
			color: materialColor.color,
			spinFunction: () => {},
			subdivisions: initialSegments
		};

		const base =
			folder ||
			new GUI({
				width: 300,
				title: 'GUI',
				closeFolders: true
			});

		// Position, rotation, scale, and visibility controls
		base
			.add(
				mesh.position,
				'x',
				mesh.position.x - displacementClamp,
				mesh.position.x + displacementClamp,
				0.01
			)
			.name('horizontal');
		base
			.add(
				mesh.position,
				'y',
				mesh.position.y - displacementClamp,
				mesh.position.y + displacementClamp,
				0.01
			)
			.name('vertical');
		base
			.add(
				mesh.position,
				'z',
				mesh.position.z - displacementClamp,
				mesh.position.z + displacementClamp,
				0.01
			)
			.name('depth');
		base.add(mesh.rotation, 'x', -Math.PI, Math.PI, 0.01).name('rotateX');
		base.add(mesh.rotation, 'y', -Math.PI, Math.PI, 0.01).name('rotateY');
		base.add(mesh.rotation, 'z', -Math.PI, Math.PI, 0.01).name('rotateZ');
		base.add(mesh.scale, 'x', 0.1, 5, 0.1).name('scaleX');
		base.add(mesh.scale, 'y', 0.1, 5, 0.1).name('scaleY');
		base.add(mesh.scale, 'z', 0.1, 5, 0.1).name('scaleZ');
		base.add(mesh, 'visible');
		base.add(mesh.material, 'wireframe');
		base.addColor(debugObject, 'color').onChange(() => {
			if (
				mesh.material instanceof THREE.MeshBasicMaterial ||
				mesh.material instanceof THREE.MeshStandardMaterial
			) {
				mesh.material.color.set(debugObject.color);
			}
		});

		// Subdivision control, adjusted based on geometry type
		base
			.add(debugObject, 'subdivisions', 1, initialSegments + 20, 1)
			.onFinishChange((value: number) => {
				debugObject.subdivisions = value; // Update subdivision value
				mesh.geometry.dispose();

				// Update only the relevant parameters for the geometry type
				relevantParams.forEach((param) => {
					geometryParameters[param] = debugObject.subdivisions;
				});

				// Dynamically recreate geometry with updated segments
				const newGeometry = new geometryType(...Object.values(geometryParameters));
				mesh.geometry = newGeometry;
			});
	} else {
		console.warn(
			'Material does not have a color property or mesh does not have constructable properties!'
		);
	}
}
