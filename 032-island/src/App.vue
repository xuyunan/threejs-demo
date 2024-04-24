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

let screenDom = ref(null);

onMounted(() => {
	// 创建场景
	let scene = new THREE.Scene();
	// 创建相机
	let camera = new THREE.PerspectiveCamera(75, screenDom.value.clientWidth / screenDom.value.clientHeight, 0.1, 2000);
	camera.position.set(-50, 50, 130);
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
	let controls = new OrbitControls(camera, renderer.domElement);
	// 设置阻尼
	controls.enableDamping = true;

	// 创建一个巨大的天空球体
	let texture = new THREE.TextureLoader().load("./textures/sky.jpg");
	const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
	const skyMaterial = new THREE.MeshBasicMaterial({
		map: texture,
	});
	skyGeometry.scale(1, 1, -1);
	const sky = new THREE.Mesh(skyGeometry, skyMaterial);

	scene.add(sky);

	// 视频纹理
	const video = document.createElement("video");
	video.src = "./textures/sky.mp4";
	video.loop = true;

	window.addEventListener("click", (e) => {
		// 当鼠标移动的时候播放视频
		// 判断视频是否处于播放状态
		if (video.paused) {
			video.play();
			let texture = new THREE.VideoTexture(video);
			skyMaterial.map = texture;
			skyMaterial.map.needsUpdate = true;
		}
	});

	// 载入环境纹理hdr
	const hdrLoader = new RGBELoader();
	hdrLoader.loadAsync("./assets/050.hdr").then((texture) => {
		texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.background = texture;
		scene.environment = texture;
	});

	// 添加平行光
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(-100, 100, 10);
	scene.add(light);

	// 创建水面
	const waterGeometry = new THREE.CircleGeometry(300, 64);
	const water = new Water(waterGeometry, {
		textureWidth: 1024,
		textureHeight: 1024,
		color: 0xeeeeff,
		flowDirection: new THREE.Vector2(1, 1),
		scale: 1,
	});
	water.position.y = 3;
	// 水面旋转至水平
	water.rotation.x = -Math.PI / 2;
	scene.add(water);

	// 添加小岛模型
	// 实例化gltf载入库
	const loader = new GLTFLoader();
	// 实例化draco载入库
	const dracoLoader = new DRACOLoader();
	// 添加draco载入库
	dracoLoader.setDecoderPath("./draco/");
	// 添加draco载入库
	loader.setDRACOLoader(dracoLoader);

	loader.load("./model/island2.glb", (gltf) => {
		scene.add(gltf.scene);
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
