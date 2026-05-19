import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { palette } from '../../styles/palette'

export interface WaterTowerProps {
  /** Label painted on the tank face. */
  label?: string
  /** Height of the leg structure. The tank sits on top. */
  legHeight?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const TANK_R = 2.5
const TANK_H = 4.5
const CONE_H = 1.5
const LEG_BASE_SPREAD = 3.0    // distance from center axis to a leg's bottom
const LEG_TOP_SPREAD = 1.9     // distance from center axis to a leg's top
const LEG_RADIUS = 0.22

/**
 * Heritage Park style water tower. White tank with cone top on 4 cross-braced legs.
 * Visible from across the scene at v1 zoom — used as Sunnyvale's beacon.
 */
export function WaterTower({
  label = 'SUNNYVALE',
  legHeight = 12,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: WaterTowerProps) {
  // Four leg corners, one per quadrant.
  const corners = useMemo(
    () =>
      [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ] as const,
    [],
  )

  return (
    <group position={position} rotation={rotation}>
      {/* Legs — angled cylinders running from base spread to top spread */}
      {corners.map(([sx, sz], i) => (
        <Leg key={i} sx={sx} sz={sz} height={legHeight} />
      ))}

      {/* X-bracing between adjacent legs, at two heights */}
      {[legHeight * 0.4, legHeight * 0.7].map((y, level) => {
        // Slightly different spread at this height (linear interp of leg taper)
        const t = y / legHeight
        const spread = LEG_BASE_SPREAD + (LEG_TOP_SPREAD - LEG_BASE_SPREAD) * t
        return (
          <group key={level} position={[0, y, 0]}>
            {/* 4 horizontal ring beams */}
            <BracingBeam from={[spread, 0, spread]} to={[spread, 0, -spread]} />
            <BracingBeam from={[spread, 0, -spread]} to={[-spread, 0, -spread]} />
            <BracingBeam from={[-spread, 0, -spread]} to={[-spread, 0, spread]} />
            <BracingBeam from={[-spread, 0, spread]} to={[spread, 0, spread]} />
          </group>
        )
      })}

      {/* X diagonals on each face — single X per side between two ring beams */}
      {(['+x', '-x', '+z', '-z'] as const).map((face) => (
        <FaceX
          key={face}
          face={face}
          yLow={legHeight * 0.4}
          yHigh={legHeight * 0.7}
        />
      ))}

      {/* Tank platform */}
      <mesh position={[0, legHeight + 0.1, 0]} castShadow>
        <cylinderGeometry args={[TANK_R + 0.25, TANK_R + 0.25, 0.25, 12]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>

      {/* Tank */}
      <mesh position={[0, legHeight + 0.25 + TANK_H / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[TANK_R, TANK_R, TANK_H, 12]} />
        <meshStandardMaterial color={palette.civic.wall} flatShading roughness={0.85} />
      </mesh>

      {/* Tank top trim rings */}
      <mesh position={[0, legHeight + 0.25 + 0.18, 0]} castShadow>
        <cylinderGeometry args={[TANK_R + 0.05, TANK_R + 0.05, 0.12, 12]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>
      <mesh position={[0, legHeight + 0.25 + TANK_H - 0.18, 0]} castShadow>
        <cylinderGeometry args={[TANK_R + 0.05, TANK_R + 0.05, 0.12, 12]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>

      {/* Cone top */}
      <mesh position={[0, legHeight + 0.25 + TANK_H + CONE_H / 2, 0]} castShadow>
        <coneGeometry args={[TANK_R + 0.05, CONE_H, 12]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>

      {/* Finial */}
      <mesh position={[0, legHeight + 0.25 + TANK_H + CONE_H + 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
        <meshStandardMaterial color={palette.car.black} flatShading roughness={0.7} />
      </mesh>

      {/* Label on two faces */}
      <Text
        position={[0, legHeight + 0.25 + TANK_H / 2, TANK_R + 0.01]}
        fontSize={0.9}
        color={palette.res.trim}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {label}
      </Text>
      <Text
        position={[0, legHeight + 0.25 + TANK_H / 2, -TANK_R - 0.01]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.9}
        color={palette.res.trim}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {label}
      </Text>
    </group>
  )
}

/** A single angled leg cylinder from corner of base to corner of top platform. */
function Leg({ sx, sz, height }: { sx: number; sz: number; height: number }) {
  const baseX = sx * LEG_BASE_SPREAD
  const baseZ = sz * LEG_BASE_SPREAD
  const topX = sx * LEG_TOP_SPREAD
  const topZ = sz * LEG_TOP_SPREAD
  const dx = topX - baseX
  const dz = topZ - baseZ
  const length = Math.hypot(dx, height, dz)

  const start = useMemo(() => new THREE.Vector3(baseX, 0, baseZ), [baseX, baseZ])
  const end = useMemo(() => new THREE.Vector3(topX, height, topZ), [topX, height, topZ])
  const mid = useMemo(() => start.clone().add(end).multiplyScalar(0.5), [start, end])
  const quat = useMemo(() => {
    const dir = end.clone().sub(start).normalize()
    const up = new THREE.Vector3(0, 1, 0)
    return new THREE.Quaternion().setFromUnitVectors(up, dir)
  }, [start, end])

  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={quat} castShadow>
      <cylinderGeometry args={[LEG_RADIUS, LEG_RADIUS, length, 6]} />
      <meshStandardMaterial color={palette.civic.wall} flatShading roughness={0.85} />
    </mesh>
  )
}

/** A thin horizontal bracing beam from one leg ring point to another. */
function BracingBeam({
  from,
  to,
}: {
  from: [number, number, number]
  to: [number, number, number]
}) {
  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const length = start.distanceTo(end)
  const mid = start.clone().add(end).multiplyScalar(0.5)
  const dir = end.clone().sub(start).normalize()
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={quat} castShadow>
      <cylinderGeometry args={[0.07, 0.07, length, 5]} />
      <meshStandardMaterial color={palette.civic.wall} flatShading roughness={0.85} />
    </mesh>
  )
}

/** X-shaped diagonal bracing on one face, between two ring heights. */
function FaceX({
  face,
  yLow,
  yHigh,
}: {
  face: '+x' | '-x' | '+z' | '-z'
  yLow: number
  yHigh: number
}) {
  // Leg spread interpolated per height
  const tLow = yLow / 12
  const tHigh = yHigh / 12
  const sLow = LEG_BASE_SPREAD + (LEG_TOP_SPREAD - LEG_BASE_SPREAD) * tLow
  const sHigh = LEG_BASE_SPREAD + (LEG_TOP_SPREAD - LEG_BASE_SPREAD) * tHigh

  // Each face is between 2 legs. Build 2 diagonals (X-shape).
  let aLow: [number, number, number], bLow: [number, number, number]
  let aHigh: [number, number, number], bHigh: [number, number, number]
  if (face === '+x') {
    aLow = [sLow, yLow, sLow]
    bLow = [sLow, yLow, -sLow]
    aHigh = [sHigh, yHigh, sHigh]
    bHigh = [sHigh, yHigh, -sHigh]
  } else if (face === '-x') {
    aLow = [-sLow, yLow, sLow]
    bLow = [-sLow, yLow, -sLow]
    aHigh = [-sHigh, yHigh, sHigh]
    bHigh = [-sHigh, yHigh, -sHigh]
  } else if (face === '+z') {
    aLow = [sLow, yLow, sLow]
    bLow = [-sLow, yLow, sLow]
    aHigh = [sHigh, yHigh, sHigh]
    bHigh = [-sHigh, yHigh, sHigh]
  } else {
    aLow = [sLow, yLow, -sLow]
    bLow = [-sLow, yLow, -sLow]
    aHigh = [sHigh, yHigh, -sHigh]
    bHigh = [-sHigh, yHigh, -sHigh]
  }
  return (
    <>
      <BracingBeam from={aLow} to={bHigh} />
      <BracingBeam from={bLow} to={aHigh} />
    </>
  )
}
