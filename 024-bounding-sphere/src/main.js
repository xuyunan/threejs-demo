import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// 几何体居中与获取几何体中心, 还有包围球

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
camera.position.z = 10;
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


// 实例化加载器gltf
const gltfLoader = new GLTFLoader();
gltfLoader.load(
	// 模型路径
	"./model/duck.glb", // b表示转换为了二进制, tf结尾的是json格式数据
	(gltf) => {
		console.log(gltf);
		scene.add(gltf.scene);

		// 首先找到物体
		let duckMesh = gltf.scene.getObjectByName("LOD3spShape")
		let duckGeometry = duckMesh.geometry
		// 计算包围盒
		duckGeometry.computeBoundingBox();
		// 设置几何体居居中
		duckGeometry.center();
		// 获取dock的包围盒
		let duckBox = duckGeometry.boundingBox;
		// 更新世界矩阵，同步缩放，不同步的话，在有变换的情况下，盒子可能很大
		duckMesh.updateWorldMatrix(true, true);
		// 更新包围盒
		duckBox.applyMatrix4(duckMesh.matrixWorld);

		// 获取包围盒中心
		let center = duckBox.getCenter(new THREE.Vector3());
		console.log(center)

		// 创建包围盒辅助器
		let boxHelper = new THREE.Box3Helper(duckBox, 0xff0000);
		scene.add(boxHelper);

		console.log("duckBox: ", duckBox);
		console.log("duckMesh: ", duckMesh)


		// 获取包围球 
		let duckSphere = duckGeometry.boundingSphere;
		duckSphere.applyMatrix4(duckMesh.matrixWorld);

		console.log(duckSphere);
		// 创建包围球辅助器, // 后面两个参数是，横向和纵向的线段的多少, 越多，球的网线越密
		let sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16);	
		let sphereMaterial = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: true,
		});
		let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphereMesh.position.copy(duckSphere.center);
		scene.add(sphereMesh);
	}
);

// 加载环境贴图
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (evnMap) => {
	evnMap.mapping = THREE.EquirectangularReflectionMapping;
	// 设置环境贴图
	scene.environment = evnMap;
	scene.background = evnMap;
});
