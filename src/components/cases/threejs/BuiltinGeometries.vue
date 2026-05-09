<template>
  <ThreejsCaseBase ref="caseBaseRef" @ready="onReady">
  </ThreejsCaseBase>
</template>

<script setup>
import { ref } from 'vue'
import * as THREE from 'three'
import ThreejsCaseBase from '../base/ThreejsCaseBase.vue'

const caseBaseRef = ref(null)
const geometries = []

const onReady = ({ scene, camera, renderer, controls }) => {
  const geometryTypes = [
    { name: 'BoxGeometry', create: () => new THREE.BoxGeometry(1, 1, 1) },
    { name: 'SphereGeometry', create: () => new THREE.SphereGeometry(0.6, 32, 32) },
    { name: 'ConeGeometry', create: () => new THREE.ConeGeometry(0.6, 1, 32) },
    { name: 'CylinderGeometry', create: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32) },
    { name: 'TorusGeometry', create: () => new THREE.TorusGeometry(0.5, 0.2, 16, 100) },
    { name: 'TorusKnotGeometry', create: () => new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16) },
    { name: 'DodecahedronGeometry', create: () => new THREE.DodecahedronGeometry(0.6) },
    { name: 'IcosahedronGeometry', create: () => new THREE.IcosahedronGeometry(0.6) },
    { name: 'OctahedronGeometry', create: () => new THREE.OctahedronGeometry(0.6) },
    { name: 'TetrahedronGeometry', create: () => new THREE.TetrahedronGeometry(0.6) }
  ]
  
  const colors = [
    0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4,
    0xffeaa7, 0xff6b9d, 0xc44569, 0x6c5ce7,
    0x00b894, 0xfdcb6e
  ]
  
  geometryTypes.forEach((geoType, index) => {
    const geometry = geoType.create()
    const material = new THREE.MeshStandardMaterial({
      color: colors[index],
      metalness: 0.5,
      roughness: 0.3
    })
    
    const mesh = new THREE.Mesh(geometry, material)
    
    const row = Math.floor(index / 5)
    const col = index % 5
    
    mesh.position.set(
      (col - 2) * 2.5,
      row * 2.5,
      0
    )
    
    mesh.castShadow = true
    mesh.receiveShadow = true
    
    scene.add(mesh)
    geometries.push({ mesh, index })
  })
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)
  
  const pointLight = new THREE.PointLight(0xff6b6b, 1, 20)
  pointLight.position.set(-5, 3, -5)
  scene.add(pointLight)
  
  caseBaseRef.value.addGrid(30, 30)
  
  camera.position.set(8, 6, 12)
  camera.lookAt(0, 1, 0)
  controls.update()
  
  caseBaseRef.value.startAnimation(updateScene)
}

const updateScene = () => {
  geometries.forEach(({ mesh }) => {
    mesh.rotation.x += 0.005
    mesh.rotation.y += 0.01
  })
}

defineExpose({
  getScreenshot: () => caseBaseRef.value?.takeScreenshot()
})
</script>

<style lang="scss" scoped>
</style>
