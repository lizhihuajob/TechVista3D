<template>
  <div ref="containerRef" class="threejs-case-container">
    <div class="case-controls" v-if="showControls">
      <button @click="resetCamera" class="control-btn">重置视角</button>
      <button @click="toggleAnimation" class="control-btn">
        {{ isAnimating ? '暂停' : '播放' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const props = defineProps({
  showControls: { type: Boolean, default: true },
  autoPlay: { type: Boolean, default: true }
})

const emit = defineEmits(['ready'])

const containerRef = ref(null)
const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)
const controls = shallowRef(null)
const isAnimating = ref(props.autoPlay)
let animationId = null

const initScene = (options = {}) => {
  const {
    cameraPosition = { x: 5, y: 5, z: 5 },
    fov = 75,
    near = 0.1,
    far = 1000,
    antialias = true,
    alpha = false,
    backgroundColor = 0x1a1a2e
  } = options

  const container = containerRef.value
  if (!container) return

  scene.value = new THREE.Scene()
  scene.value.background = new THREE.Color(backgroundColor)

  const { clientWidth, clientHeight } = container
  camera.value = new THREE.PerspectiveCamera(fov, clientWidth / clientHeight, near, far)
  camera.value.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

  renderer.value = new THREE.WebGLRenderer({ antialias, alpha })
  renderer.value.setSize(clientWidth, clientHeight)
  renderer.value.setPixelRatio(window.devicePixelRatio)
  renderer.value.shadowMap.enabled = true
  renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.value.domElement)

  controls.value = new OrbitControls(camera.value, renderer.value.domElement)
  controls.value.enableDamping = true
  controls.value.dampingFactor = 0.05
  controls.value.screenSpacePanning = false
  controls.value.minDistance = 1
  controls.value.maxDistance = 100

  const handleResize = () => {
    const { clientWidth, clientHeight } = container
    camera.value.aspect = clientWidth / clientHeight
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(clientWidth, clientHeight)
  }
  window.addEventListener('resize', handleResize)

  emit('ready', { scene: scene.value, camera: camera.value, renderer: renderer.value, controls: controls.value })

  return { scene: scene.value, camera: camera.value, renderer: renderer.value, controls: controls.value }
}

const startAnimation = (customUpdate) => {
  isAnimating.value = true
  
  const animate = () => {
    if (!isAnimating.value) return
    
    animationId = requestAnimationFrame(animate)
    
    if (controls.value) {
      controls.value.update()
    }
    
    if (customUpdate && typeof customUpdate === 'function') {
      customUpdate()
    }
    
    if (renderer.value && scene.value && camera.value) {
      renderer.value.render(scene.value, camera.value)
    }
  }
  
  animate()
}

const stopAnimation = () => {
  isAnimating.value = false
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const toggleAnimation = () => {
  if (isAnimating.value) {
    stopAnimation()
  } else {
    startAnimation()
  }
}

const resetCamera = () => {
  if (camera.value && controls.value) {
    camera.value.position.set(5, 5, 5)
    controls.value.target.set(0, 0, 0)
    controls.value.update()
  }
}

const addLights = (options = {}) => {
  if (!scene.value) return
  
  const {
    ambientColor = 0xffffff,
    ambientIntensity = 0.5,
    directionalColor = 0xffffff,
    directionalIntensity = 1,
    directionalPosition = { x: 5, y: 10, z: 5 }
  } = options
  
  const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity)
  scene.value.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity)
  directionalLight.position.set(directionalPosition.x, directionalPosition.y, directionalPosition.z)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.value.add(directionalLight)
  
  return { ambientLight, directionalLight }
}

const addGrid = (size = 20, divisions = 20) => {
  if (!scene.value) return
  
  const gridHelper = new THREE.GridHelper(size, divisions, 0x444444, 0x222222)
  scene.value.add(gridHelper)
  return gridHelper
}

const addAxes = (size = 5) => {
  if (!scene.value) return
  
  const axesHelper = new THREE.AxesHelper(size)
  scene.value.add(axesHelper)
  return axesHelper
}

const takeScreenshot = (format = 'image/png', quality = 1.0) => {
  if (!renderer.value) return null
  
  if (renderer.value && scene.value && camera.value) {
    renderer.value.render(scene.value, camera.value)
  }
  
  return renderer.value.domElement.toDataURL(format, quality)
}

onUnmounted(() => {
  stopAnimation()
  
  if (renderer.value && containerRef.value) {
    containerRef.value.removeChild(renderer.value.domElement)
    renderer.value.dispose()
  }
  
  if (controls.value) {
    controls.value.dispose()
  }
})

defineExpose({
  initScene,
  startAnimation,
  stopAnimation,
  toggleAnimation,
  resetCamera,
  addLights,
  addGrid,
  addAxes,
  takeScreenshot,
  scene,
  camera,
  renderer,
  controls,
  isAnimating
})
</script>

<style lang="scss" scoped>
.threejs-case-container {
  position: relative;
  width: 100%;
  min-height: 400px;
  background: $bg-secondary;
  border-radius: $border-radius-lg;
  overflow: hidden;
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.case-controls {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  display: flex;
  gap: $spacing-sm;
  z-index: 10;
}

.control-btn {
  padding: $spacing-sm $spacing-md;
  background: rgba($primary-color, 0.8);
  color: white;
  border: none;
  border-radius: $border-radius;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: $primary-color;
    transform: translateY(-2px);
  }
}
</style>
