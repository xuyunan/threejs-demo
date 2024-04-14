// https://threejs.org/docs/index.html?q=euler#api/zh/math/Euler
// 欧拉角描述一个旋转变换, 通过指定轴或与轴的角度来旋转

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// 创建网络
let parentCube= new THREE.Mesh(geometry, parentMaterial);
const cube = new THREE.Mesh(geometry, material);
parentCube.add(cube)
parentCube.position.set(-3, 0, 0);
parentCube.rotation.x = Math.PI / 4	// 也会影响子元素

cube.position.set(3, 0, 0)	// 相对于父元素的坐标

// 绕x轴旋转
cube.rotation.x = Math.PI / 4

// 将网络添加到场景中
scene.add(parentCube);

// 设置相机位置
camera.position.z = 10;
camera.lookAt(0, 0, 0); // 默认就是看向原点

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, document.body);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置自动旋转
// controls.autoRotate = true;

function animate() {
	controls.update();
	requestAnimationFrame(animate);
	// 旋转
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
	// 渲染
	render.render(scene, camera);
}

animate();
