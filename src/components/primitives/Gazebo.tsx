import { palette } from '../../styles/palette'

export interface GazeboProps {
  /** Plan radius (corner-to-center). Default 2.0. */
  radius?: number
  /** Pillar height. Default 2.6. */
  height?: number
  /** Roof tile color. */
  roofColor?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * An octagonal park gazebo / bandstand. Cream columns, terracotta cone roof.
 */
export function Gazebo({
  radius = 2.0,
  height = 2.6,
  roofColor = palette.res.roofTile,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: GazeboProps) {
  const sides = 8
  const pillarInset = 0.18
  return (
    <group position={position} rotation={rotation}>
      {/* Base / step */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius + 0.25, radius + 0.25, 0.16, sides]} />
        <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.9} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.08, sides]} />
        <meshStandardMaterial color={palette.res.wallCream} flatShading roughness={0.85} />
      </mesh>

      {/* Pillars */}
      {Array.from({ length: sides }).map((_, i) => {
        const ang = (i / sides) * Math.PI * 2
        const r = radius - pillarInset
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * r, 0.2 + height / 2, Math.sin(ang) * r]}
            castShadow
          >
            <boxGeometry args={[0.15, height, 0.15]} />
            <meshStandardMaterial color={palette.civic.wall} flatShading roughness={0.85} />
          </mesh>
        )
      })}

      {/* Roof — broad cone, octagonal */}
      <mesh position={[0, 0.2 + height + 0.7, 0]} castShadow>
        <coneGeometry args={[radius + 0.35, 1.4, sides]} />
        <meshStandardMaterial color={roofColor} flatShading roughness={0.95} />
      </mesh>

      {/* Finial */}
      <mesh position={[0, 0.2 + height + 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 6]} />
        <meshStandardMaterial color={palette.car.black} flatShading roughness={0.7} />
      </mesh>
    </group>
  )
}
