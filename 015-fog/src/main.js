import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 练习场景雾的使用 scene.fog

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	45, // 视角
	window.innerWidth / window.innerHeight, // 宽高比
	0.1, // 近平面
	1000 // 远平面
);

const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(render.domElement);

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 100);

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 创建网络
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0); // 相对于父元素的坐标

// 将网络添加到场景中
scene.add(cube);

// 线性雾 给场景添加雾 系数线性增长 near to far
// scene.fog = new THREE.Fog(0x999999, 0.1, 50);
// 指数雾 给场景添加雾 系数指数增长
scene.fog = new THREE.FogExp2(0x999999, 0.1);	// 指数雾增长的更快
scene.background = new THREE.Color(0x999999);	// 背景色跟雾一致，才比较逼真!!!

// 设置相机位置
camera.position.z = 10;
camera.position.x = 5;
camera.lookAt(0, 0, 0); // 默认就是看向原点

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, render.domElement);

// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;

function animate() {
	controls.update();
	requestAnimationFrame(animate);
	render.render(scene, camera);
}

animate();
