import * as THREE from "/three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Остальной код без изменений

// Создаем сцену
const scene = new THREE.Scene();

// Создаем камеру
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Создаем рендерер
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Добавляем оси для наглядности
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Добавляем свет
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

// Загружаем текстуры
const textureLoader = new THREE.TextureLoader();
const bumpTexture = textureLoader.load("src/textures/Bumpp.jpg");
const colorTexture = textureLoader.load("src/textures/Color_new.jpg");
const logoTexture = textureLoader.load("src/textures/logo.jpg");
const logoColorTexture = textureLoader.load("src/textures/logo-color.jpg");
const reflectTexture = textureLoader.load("src/textures/reflect.jpg");

// Загружаем модель FBX
const loader = new FBXLoader();
let mixer;

loader.load("src/casket_05.fbx", (fbx) => {
  // Применяем текстуры к материалам модели
  fbx.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Применяем текстуры к материалам
      child.material.map = colorTexture;
      child.material.bumpMap = bumpTexture;
      child.material.logoMap = logoTexture;
      child.material.logoColorMap = logoColorTexture;
      child.material.reflectMap = reflectTexture;

      // Настройки текстур, можно настроить под ваши требования
      child.material.bumpScale = 0.2;
    }
  });

  mixer = new THREE.AnimationMixer(fbx);

  // Добавляем анимации
  fbx.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });

  scene.add(fbx);
});

// Добавляем управление орбитой
const controls = new OrbitControls(camera, renderer.domElement);

// Обновляем анимацию
function animate() {
  requestAnimationFrame(animate);

  if (mixer) {
    mixer.update(0.01); // Время прошедшее с предыдущего кадра
  }

  controls.update();

  renderer.render(scene, camera);
}

// Реагируем на изменение размера окна
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Запускаем анимацию
animate();
