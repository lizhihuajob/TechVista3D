<template>
  <div ref="containerRef" class="cesium-case-container">
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
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const props = defineProps({
  showControls: { type: Boolean, default: true },
  autoPlay: { type: Boolean, default: true },
  accessToken: { type: String, default: '' }
})

const emit = defineEmits(['ready'])

const containerRef = ref(null)
const viewer = shallowRef(null)
const isAnimating = ref(props.autoPlay)
let preRenderListener = null

const initViewer = (options = {}) => {
  const container = containerRef.value
  if (!container) return

  if (props.accessToken) {
    Cesium.Ion.defaultAccessToken = props.accessToken
  }

  const defaultOptions = {
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: true,
    geocoder: true,
    homeButton: true,
    sceneModePicker: true,
    navigationHelpButton: true,
    animation: true,
    timeline: true,
    fullscreenButton: true,
    vrButton: false
  }

  const mergedOptions = { ...defaultOptions, ...options }
  
  viewer.value = new Cesium.Viewer(container, mergedOptions)
  
  viewer.value.scene.globe.depthTestAgainstTerrain = true
  
  emit('ready', { viewer: viewer.value, scene: viewer.value.scene, camera: viewer.value.camera })
  
  return { viewer: viewer.value, scene: viewer.value.scene, camera: viewer.value.camera }
}

const resetCamera = () => {
  if (viewer.value) {
    viewer.value.camera.flyHome(2)
  }
}

const flyToLocation = (longitude, latitude, height = 10000, duration = 3) => {
  if (!viewer.value) return
  
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
    duration: duration,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0
    }
  })
}

const addEntity = (entityOptions) => {
  if (!viewer.value) return null
  return viewer.value.entities.add(entityOptions)
}

const removeEntity = (entity) => {
  if (!viewer.value) return
  viewer.value.entities.remove(entity)
}

const addImageryLayer = (provider) => {
  if (!viewer.value) return null
  return viewer.value.imageryLayers.addImageryProvider(provider)
}

const addPoint = (longitude, latitude, options = {}) => {
  const defaultOptions = {
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    }
  }
  
  return addEntity({ ...defaultOptions, ...options })
}

const addLabel = (longitude, latitude, text, options = {}) => {
  const defaultOptions = {
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
    label: {
      text: text,
      font: '14px sans-serif',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10)
    }
  }
  
  return addEntity({ ...defaultOptions, ...options })
}

const startAnimation = (customUpdate) => {
  isAnimating.value = true
  
  if (preRenderListener) {
    viewer.value.scene.preRender.removeEventListener(preRenderListener)
  }
  
  if (customUpdate && typeof customUpdate === 'function') {
    preRenderListener = () => {
      if (!isAnimating.value) return
      customUpdate()
    }
    viewer.value.scene.preRender.addEventListener(preRenderListener)
  }
}

const stopAnimation = () => {
  isAnimating.value = false
}

const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
}

const takeScreenshot = (format = 'image/png') => {
  if (!viewer.value) return null
  return viewer.value.scene.canvas.toDataURL(format)
}

onUnmounted(() => {
  stopAnimation()
  
  if (preRenderListener && viewer.value) {
    viewer.value.scene.preRender.removeEventListener(preRenderListener)
  }
  
  if (viewer.value) {
    viewer.value.destroy()
  }
})

defineExpose({
  initViewer,
  resetCamera,
  flyToLocation,
  addEntity,
  removeEntity,
  addImageryLayer,
  addPoint,
  addLabel,
  startAnimation,
  stopAnimation,
  toggleAnimation,
  takeScreenshot,
  viewer,
  isAnimating
})
</script>

<style lang="scss" scoped>
.cesium-case-container {
  position: relative;
  width: 100%;
  min-height: 500px;
  background: $bg-secondary;
  border-radius: $border-radius-lg;
  overflow: hidden;
  
  :deep(.cesium-viewer) {
    width: 100%;
    height: 100%;
  }
  
  :deep(.cesium-viewer-bottom) {
    display: none;
  }
}

.case-controls {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  display: flex;
  gap: $spacing-sm;
  z-index: 1000;
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
