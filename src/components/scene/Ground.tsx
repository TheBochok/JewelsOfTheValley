import { palette } from '../../styles/palette'

interface GroundProps {
  /** Full ground plane size (square). Default 400 — large enough to read as "endless". */
  size?: number
  /** Color for the wide-area ground. Defaults to sand (the scene fades to it past the detailed area). */
  color?: string
  /** Optional inner grass patch — set width/depth > 0 to render. */
  grass?: { width: number; depth: number } | null
}

export function Ground({ size = 400, color = palette.ground.sand, grass = null }: GroundProps) {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} flatShading roughness={0.95} />
      </mesh>
      {grass && (
        <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0.005, 0]}>
          <planeGeometry args={[grass.width, grass.depth]} />
          <meshStandardMaterial color={palette.ground.grass} flatShading roughness={0.95} />
        </mesh>
      )}
    </group>
  )
}
