<script setup>
import * as THREE from "three";
import { ref, onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Reflector } from "three/examples/jsm/objects/Reflector";
// 导入水面
import { Water } from "three/examples/jsm/objects/Water2";
import gsap from 'gsap';

let screenDom = ref(null);

onMounted(() => {
	// 创建场景
	let scene = new THREE.Scene();
	// 创建相机
	let camera = new THREE.PerspectiveCamera(45, screenDom.value.clientWidth / screenDom.value.clientHeight, 0.1, 100000);
	camera.position.set(0, 0, 10);
	// 创建渲染器
	let renderer = new THREE.WebGLRenderer({
		antialias: true,
		logarithmicDepthBuffer: true, // 对数深度缓冲区
	});
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight);
	screenDom.value.appendChild(renderer.domElement);
	// 创建辅助坐标轴
	// let axes = new THREE.AxesHelper(5);
	// scene.add(axes);
	// 添加控制器
	// let controls = new OrbitControls(camera, renderer.domElement);
	// 设置阻尼
	// controls.enableDamping = true;

	// 创建星空的背景
	let url = "./assets/25s.jpg";
	let envTexture = new THREE.TextureLoader().load(url);
	envTexture.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = envTexture;
	scene.environment = envTexture;

	// 添加灯光
	let light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 0, 1);
	scene.add(light);
	let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
	light2.position.set(0, 0, -1);
	scene.add(light2);
	let light3 = new THREE.AmbientLight(0xffffff, 0.5);
	light3.position.set(-1, 1, 1);
	scene.add(light3);

	// 添加小岛模型
	// 实例化gltf载入库
	const loader = new GLTFLoader();
	// 实例化draco载入库
	const dracoLoader = new DRACOLoader();
	// 添加draco载入库
	dracoLoader.setDecoderPath("./draco/");
	// 添加draco载入库
	loader.setDRACOLoader(dracoLoader);

	loader.load("./model/xz.glb", (gltf) => {
		gltf.scene.scale.set(0.1, 0.1, 0.1);
		gltf.scene.position.set(3, 0, 0);
		scene.add(gltf.scene);

		window.addEventListener("mousemove", (e) => {
			let x = (e.clientX / window.innerWidth) * 2 - 1;
			let y = (e.clientY / window.innerHeight) * 2 - 1;

			let timeline = gsap.timeline();
			timeline.to(gltf.scene.rotation, {
				duration: 0.5,
				x: y,
				y: x,
				duration: 1,
			});
		});
	});

	loader.load("./model/moon.glb", (gltf) => {
		let moon = gltf.scene.children[0];
		for (let j = 0; j < 10; j++) {
			let moonInstance = new THREE.InstancedMesh(moon.geometry, moon.material, 100);

			// scene.add(moon);
			for (let i = 0; i < 100; i++) {
				let x = Math.random() * 1000 - 500;
				let y = Math.random() * 1000 - 500;
				let z = Math.random() * 1000 - 500;

				// 3D变换矩阵, 改变大小，位置，然后应用到一个个mesh上
				let matrix = new THREE.Matrix4();
				let size = Math.random() * 20 - 8;
				matrix.makeScale(size, size, size);
				matrix.makeTranslation(x, y, z);
				moonInstance.setMatrixAt(i, matrix);
			}

			gsap.to(moonInstance.position, {
				duration: Math.random() * 10 + 2,
				z: -1000,
				ease: "linear",
				repeat: -1,
			});
			scene.add(moonInstance);
		}
	});

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();

	// 监听画面变化，更新渲染画面
	window.addEventListener("resize", () => {
		// console.log("画面变化了");
		// 更新摄像头
		camera.aspect = window.innerWidth / window.innerHeight;
		//   更新摄像机的投影矩阵
		camera.updateProjectionMatrix();

		// 更新渲染器
		renderer.setSize(window.innerWidth, window.innerHeight);
		// 设置渲染器的像素比
		renderer.setPixelRatio(window.devicePixelRatio);
	});
});
</script>

<template>
	<div class="canvas-container" ref="screenDom"></div>
</template>

<style>
.canvas-container {
	width: 100vw;
	height: 100vh;
}
</style>
