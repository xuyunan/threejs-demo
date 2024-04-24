import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 多个包围盒联合，也就是包围多个几何体

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

// 设置相机位置
camera.position.z = 15;
camera.position.x = 5;
camera.lookAt(0, 0, 0); // 默认就是看向原点

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建三个球
const sphere1 = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 32),
	new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
sphere1.position.x = -3
scene.add(sphere1)

const sphere2 = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 32),
	new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
sphere2.position.x = 0
scene.add(sphere2)

const sphere3 = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 32),
	new THREE.MeshBasicMaterial({ color: 0xff00ff })
)
sphere3.position.x = 3
scene.add(sphere3)

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


let box = new THREE.Box3();
let arrSphere = [ sphere1, sphere2, sphere3 ];

for (let i = 0; i < arrSphere.length; i++) {
	console.log(scene.children[i].name);
	// 第一种方式, 计算包围盒
	// 获取当前几何体的包围盒 
	// arrSphere[i].geometry.computeBoundingBox();
	// 获取包围盒
	// let box3 = arrSphere[i].geometry.boundingBox;
	// arrSphere[i].updateWorldMatrix(true, true);
	// 将包围盒转换到世界坐标系
	// box3.applyMatrix4(arrSphere[i].matrixWorld);

	// 第二种方式, 从Box获取包围盒
	let box3 = new THREE.Box3().setFromObject(arrSphere[i]);
	// 合并包围盒
	box.union(box3);
}

console.log(box);
// 创建包围盒辅助器
let boxHelper = new THREE.Box3Helper(box, 0xff0000);
scene.add(boxHelper);
