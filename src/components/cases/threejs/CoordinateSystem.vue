<template>
  <ThreejsCaseBase ref="caseBaseRef" @ready="onReady">
  </ThreejsCaseBase>
</template>

<script setup>
import { ref } from 'vue'
import * as THREE from 'three'
import ThreejsCaseBase from '../base/ThreejsCaseBase.vue'

const caseBaseRef = ref(null)

const onReady = ({ scene, camera, renderer, controls }) => {
  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
  scene.add(gridHelper)
  
  const axesHelper = new THREE.AxesHelper(10)
  scene.add(axesHelper)
  
  const createAxisLabel = (text, position, color) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 64
    canvas.height = 64
    
    ctx.fillStyle = color
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 32, 32)
    
    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(material)
    sprite.position.copy(position)
    sprite.scale.set(1, 1, 1)
    
    return sprite
  }
  
  scene.add(createAxisLabel('X', new THREE.Vector3(10.5, 0, 0), '#ff0000'))
  scene.add(createAxisLabel('Y', new THREE.Vector3(0, 10.5, 0), '#00ff00'))
  scene.add(createAxisLabel('Z', new THREE.Vector3(0, 0, 10.5), '#0000ff'))
  
  const createCube = (color, position) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ 
      color: color,
      metalness: 0.3,
      roughness: 0.4
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.copy(position)
    cube.castShadow = true
    cube.receiveShadow = true
    return cube
  }
  
  const cube1 = createCube(0xff0000, new THREE.Vector3(0, 0.5, 0))
  const cube2 = createCube(0x00ff00, new THREE.Vector3(2, 0.5, 2))
  const cube3 = createCube(0x0000ff, new THREE.Vector3(-2, 0.5, -2))
  
  scene.add(cube1)
  scene.add(cube2)
  scene.add(cube3)
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)
  
  camera.position.set(8, 8, 8)
  camera.lookAt(0, 0, 0)
  controls.update()
  
  caseBaseRef.value.startAnimation()
}

defineExpose({
  getScreenshot: () => caseBaseRef.value?.takeScreenshot()
})
</script>

<style lang="scss" scoped>
</style>
