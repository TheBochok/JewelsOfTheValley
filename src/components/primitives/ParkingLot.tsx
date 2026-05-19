import { palette } from '../../styles/palette'

export interface ParkingLotProps {
  width?: number
  depth?: number
  /** Number of rows of parking spaces along the longer axis. */
  rows?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * Asphalt parking lot with painted space lines. Place cars on top externally.
 *
 * Y stack matches Road.tsx so the two can sit flush:
 *   asphalt slab top:  0.04
 *   markings:          0.045
 */
export function ParkingLot({
  width = 12,
  depth = 18,
  rows = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ParkingLotProps) {
  const stallWidth = 2.6
  const stallDepth = 5.0
  const stallsPerRow = Math.max(1, Math.floor(width / stallWidth))
  const usableWidth = stallsPerRow * stallWidth

  return (
    <group position={position} rotation={rotation}>
      {/* Asphalt slab */}
      <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.04, depth]} />
        <meshStandardMaterial color={palette.road.asphalt} flatShading roughness={0.95} />
      </mesh>

      {/* Parking space dividers — vertical white lines */}
      {Array.from({ length: rows }).map((_, row) => {
        const rowZ = -depth / 2 + (row + 0.5) * (depth / rows)
        return (
          <group key={row}>
            {Array.from({ length: stallsPerRow + 1 }).map((_, i) => {
              const x = -usableWidth / 2 + i * stallWidth
              return (
                <mesh key={i} position={[x, 0.045, rowZ]}>
                  <boxGeometry args={[0.08, 0.005, stallDepth - 0.2]} />
                  <meshStandardMaterial color={palette.road.lane} flatShading roughness={0.9} />
                </mesh>
              )
            })}
          </group>
        )
      })}

      {/* Center aisle stripe (between rows, if rows >= 2) */}
      {rows >= 2 &&
        Array.from({ length: rows - 1 }).map((_, i) => {
          const z = -depth / 2 + (i + 1) * (depth / rows)
          return (
            <mesh key={i} position={[0, 0.045, z]}>
              <boxGeometry args={[usableWidth, 0.005, 0.12]} />
              <meshStandardMaterial color={palette.road.lane} flatShading roughness={0.9} />
            </mesh>
          )
        })}
    </group>
  )
}
