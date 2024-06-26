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
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const material3 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material4 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const material5 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// 创建网络
const cube = new THREE.Mesh(geometry, [material, material1, material2, material3, material4, material5]);
cube.position.set(0, 0, 0); // 相对于父元素的坐标


// 将网络添加到场景中
scene.add(cube);

// 设置相机位置
camera.position.z = 10;
camera.lookAt(0, 0, 0); // 默认就是看向原点

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
// const controls = new OrbitControls(camera, document.body);
const controls = new OrbitControls(camera, render.domElement);

// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置自动旋转
// controls.autoRotate = true;

function animate() {
	controls.update();
	requestAnimationFrame(animate);
	// 渲染
	render.render(scene, camera);
}

animate();
