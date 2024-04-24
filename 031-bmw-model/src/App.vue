<script setup>
import { onMounted, reactive, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

let controls;
let canvasDom = ref(null);

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

// 创建渲染器
const render = new THREE.WebGLRenderer({
	// 抗锯齿
	antialias: true,
});
render.setSize(window.innerWidth, window.innerHeight);

const renderScene = () => {
	render.render(scene, camera);
	controls && controls.update();
	requestAnimationFrame(renderScene);
};

let wheels = [];
let carBody, frontCar, hoodCar, glassCar;

// 创建材质
const bodyMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xff0000,
	metalness: 1,
	roughness: 0.5,
	clearcoat: 1,
	clearcoatRoughness: 0,
});

const frontMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xff0000,
	metalness: 1,
	roughness: 0.5,
	clearcoat: 1,
	clearcoatRoughness: 0,
});

const hoodMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xff0000,
	metalness: 1,
	roughness: 0.5,
	clearcoat: 1,
	clearcoatRoughness: 0,
});

const wheelsMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xff0000,
	metalness: 1,
	roughness: 0.1,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xffffff,
	metalness: 0,
	roughness: 0,
	transmission: 1,
	transparent: true,
});

let colors = ["red", "blue", "green", "gray", "orange", "purple"];

let selectColor = (index) => {
	bodyMaterial.color.set(colors[index]);
	frontMaterial.color.set(colors[index]);
	hoodMaterial.color.set(colors[index]);
	wheelsMaterial.color.set(colors[index]);
	// glassMaterial.color.set(colors[index]);
};

let materials = [
	{ name: "磨砂", value: 1 },
	{ name: "冰晶", value: 0 },
];

let selectMaterial = (index) => {
	bodyMaterial.clearcoatRoughness = materials[index].value;
	frontMaterial.clearcoatRoughness = materials[index].value;
	hoodMaterial.clearcoatRoughness = materials[index].value;
};

onMounted(() => {
	// 把渲染器插入dom中
	canvasDom.value.appendChild(render.domElement);
	// 初始化渲染器，渲染背景
	render.setClearColor("#000");
	scene.background = new THREE.Color("#ccc");
	scene.environment = new THREE.Color("#ccc");
	renderScene();

	// 添加网格地面
	const gridHelper = new THREE.GridHelper(10, 10);
	gridHelper.material.opacity = 0.2;
	gridHelper.material.transparent = true;
	scene.add(gridHelper);

	// 添加控制器
	controls = new OrbitControls(camera, render.domElement);

	// 载入gltf汽车模型
	const gltfLoader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath("./draco/");
	gltfLoader.setDRACOLoader(dracoLoader);
	gltfLoader.load("./model/bmw01.glb", (gltf) => {
		const bmw = gltf.scene;
		// console.log(bmw);
		bmw.traverse((child) => {
			if (child.isMesh) {
				// console.log(child.name);
			}

			// 判断是否是轮毂
			if (child.isMesh && child.name.includes("轮毂")) {
				child.material = wheelsMaterial;
				wheels.push(child);
			}
			// 判断是否是车身
			if (child.isMesh && child.name.includes("Mesh002")) {
				child.material = bodyMaterial;
				carBody = child;
			}
			// 判断是否是前脸
			if (child.isMesh && child.name.includes("前脸")) {
				child.material = frontMaterial;
				frontCar = child;
			}

			// 判断是否是引擎盖
			if (child.isMesh && child.name.includes("引擎盖")) {
				child.material = hoodMaterial;
				hoodCar = child;
			}

			// 判断是否是挡风玻璃
			if (child.isMesh && child.name.includes("挡风玻璃")) {
				child.material = glassMaterial;
				glassCar = child;
			}
		});
		scene.add(bmw);
	});

	// 添加灯光
	const light1 = new THREE.DirectionalLight(0xffffff, 1);
	light1.position.set(0, 0, 10);
	scene.add(light1);

	const light2 = new THREE.DirectionalLight(0xffffff, 1);
	light2.position.set(0, 0, -10);
	scene.add(light2);

	const light3 = new THREE.DirectionalLight(0xffffff, 1);
	light3.position.set(10, 0, 0);
	scene.add(light3);

	const light4 = new THREE.DirectionalLight(0xffffff, 1);
	light4.position.set(-10, 0, 0);
	scene.add(light4);

	const light5 = new THREE.DirectionalLight(0xffffff, 1);
	light5.position.set(0, 10, 0);
	scene.add(light5);

	const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
	light6.position.set(5, 10, 0);
	scene.add(light6);

	const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
	light7.position.set(0, 10, 5);
	scene.add(light7);

	const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
	light8.position.set(0, 10, -5);
	scene.add(light8);

	const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
	light9.position.set(-5, 10, 0);
	scene.add(light9);
});
</script>

<template>
	<div class="home">
		<div class="convas-container" ref="canvasDom"></div>

		<div class="home-content">
			<div class="home-content-title">
				<h1>汽车展示与选配</h1>
			</div>
			<h2>选择车身颜色</h2>
			<div class="select">
				<div class="select-item" v-for="(item, index) in colors" :key="index" @click="selectColor(index)">
					<div class="select-item-color" :style="{ backgroundColor: item }"></div>
				</div>
			</div>

			<h2>选择贴膜材质</h2>

			<div class="select">
				<div class="select-item" v-for="(item, index) in materials" :key="index" @click="selectMaterial(index)">
					<div class="select-item-text">{{ item.name }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>

.home-content {
	position: fixed;
	top: 0;
	right: 20px;
}

.select-item-color {
	width: 50px;
	height: 50px;
	border: 1px solid #ccc;
	margin: 10px;
	display: inline-block;
	cursor: pointer;
	border-radius: 10px;
}

.select {
	display: flex;
}
</style>
