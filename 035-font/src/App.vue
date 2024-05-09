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
// 导入FontLoader
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
// 导入TextGeometry
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// 创建场景
let scene = new THREE.Scene();
// 设置场景背景色为蓝色
scene.background = new THREE.Color(0x666666);
// 创建相机
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);

camera.position.set(0, 50, 800);
// 创建渲染器
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// 将画布添加到页面中
document.body.appendChild(renderer.domElement);

// 创建控制器
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const animate = () => {
	renderer.render(scene, camera);
	controls && controls.update();
	requestAnimationFrame(animate);
};

onMounted(() =>{
  animate()
})

// 加载字体
const loader = new FontLoader();
loader.load('fonts/Tutumianhuatang_Bold.json', font => {
  const geometry = new TextGeometry( '你好世界', {
		font: font,
		size: 80,
		depth: 5,
		curveSegments: 12,  // 曲线分段数
		bevelEnabled: true, // 是否启用斜角
		bevelThickness: 10, // 斜角厚度
		bevelSize: 8,// 斜角大小
		bevelOffset: 0,
		bevelSegments: 5
	} );
  geometry.center();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xeeeeff,
    roughness: 0,
    reflectivity: 1,
    thickness: 60,
    ior: 1.5,
    side: THREE.DoubleSide,
    transmission: 1,
  })

  const mesh = new THREE.Mesh(geometry,  material);
  scene.add(mesh);

  // 创建环境光对象
let ambientLight = new THREE.AmbientLight(0xffffff, 1); // 颜色和强度

// 将环境光添加到场景中
scene.add(ambientLight);
})

</script>

<template>

</template>

<style scoped>


canvas {
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
}
</style>
