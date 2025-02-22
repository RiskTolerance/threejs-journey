import * as THREE from 'three';
import { createCube, createCone, createPlane } from '$lib/threeHelpers/geometry';
// import door textures
import doorColorImage from '$textures/door/color.jpg';
import doorAlphaImage from '$textures/door/alpha.jpg';
import doorAOImage from '$textures/door/ambientOcclusion.jpg';
import doorHeightImage from '$textures/door/height.jpg';
import doorMetalnessImage from '$textures/door/metalness.jpg';
import doorNormalImage from '$textures/door/normal.jpg';
import doorRoughnessImage from '$textures/door/roughness.jpg';
// import wall textures
import wallAoRoughMetalImage from '$textures/walls/mossy_brick_arm_1k.jpg';
import wallDiffuseImage from '$textures/walls/mossy_brick_diff_1k.jpg';
import wallNormalImage from '$textures/walls/mossy_brick_nor_gl_1k.jpg';
// import roof textures
import roofAoRoughMetalImage from '$textures/roof/grey_roof_tiles_arm_1k.jpg';
import roofDiffuseImage from '$textures/roof/grey_roof_tiles_diff_1k.jpg';
import roofNormalImage from '$textures/roof/grey_roof_tiles_nor_gl_1k.jpg';
import roofBumpImage from '$textures/roof/grey_roof_tiles_bump_1k.jpg';

export function createHouse(textureLoader: THREE.TextureLoader) {
	const group = new THREE.Group();

	// Load door textures
	const doorColor = textureLoader.load(doorColorImage);
	doorColor.colorSpace = THREE.SRGBColorSpace;
	const doorAlpha = textureLoader.load(doorAlphaImage);
	const doorAO = textureLoader.load(doorAOImage);
	const doorHeight = textureLoader.load(doorHeightImage);
	const doorMetalness = textureLoader.load(doorMetalnessImage);
	const doorNormal = textureLoader.load(doorNormalImage);
	const doorRoughness = textureLoader.load(doorRoughnessImage);

	const doorMaterial = new THREE.MeshStandardMaterial({
		map: doorColor,
		alphaMap: doorAlpha,
		aoMap: doorAO,
		normalMap: doorNormal,
		displacementMap: doorHeight,
		displacementScale: 0.03,
		metalnessMap: doorMetalness,
		roughnessMap: doorRoughness,
		side: THREE.DoubleSide,
		transparent: true
	});

	// Load roof textures
	const textureRotation = 25;
	const roofColor = textureLoader.load(roofDiffuseImage);
	roofColor.colorSpace = THREE.SRGBColorSpace;
	roofColor.wrapS = THREE.RepeatWrapping;
	roofColor.wrapT = THREE.RepeatWrapping;
	roofColor.repeat.set(4, 2);
	roofColor.rotation = textureRotation;
	const roofArm = textureLoader.load(roofAoRoughMetalImage);
	roofArm.wrapS = THREE.RepeatWrapping;
	roofArm.wrapT = THREE.RepeatWrapping;
	roofArm.repeat.set(4, 2);
	roofArm.rotation = textureRotation;
	const roofNormal = textureLoader.load(roofNormalImage);
	roofNormal.rotation = textureRotation;
	roofNormal.repeat.set(4, 2);
	roofNormal.wrapS = THREE.RepeatWrapping;
	roofNormal.wrapT = THREE.RepeatWrapping;
	const roofBump = textureLoader.load(roofBumpImage);
	roofBump.rotation = textureRotation;
	roofBump.repeat.set(4, 2);
	roofBump.wrapS = THREE.RepeatWrapping;
	roofBump.wrapT = THREE.RepeatWrapping;

	const roofMaterial = new THREE.MeshStandardMaterial({
		map: roofColor,
		aoMap: roofArm,
		roughnessMap: roofArm,
		metalnessMap: roofArm,
		normalMap: roofNormal,
		bumpMap: roofBump
	});

	// load wall textures
	const wallColor = textureLoader.load(wallDiffuseImage);
	wallColor.wrapS = THREE.RepeatWrapping;
	wallColor.wrapT = THREE.RepeatWrapping;
	wallColor.repeat.set(2, 2);
	wallColor.colorSpace = THREE.SRGBColorSpace;
	const wallArm = textureLoader.load(wallAoRoughMetalImage);
	wallArm.wrapS = THREE.RepeatWrapping;
	wallArm.wrapT = THREE.RepeatWrapping;
	wallArm.repeat.set(2, 2);
	const wallNormal = textureLoader.load(wallNormalImage);
	wallNormal.repeat.set(2, 2);
	wallNormal.wrapS = THREE.RepeatWrapping;
	wallNormal.wrapT = THREE.RepeatWrapping;

	const wallMaterial = new THREE.MeshStandardMaterial({
		map: wallColor,
		aoMap: wallArm,
		roughnessMap: wallArm,
		metalnessMap: wallArm,
		normalMap: wallNormal
	});

	const walls = createCube(4, 2.5, 4, undefined, wallMaterial);
	walls.castShadow = true;
	const roof = createCone(3.2, 2, 4, undefined, roofMaterial);
	roof.castShadow = true;
	const door = createPlane(2, 2, undefined, doorMaterial);
	door.castShadow = true;
	walls.position.y = 1.25;
	roof.position.y = 3.5;
	roof.rotateY(Math.PI * 0.25);
	door.position.set(2.0001, 1, 0);
	door.rotateY(Math.PI * 0.5);

	group.add(walls, roof, door);
	return group;
}
