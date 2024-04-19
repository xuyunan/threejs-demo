import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入补间动画
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

// tween动画

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
camera.position.y = 2;
camera.position.x = 2;
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
	TWEEN.update();
	requestAnimationFrame(animate);
	render.render(scene, camera);
}

animate();


// 创建球
const sphere1 = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 32),
	new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
sphere1.position.x = -4
scene.add(sphere1)

const tween = new TWEEN.Tween(sphere1.position);
tween.to({ x: 4 }, 1000)
// 设置循环次数，Infinity 无数次
tween.repeat(Infinity)
// 设置循环往复 		
tween.yoyo(true)
// 每次启动动画，延迟毫秒数
tween.delay(50)	// 可以避免闪烁
// 设置缓动函数
tween.easing(TWEEN.Easing.Quadratic.InOut)

// tween.onUpdate(() =>  {
// 	console.log(sphere1.position.x)
// })

// const tween2 = new TWEEN.Tween(sphere1.position);
// tween2.to({ x: -4 }, 1000)

// 链接动画
// tween.chain(tween2);
// tween2.chain(tween)

// 启动补间动画 
tween.start();

// tween.onStart(() => {
// 	console.log("开始")
// })

// tween.onComplete(() => {
// 	console.log("结束")
// })

// tween.onStop(() => {
// 	console.log("停止")
// })

// tween.onUpdate(() => {
// 	console.log("更新")
// })

let params = {
	stop: function () {
		tween.stop();
	}
}

const gui = new GUI()
gui.add(params, "stop");

