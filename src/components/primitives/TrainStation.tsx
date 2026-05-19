import { palette, FLOOR_HEIGHT } from '../../styles/palette'
import { HipRoof } from './roofs'

export interface TrainStationProps {
  /** Length along +X. */
  length?: number
  /** Depth along +Z. The building sits on the +Z side, platform on -Z. */
  depth?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * Spanish-revival depot: stucco walls + terracotta hip roof, covered platform
 * facing the tracks (-Z side). Tracks are NOT part of this primitive — the
 * landmark/scene composes them separately.
 */
export function TrainStation({
  length = 16,
  depth = 6,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: TrainStationProps) {
  const height = FLOOR_HEIGHT * 1.1
  const platformDepth = 3.5
  const platformLength = length + 4

  return (
    <group position={position} rotation={rotation}>
      {/* Main building (back, +Z) */}
      <mesh position={[0, height / 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[length, height, depth]} />
        <meshStandardMaterial color={palette.res.wallWarm} flatShading roughness={0.85} />
      </mesh>
      {/* Hip roof */}
      <group position={[0, 0, depth / 2]}>
        <HipRoof width={length} depth={depth} baseY={height} color={palette.res.roofTile} overhang={0.5} />
      </group>

      {/* Arched entrance — fake with a darker rect, offset outside the wall plane */}
      <mesh position={[0, height * 0.45, depth + 0.015]}>
        <boxGeometry args={[2.4, 2.6, 0.01]} />
        <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
      </mesh>

      {/* Windows along the front of the depot */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * length * 0.28, height * 0.55, depth + 0.015]}>
          <boxGeometry args={[1.5, 1.3, 0.01]} />
          <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.3} />
        </mesh>
      ))}

      {/* Platform slab (extends past the building each side) */}
      <mesh position={[0, 0.18, -platformDepth / 2]} receiveShadow castShadow>
        <boxGeometry args={[platformLength, 0.36, platformDepth]} />
        <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.95} />
      </mesh>

      {/* Platform canopy — thick tile roof on slim posts */}
      <group position={[0, 0, -platformDepth / 2]}>
        {Array.from({ length: 5 }).map((_, i) => {
          const x = -platformLength / 2 + 1.5 + i * ((platformLength - 3) / 4)
          return (
            <mesh key={i} position={[x, 1.4, platformDepth / 2 - 0.2]} castShadow>
              <boxGeometry args={[0.2, 2.8, 0.2]} />
              <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.9} />
            </mesh>
          )
        })}
        {/* Roof slab */}
        <mesh position={[0, 2.95, 0]} castShadow>
          <boxGeometry args={[platformLength - 0.6, 0.35, platformDepth + 0.4]} />
          <meshStandardMaterial color={palette.res.roofTile} flatShading roughness={0.95} />
        </mesh>
        {/* Fascia trim underneath */}
        <mesh position={[0, 2.74, platformDepth / 2 + 0.18]}>
          <boxGeometry args={[platformLength - 0.6, 0.12, 0.06]} />
          <meshStandardMaterial color={palette.res.roofTileDark} flatShading roughness={0.95} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * A pair of parallel rails on wooden ties. Runs along +X.
 * Useful next to TrainStation; not exported in `primitives/index.ts` as a
 * primary primitive — it's a helper for landmark composition.
 */
export function TrainTrack({
  length = 80,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  length?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  const gauge = 1.4
  const tieCount = Math.floor(length / 1.6)
  return (
    <group position={position} rotation={rotation}>
      {/* Ballast bed */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[length, 0.08, gauge + 1.6]} />
        <meshStandardMaterial color={palette.road.asphaltDark} flatShading roughness={0.95} />
      </mesh>
      {/* Ties */}
      {Array.from({ length: tieCount }).map((_, i) => {
        const x = -length / 2 + 0.8 + i * 1.6
        return (
          <mesh key={i} position={[x, 0.09, 0]} castShadow>
            <boxGeometry args={[0.4, 0.06, gauge + 1.2]} />
            <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.95} />
          </mesh>
        )
      })}
      {/* Rails */}
      <mesh position={[0, 0.16, gauge / 2]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.08, 0.1]} />
        <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.16, -gauge / 2]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.08, 0.1]} />
        <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.5} />
      </mesh>
    </group>
  )
}
