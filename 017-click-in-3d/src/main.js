import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 三维场景的点击事件, 原理是通过射线相交，来确认是否点中
// 从鼠标点击的地方，发出射线
// 注意: 浏览器的坐标需要转换一下

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

// 创建射线
const raycaster = new THREE.Raycaster();
// 创建鼠标向量
const mouse = new THREE.Vector2();

// 需要将浏览器的坐标，转换为场景坐标, 视频中有解释
window.addEventListener("click", event => {
	// 设置鼠标
	mouse.x =  (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	console.log(mouse.x, mouse.y)

	// 通过摄像头和鼠标位置更新射线
	raycaster.setFromCamera(mouse, camera);

	// 计算物体和射线的焦点
	const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);

	if (intersects.length > 0) {
		if (intersects[0].object._isSelect) {
			intersects[0].object.material.color.set(
				intersects[0].object._originColor
			)
			intersects[0].object._isSelect = false;
			return
		}

		intersects[0].object._isSelect = true;
		intersects[0].object._originColor = intersects[0].object.material.color.getHex();
		intersects[0].object.material.color.set(0xff0000)
	}
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


