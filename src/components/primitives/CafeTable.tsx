import { palette } from '../../styles/palette'

export interface CafeTableProps {
  /** Number of chairs around the table. Default 4. */
  chairs?: number
  /** Umbrella canopy color. Pick from palette.mur.awning* for variety. */
  umbrellaColor?: string
  /** Drop the umbrella entirely. */
  noUmbrella?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * A small bistro table with chairs and an umbrella. Used in front of Murphy
 * Ave storefronts to suggest outdoor dining.
 */
export function CafeTable({
  chairs = 4,
  umbrellaColor = palette.mur.awningRed,
  noUmbrella = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: CafeTableProps) {
  const tableTopY = 0.75
  const tableR = 0.42
  return (
    <group position={position} rotation={rotation}>
      {/* Table leg */}
      <mesh position={[0, tableTopY / 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, tableTopY, 6]} />
        <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
      </mesh>
      {/* Table foot */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 8]} />
        <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
      </mesh>
      {/* Table top */}
      <mesh position={[0, tableTopY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[tableR, tableR, 0.06, 12]} />
        <meshStandardMaterial color={palette.civic.wall} flatShading roughness={0.8} />
      </mesh>

      {/* Chairs */}
      {Array.from({ length: chairs }).map((_, i) => {
        const ang = (i / chairs) * Math.PI * 2
        const r = tableR + 0.45
        return (
          <Chair
            key={i}
            position={[Math.cos(ang) * r, 0, Math.sin(ang) * r]}
            rotation={[0, -ang + Math.PI / 2, 0]}
          />
        )
      })}

      {/* Umbrella */}
      {!noUmbrella && (
        <group>
          {/* Pole */}
          <mesh position={[0, 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.7, 6]} />
            <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
          </mesh>
          {/* Canopy — flat octagonal disc with a slight cone */}
          <mesh position={[0, 2.15, 0]} castShadow>
            <coneGeometry args={[0.95, 0.45, 8]} />
            <meshStandardMaterial color={umbrellaColor} flatShading roughness={0.85} />
          </mesh>
          {/* Trim under the canopy edge */}
          <mesh position={[0, 1.93, 0]}>
            <cylinderGeometry args={[0.95, 0.95, 0.04, 8]} />
            <meshStandardMaterial color={palette.mur.awningStripe} flatShading roughness={0.85} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function Chair({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.06, 0.36]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0.16, 0.7, 0]} castShadow>
        <boxGeometry args={[0.04, 0.5, 0.36]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.8} />
      </mesh>
      {/* 4 legs */}
      {[[0.14, 0.14], [0.14, -0.14], [-0.14, 0.14], [-0.14, -0.14]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.21, z]} castShadow>
          <boxGeometry args={[0.04, 0.42, 0.04]} />
          <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}
