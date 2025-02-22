import * as THREE from 'three';
import floorAlpha from '$textures/floor/alpha.jpg';
import floorAoRoughMetal from '$textures/floor/brown_mud_leaves_01_arm_1k.jpg';
import floorDiffuse from '$textures/floor/brown_mud_leaves_01_diff_1k.jpg';
import floorDisplace from '$textures/floor/brown_mud_leaves_01_disp_1k.jpg';
import floorNormal from '$textures/floor/brown_mud_leaves_01_nor_gl_1k.jpg';

export function createFloor() {
	const textureLoader = new THREE.TextureLoader();
	const alpha = textureLoader.load(floorAlpha);
	const normal = textureLoader.load(floorNormal);
	normal.repeat.set(8, 8);
	normal.wrapS = THREE.RepeatWrapping;
	normal.wrapT = THREE.RepeatWrapping;

	const diffuse = textureLoader.load(floorDiffuse);
	diffuse.colorSpace = THREE.SRGBColorSpace;
	diffuse.repeat.set(8, 8);
	diffuse.wrapS = THREE.RepeatWrapping;
	diffuse.wrapT = THREE.RepeatWrapping;

	const aoRoughnessMetal = textureLoader.load(floorAoRoughMetal);
	aoRoughnessMetal.repeat.set(8, 8);
	aoRoughnessMetal.wrapS = THREE.RepeatWrapping;
	aoRoughnessMetal.wrapT = THREE.RepeatWrapping;

	const displace = textureLoader.load(floorDisplace);
	displace.repeat.set(8, 8);
	displace.wrapS = THREE.RepeatWrapping;
	displace.wrapT = THREE.RepeatWrapping;

	const geo = new THREE.PlaneGeometry(20, 20, 500, 500);
	const mat = new THREE.MeshStandardMaterial({
		alphaMap: alpha,
		transparent: true,
		map: diffuse,
		aoMap: aoRoughnessMetal,
		roughnessMap: aoRoughnessMetal,
		metalnessMap: aoRoughnessMetal,
		normalMap: normal,
		displacementMap: displace,
		displacementScale: 0.1,
		displacementBias: -0.01
	});
	const plane = new THREE.Mesh(geo, mat);

	plane.rotation.x = -Math.PI * 0.5;
	return plane;
}
