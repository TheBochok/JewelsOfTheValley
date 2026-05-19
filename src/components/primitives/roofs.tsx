import { useMemo } from 'react'
import * as THREE from 'three'
import { palette } from '../../styles/palette'

const RISE_RATIO = 0.35 // STYLE.md §4.1
const DEFAULT_OVERHANG = 0.3
/**
 * Tiny vertical lift applied to every roof so its bottom plane doesn't
 * z-fight with the building's wall top (both would otherwise sit at y=baseY).
 */
const ROOF_LIFT = 0.005

/** A gable (triangular prism) roof. Ridge runs along the +X axis. */
export function GableRoof({
  width,
  depth,
  baseY,
  color = palette.res.roofTile,
  overhang = DEFAULT_OVERHANG,
}: {
  width: number
  depth: number
  baseY: number
  color?: string
  overhang?: number
}) {
  const geom = useMemo(() => makeGableGeometry(width, depth, depth * RISE_RATIO, overhang), [width, depth, overhang])
  return (
    <mesh position={[0, baseY + ROOF_LIFT, 0]} geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial color={color} flatShading roughness={0.95} />
    </mesh>
  )
}

/** A hip-style roof: truncated pyramid with a short ridge along +X. */
export function HipRoof({
  width,
  depth,
  baseY,
  color = palette.res.roofTile,
  overhang = DEFAULT_OVERHANG,
}: {
  width: number
  depth: number
  baseY: number
  color?: string
  overhang?: number
}) {
  const geom = useMemo(() => makeHipGeometry(width, depth, depth * RISE_RATIO, overhang), [width, depth, overhang])
  return (
    <mesh position={[0, baseY + ROOF_LIFT, 0]} geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial color={color} flatShading roughness={0.95} />
    </mesh>
  )
}

/** A flat roof with a thin parapet around the perimeter. */
export function FlatRoof({
  width,
  depth,
  baseY,
  color = palette.civic.roof,
  parapet = true,
}: {
  width: number
  depth: number
  baseY: number
  color?: string
  parapet?: boolean
}) {
  // Slab sits ROOF_LIFT above the wall top so its bottom face never z-fights
  // with the building's wall top face.
  const slabCenterY = baseY + ROOF_LIFT + 0.05
  return (
    <group>
      <mesh position={[0, slabCenterY, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color={color} flatShading roughness={0.85} />
      </mesh>
      {parapet && (
        <>
          <mesh position={[0, baseY + 0.35, depth / 2 - 0.1]} castShadow>
            <boxGeometry args={[width, 0.6, 0.15]} />
            <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
          </mesh>
          <mesh position={[0, baseY + 0.35, -depth / 2 + 0.1]} castShadow>
            <boxGeometry args={[width, 0.6, 0.15]} />
            <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
          </mesh>
          <mesh position={[width / 2 - 0.1, baseY + 0.35, 0]} castShadow>
            <boxGeometry args={[0.15, 0.6, depth]} />
            <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
          </mesh>
          <mesh position={[-width / 2 + 0.1, baseY + 0.35, 0]} castShadow>
            <boxGeometry args={[0.15, 0.6, depth]} />
            <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
          </mesh>
        </>
      )}
    </group>
  )
}

function makeGableGeometry(width: number, depth: number, rise: number, overhang: number) {
  const W = width / 2 + overhang
  const D = depth / 2 + overhang
  const vertices = new Float32Array([
    -W, 0, -D,   // 0 back-left
     W, 0, -D,   // 1 back-right
    -W, 0,  D,   // 2 front-left
     W, 0,  D,   // 3 front-right
    -W, rise, 0, // 4 ridge-left
     W, rise, 0, // 5 ridge-right
  ])
  const indices = [
    // back slope (CCW viewed from -z)
    0, 5, 4,  0, 1, 5,
    // front slope (CCW viewed from +z)
    2, 4, 5,  2, 5, 3,
    // left gable end
    0, 4, 2,
    // right gable end
    1, 3, 5,
    // soffit (bottom, helps occlusion when overhang > 0)
    0, 2, 1,  1, 2, 3,
  ]
  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

function makeHipGeometry(width: number, depth: number, rise: number, overhang: number) {
  // Ridge runs along the building's LONGER plan axis (real hip-roof behavior).
  // If width >= depth, ridge runs along X; otherwise it runs along Z.
  const W = width / 2 + overhang
  const D = depth / 2 + overhang
  let v: Float32Array
  let indices: number[]
  if (width >= depth) {
    const ridgeHalf = (width - depth) / 2
    v = new Float32Array([
      -W, 0, -D,           // 0 back-left base
       W, 0, -D,           // 1 back-right base
      -W, 0,  D,           // 2 front-left base
       W, 0,  D,           // 3 front-right base
      -ridgeHalf, rise, 0, // 4 ridge-left
       ridgeHalf, rise, 0, // 5 ridge-right
    ])
    indices = [
      2, 4, 5,  2, 5, 3,   // front slope
      0, 5, 4,  0, 1, 5,   // back slope
      0, 4, 2,             // left hip
      1, 3, 5,             // right hip
      0, 2, 1,  1, 2, 3,   // soffit
    ]
  } else {
    const ridgeHalf = (depth - width) / 2
    v = new Float32Array([
      -W, 0, -D,           // 0 back-left base
       W, 0, -D,           // 1 back-right base
      -W, 0,  D,           // 2 front-left base
       W, 0,  D,           // 3 front-right base
       0, rise, -ridgeHalf,// 4 ridge-back
       0, rise,  ridgeHalf,// 5 ridge-front
    ])
    indices = [
      0, 4, 1,             // back hip (triangle)
      2, 3, 5,             // front hip (triangle)
      0, 2, 5,  0, 5, 4,   // left slope (quad)
      1, 4, 5,  1, 5, 3,   // right slope (quad)
      0, 2, 1,  1, 2, 3,   // soffit
    ]
  }
  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(v, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}
