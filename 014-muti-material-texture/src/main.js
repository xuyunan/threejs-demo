import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入 hdr 加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// 学习使用纹理贴图，使用纹理加载器 THREE.TextureLoader() 加载文理
// 同样的方式，可以加载ao贴图，透明度贴图，光照贴图，高光贴图等 

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

// 创建纹理加载器
let textureLoader = new THREE.TextureLoader();

// 加载纹理
let texture = textureLoader.load("./texture/watercover/CityNewYork002_COL_VAR1_1K.png");

// 如果角色跟图片有色差，可能是颜色空间设置错了
// texture.colorSpace = THREE.LinearSRGBColorSpace;
texture.colorSpace = THREE.SRGBColorSpace;	

// 加载ao贴图, 环境遮罩
let aoMap = textureLoader.load("./texture/watercover/CityNewYork002_AO_1K.jpg");

// 透明度贴图
// let alphaMap = textureLoader.load("./texture/door/height.jpg");

// 光照贴图
let lightMap = textureLoader.load("./texture/colors.png");

// 高光贴图
let specularMap = textureLoader.load("./texture/watercover/CityNewYork002_GLOSS_1K.jpg");

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) =>  {
	// 设置球形贴图 !!!
	envMap.mapping = THREE.EquirectangularReflectionMapping;
	// 设置环境贴图
	scene.background = envMap;
	// 设置环境贴图
	scene.environment = envMap;
	// 设置plane的环境贴图
	planeMaterial.envMap = envMap;
});

// 创建几何体
let planeGeometry = new THREE.PlaneGeometry(1, 1);

// 创建材质, 需要用到纹理贴图
let planeMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	map: texture, // 方式一
	transparent: true, // 允许透明
	aoMap: aoMap, // 阴影，间隙处颜色显示深, 需要加载ao贴图
	// alphaMap: alphaMap,
	// lightMap: lightMap,
	reflectivity: 0.5,  // 反射强度
	specularMap: specularMap,	// 高光
});

// planeMaterial.map = texture	 // 方式二

// 带有材质的实体图形
let plane = new THREE.Mesh(planeGeometry, planeMaterial);

// 将网络添加到场景中
scene.add(plane);

// 设置相机位置
camera.position.z = 5;

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

let gui = new GUI();
gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name("ao贴图强度");

gui.add(texture, "colorSpace", {
	sRGB: THREE.SRGBColorSpace,
	Linear: THREE.LinearSRGBColorSpace,
}).onChange(() => {
	texture.needsUpdate = true;	// 动态更改颜色空间时，需要纹理动态调用下更新 !!!
})