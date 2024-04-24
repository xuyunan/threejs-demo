<script setup>
import * as THREE from "three";
import { ref, onMounted, onUnmounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Reflector } from "three/examples/jsm/objects/Reflector";

// 添加视频纹理, 反射

let screenDom = ref(null);

onMounted(() => {
	// 创建场景
	let scene = new THREE.Scene();
	// 创建相机
	let camera = new THREE.PerspectiveCamera(75, screenDom.value.clientWidth / screenDom.value.clientHeight, 0.1, 1000);
	camera.position.set(0, 1.5, 6);
	// 创建渲染器
	let renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight);
	screenDom.value.appendChild(renderer.domElement);
	// 创建辅助坐标轴
	// let axes = new THREE.AxesHelper(5);
	// scene.add(axes);
	// 添加控制器
	let controls = new OrbitControls(camera, renderer.domElement);
	// 设置阻尼
	controls.enableDamping = true;

	// 创建rgbe加载器
	const textureLoader = new THREE.TextureLoader();
	const bgTexture = textureLoader.load("./assets/hdr.jpg");
	bgTexture.mapping = THREE.EquirectangularRefractionMapping;
	scene.background = bgTexture;
	scene.environment = bgTexture;

	// 添加环境光
	const ambient = new THREE.AmbientLight(0xffffff, 2);
	scene.add(ambient);

	// 加载小熊
	const gltfLoader = new GLTFLoader();
	gltfLoader.load("./assets/bear.gltf", (gltf) => {
		const model = gltf.scene.children[0];

		// Phong 冯式算法材质，明暗处理算法的一种，水晶材质
		model.material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			envMap: bgTexture,
			refractionRatio: 0.7,	// 折射率
			reflectivity: 0.8,		// 反射率
		});
		scene.add(model);
	});

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();

	// 监听画面变化，更新渲染画面
	window.addEventListener("resize", () => {
		//   console.log("画面变化了");
		// 更新摄像头
		camera.aspect = window.innerWidth / window.innerHeight;
		//   更新摄像机的投影矩阵
		camera.updateProjectionMatrix();

		//   更新渲染器
		renderer.setSize(window.innerWidth, window.innerHeight);
		//   设置渲染器的像素比
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
