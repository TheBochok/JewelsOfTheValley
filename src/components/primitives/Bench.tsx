import { palette } from '../../styles/palette'

export interface BenchProps {
  /** Length of the bench seat. Default 2.0. */
  length?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * A park bench: wooden slats on metal frame.
 */
export function Bench({
  length = 2.0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BenchProps) {
  const seatY = 0.45
  return (
    <group position={position} rotation={rotation}>
      {/* Seat slats (combined as one for simplicity) */}
      <mesh position={[0, seatY, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.07, 0.42]} />
        <meshStandardMaterial color={palette.tree.broadTrunk} flatShading roughness={0.85} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, seatY + 0.32, -0.18]} castShadow>
        <boxGeometry args={[length, 0.55, 0.06]} />
        <meshStandardMaterial color={palette.tree.broadTrunk} flatShading roughness={0.85} />
      </mesh>
      {/* End frames */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (length / 2 - 0.04), seatY - 0.02, 0]} castShadow>
          <boxGeometry args={[0.06, seatY * 1.0, 0.42]} />
          <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}
