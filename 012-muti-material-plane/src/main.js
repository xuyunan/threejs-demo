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
const geometry = new THREE.BufferGeometry();

// 顶点组，3个一组
const vertices = new Float32Array([
	-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0
]);

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// 创建索引, 数组内为点的索引, 连接成面
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
// 设置索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

 // 设置两个顶点组，形成两个材质
 geometry.addGroup(0, 3, 0);
 geometry.addGroup(3, 3, 1);
 
// console.log(geometry);

// 创建材质
const material = new THREE.MeshBasicMaterial({ 
	color: 0x00ff00, 
	side: THREE.DoubleSide, // 显示两面
	// wireframe: true
 });

 const material1 = new THREE.MeshBasicMaterial({ 
	color: 0xff0000, 
	side: THREE.DoubleSide, // 显示两面
	// wireframe: true
 });

// 创建网络
const plane = new THREE.Mesh(geometry, [material, material1]);

// 将网络添加到场景中
scene.add(plane);

// 设置相机位置
camera.position.z = 10;

// 默认就是看向原点
camera.lookAt(0, 0, 0);

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
	// 渲染
	render.render(scene, camera);
}

animate();
