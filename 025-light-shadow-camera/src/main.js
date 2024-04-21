import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

// 平行光阴影属性与阴影相机原理

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	45, // 视角
	window.innerWidth / window.innerHeight, // 宽高比
	0.1, // 近平面
	1000 // 远平面
);

const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);
// 2, 设置渲染开启阴影的计算
render.shadowMap.enabled = true;
document.body.appendChild(render.domElement);

// 设置相机位置
camera.position.z = 15;
camera.lookAt(0, 0, 0); // 默认就是看向原点

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建个球
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 20), new THREE.MeshStandardMaterial());
// 4, 设置物体投射阴影
sphere.castShadow = true;
scene.add(sphere);

// 创建个平面, 来接受阴影
const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial() // MeshBasicMaterial 接收不到阴影
);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 5, 设置物体接受阴影
plane.receiveShadow = true;
scene.add(plane);

// 灯光，环境光
const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
scene.add(light);

// 直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
// 3, 设置光照投射阴影
directionalLight.castShadow = true;
// 设置阴影贴图的模糊度
directionalLight.shadow.radius = 20;
// 设置阴影相机的分辨率
directionalLight.shadow.mapSize.set(4096, 4096);

// 设置平行光投射相机的属性
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;

scene.add(directionalLight);

const gui = new GUI();
gui
	.add(directionalLight.shadow.camera, "near")
	.min(0)
	.max(10)
	.step(0.5)
	.onChange(() => {
		// 光影相机属性更改之后，需要更新投影矩阵
		directionalLight.shadow.camera.updateProjectionMatrix();
	});

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
