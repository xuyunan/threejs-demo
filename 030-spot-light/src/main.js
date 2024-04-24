import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

// 聚光灯

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
// render.physicallyCorrectLights = true;
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
	new THREE.PlaneGeometry(50, 50),
	new THREE.MeshStandardMaterial() // MeshBasicMaterial 接收不到阴影
);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 5, 设置物体接受阴影
plane.receiveShadow = true;
scene.add(plane);

// 灯光，环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

// 聚光灯光源
const spotLight = new THREE.SpotLight(0xffffff, 2);
// spotLight.intensity = 2;	// 亮度调节, 也就是初始化的第二个参数
spotLight.position.set(5, 5, 5);
// 设置光照投射阴影
spotLight.castShadow = true;
// 设置阴影贴图的模糊度
spotLight.shadow.radius = 20;
// 设置阴影相机的分辨率
spotLight.shadow.mapSize.set(4096, 4096);
spotLight.target = sphere;
spotLight.angle = Math.PI / 6;
spotLight.distance = 0;	// 光照距离
spotLight.penumbra = 0;	// 衰减, 中间亮，周围暗
spotLight.decay = 0;	// 距离的衰减

scene.add(spotLight);

const gui = new GUI();
gui.add(spotLight.position, "x").min(0).max(10).step(0.1);
gui.add(spotLight, "angle").min(0).max(Math.PI/2).step(0.01);
gui.add(spotLight, "distance").min(0).max(20).step(0.01);
gui.add(spotLight, "penumbra").min(0).max(1).step(0.01);
gui.add(spotLight, "decay").min(0).max(5).step(0.01);

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
