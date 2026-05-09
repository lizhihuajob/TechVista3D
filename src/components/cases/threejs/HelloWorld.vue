<template>
  <ThreejsCaseBase ref="caseBaseRef" @ready="onReady">
  </ThreejsCaseBase>
</template>

<script setup>
import { ref } from 'vue'
import * as THREE from 'three'
import ThreejsCaseBase from '../base/ThreejsCaseBase.vue'

const caseBaseRef = ref(null)
let cube = null

const onReady = ({ scene, camera, renderer, controls }) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00,
    metalness: 0.3,
    roughness: 0.4
  })
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  
  caseBaseRef.value.addLights()
  caseBaseRef.value.addGrid(10, 10)
  caseBaseRef.value.addAxes(3)
  
  camera.position.set(3, 3, 3)
  camera.lookAt(0, 0, 0)
  controls.update()
  
  caseBaseRef.value.startAnimation(updateScene)
}

const updateScene = () => {
  if (cube) {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }
}

defineExpose({
  getScreenshot: () => caseBaseRef.value?.takeScreenshot()
})
</script>

<style lang="scss" scoped>
</style>
