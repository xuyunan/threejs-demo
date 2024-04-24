import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入draco加载器 用于解压，压缩了的资源文件, draco 德古拉
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// 边缘几何体和线框几何体

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

// 线性雾 给场景添加雾 系数线性增长 near to far
// scene.fog = new THREE.Fog(0x999999, 0.1, 50);
// 指数雾 给场景添加雾 系数指数增长
// scene.fog = new THREE.FogExp2(0x999999, 0.1);	// 指数雾增长的更快
scene.background = new THREE.Color(0x999999); // 背景色跟雾一致，才比较逼真!!!

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


// 实例化加载器gltf
const gltfLoader = new GLTFLoader();
gltfLoader.load(
	// 模型路径
	"./model/duck.glb", // b表示转换为了二进制, tf结尾的是json格式数据
	(gltf) => {
		// console.log(gltf);
		scene.add(gltf.scene);
	}
);

// 注意：需要将解压器的代码找出来，放到./draco目录，以便使用
// 文件位置 three/examples/jsm/libs/draco

// 实例化加载器 draco
const dracoLoader = new DRACOLoader();
// 设置 draco 路径
dracoLoader.setDecoderPath("./draco/");
// 给 gltf 加载器关联 draco 解码器
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
	// 模型路径
	"./model/city.glb", // b表示转换为了二进制, tf结尾的是json格式数据
	(gltf) => {
		// console.log(gltf);
		// scene.add(gltf.scene);

		gltf.scene.traverse(child => {
			if (child.isMesh) {
				let building = child;
				let geometry = building.geometry;
		
				// 获取边缘geometry
				let edgesGeometry = new THREE.EdgesGeometry(geometry);
				// 创建线段材质
				let edgesMaterial = new THREE.LineBasicMaterial({
					color: 0xffffff,
				});
		
				// 获取线框geometry
				// let edgesGeometry = new THREE.WireframeGeometry(geometry);
		
				// 创建线段
				let edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
		
				// 更新建筑物的世界转换矩阵，确保其最新的位置和方向信息已被计算。
				building.updateWorldMatrix(true, true);
				// 将建筑物的世界转换矩阵复制给线段对象，以确保线段与建筑物保持相同的位置和方向。
				edges.matrix.copy(building.matrixWorld);
				// 将线段对象的矩阵分解为位置、旋转和缩放三个部分，以确保线段正确地呈现在场景中。
				edges.matrix.decompose(edges.position, edges.quaternion,edges.scale);
				// 添加到场景
				scene.add(edges);
			}
		});
	}
);

// 加载环境贴图
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (evnMap) => {
	evnMap.mapping = THREE.EquirectangularReflectionMapping;
	scene.environment = evnMap;
});
