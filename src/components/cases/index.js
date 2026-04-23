const threejsCases = {
  'hello-world': () => import('./threejs/HelloWorld.vue'),
  'coordinate-system': () => import('./threejs/CoordinateSystem.vue'),
  'builtin-geometries': () => import('./threejs/BuiltinGeometries.vue')
}

const cesiumCases = {}

export function getThreejsComponent(caseId) {
  return threejsCases[caseId] || null
}

export function getCesiumComponent(caseId) {
  return cesiumCases[caseId] || null
}

export { threejsCases, cesiumCases }
