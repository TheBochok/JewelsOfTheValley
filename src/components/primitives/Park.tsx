import { palette } from '../../styles/palette'

export interface ParkProps {
  width?: number
  depth?: number
  /** Adds a kidney pond shape (we approximate with an oval). */
  pond?: boolean
  /** Adds a baseball diamond in one corner. */
  baseball?: boolean
  /** Paved diagonal walkway. */
  path?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * Park primitive — green plate with optional pond, baseball diamond, path.
 * Trees are NOT placed here — scatter them externally to keep this dumb.
 */
export function Park({
  width = 30,
  depth = 24,
  pond = false,
  baseball = false,
  path = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ParkProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Grass plate (slightly raised so it wins z-fighting against the ground). */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={palette.ground.grass} flatShading roughness={0.95} />
      </mesh>

      {/* Pond */}
      {pond && (
        <group position={[width * 0.25, 0.025, -depth * 0.15]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[Math.min(width, depth) * 0.18, 12]} />
            <meshStandardMaterial color={palette.water} roughness={0.3} />
          </mesh>
          {/* dirt bank */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
            <ringGeometry args={[Math.min(width, depth) * 0.18, Math.min(width, depth) * 0.22, 16]} />
            <meshStandardMaterial color={palette.ground.dirt} flatShading roughness={0.95} />
          </mesh>
        </group>
      )}

      {/* Baseball diamond — dirt infield + sand bases */}
      {baseball && (
        <group position={[-width * 0.28, 0.025, depth * 0.22]} rotation={[0, Math.PI / 4, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color={palette.ground.dirt} flatShading roughness={0.95} />
          </mesh>
          {/* infield grass triangle (the inner part inside the bases) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <circleGeometry args={[2.6, 16]} />
            <meshStandardMaterial color={palette.ground.grass} flatShading roughness={0.95} />
          </mesh>
          {/* pitcher's mound */}
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 8]} />
            <meshStandardMaterial color={palette.ground.sand} flatShading roughness={0.95} />
          </mesh>
        </group>
      )}

      {/* Path */}
      {path && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]} receiveShadow>
          <planeGeometry args={[Math.hypot(width, depth) * 0.9, 1.6]} />
          <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.95} />
        </mesh>
      )}
    </group>
  )
}
