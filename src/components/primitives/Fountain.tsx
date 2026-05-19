import { palette } from '../../styles/palette'

export interface FountainProps {
  /** Basin radius. Default 1.5. */
  radius?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * A small plaza fountain — octagonal basin, central pedestal, water spout.
 */
export function Fountain({
  radius = 1.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: FountainProps) {
  const sides = 8
  return (
    <group position={position} rotation={rotation}>
      {/* Basin outer wall */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.36, sides]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>
      {/* Coping cap */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[radius + 0.06, radius + 0.06, 0.06, sides]} />
        <meshStandardMaterial color={palette.civic.wall} flatShading roughness={0.85} />
      </mesh>
      {/* Water surface (just below coping) */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[radius - 0.08, radius - 0.08, 0.02, sides]} />
        <meshStandardMaterial color={palette.water} flatShading roughness={0.25} />
      </mesh>
      {/* Center pedestal */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.55, sides]} />
        <meshStandardMaterial color={palette.civic.wall} flatShading roughness={0.85} />
      </mesh>
      {/* Top bowl */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.42, 0.18, sides]} />
        <meshStandardMaterial color={palette.civic.wall} flatShading roughness={0.85} />
      </mesh>
      {/* Spout (thin water column above the bowl) */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.04, 0.09, 0.45, 6]} />
        <meshStandardMaterial color={palette.water} flatShading roughness={0.2} />
      </mesh>
    </group>
  )
}
