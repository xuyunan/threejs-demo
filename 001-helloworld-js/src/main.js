import * as THREE from "three";

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

// 创建网络
const cube = new THREE.Mesh(geometry, material);

// 将网络添加到场景中
scene.add(cube);

// 设置相机位置
camera.position.z = 5;
camera.lookAt(0, 0, 0); // 默认就是看向原点

function animate() {
	requestAnimationFrame(animate);
	// 旋转
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	// 渲染
	render.render(scene, camera);
}

animate();