import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入 hdr 加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";

// 顶点的位移，旋转，缩放操作

const scene = new THREE.Scene();

// 透视相机
const camera = new THREE.PerspectiveCamera(
	45, // 视角
	window.innerWidth / window.innerHeight, // 宽高比
	0.1, // 近平面
	1000 // 远平面
);

const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(render.domElement);

let uvTextture = new THREE.TextureLoader().load("./texture/uv_grid_opengl.jpg")

// 创建几何体
const geometry = new THREE.BufferGeometry();
// 创建材质
const material = new THREE.MeshBasicMaterial({
	map: uvTextture,
	side: THREE.DoubleSide,
})

// 顶点组，3个一组
const vertices = new Float32Array([
	-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0
]);

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// 创建索引, 数组内为点的索引, 连接成面
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
// 设置索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1));
 
// 设置uv坐标
const uv = new Float32Array([
	0, 0, 1, 0, 1, 1, 0, 1
])
// 设置uv属性
geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2))

// 方式一
// 计算出法向量
// geometry.computeVertexNormals();

// 方式二
// 设置法向量
const normals = new Float32Array([
	0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1
])

// 创建法向量属性
geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));

geometry.translate(0, 0, 0);
geometry.rotateX(Math.PI / 2);
geometry.scale(3, 3, 3);

// 创建网络
const plane = new THREE.Mesh(geometry, material);
plane.position.x = 0

// 将网络添加到场景中
scene.add(plane);

//创建法向量辅助器
const helper = new VertexNormalsHelper(plane, 0.5, 0xff0000);
scene.add(helper);

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
	material.envMap = envMap;
});
