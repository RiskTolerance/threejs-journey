import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    return scene;
}

export function createCamera(x: number, y: number, z: number) {
    const camera = new THREE.PerspectiveCamera(
 	   75,
 	   window.innerWidth / window.innerHeight,
 	   0.1,
 	   100
    );
    camera.position.set(x, y, z);
    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return renderer;
}

export function createCube(x: number, y: number, z: number, color: THREE.ColorRepresentation) {
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
}

export function createAxisHelper(scene: THREE.Scene) {
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);
    return axesHelper;
}
