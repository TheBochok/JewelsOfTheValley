import { palette, CarColorToken } from '../../styles/palette'

export interface CarProps {
  color?: CarColorToken
  /** Car length along +X (default 2.2). */
  length?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const BODY_W = 1.0
const BODY_H = 0.55
const CABIN_LEN_FRAC = 0.55
const CABIN_H = 0.45

/**
 * A low-poly car. Length along +X. Default size: 2.2 × 1.0 × 1.0.
 * Per STYLE.md §4.4 — cars are ~44% of a lane width.
 */
export function Car({
  color = 'white',
  length = 2.2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: CarProps) {
  const bodyColor = palette.car[color]
  const wheelOffsetX = length * 0.32
  const wheelOffsetZ = BODY_W / 2 - 0.05
  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, BODY_H / 2 + 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, BODY_H, BODY_W]} />
        <meshStandardMaterial color={bodyColor} flatShading roughness={0.45} />
      </mesh>

      {/* Cabin (slightly inset, offset back) */}
      <mesh position={[-length * 0.08, BODY_H + CABIN_H / 2 + 0.18, 0]} castShadow>
        <boxGeometry args={[length * CABIN_LEN_FRAC, CABIN_H, BODY_W - 0.1]} />
        <meshStandardMaterial color={bodyColor} flatShading roughness={0.45} />
      </mesh>

      {/* Windows (one band wrapping cabin sides) */}
      <mesh position={[-length * 0.08, BODY_H + CABIN_H / 2 + 0.18, BODY_W / 2 - 0.04]} castShadow>
        <boxGeometry args={[length * CABIN_LEN_FRAC - 0.15, CABIN_H - 0.12, 0.02]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.2} />
      </mesh>
      <mesh position={[-length * 0.08, BODY_H + CABIN_H / 2 + 0.18, -BODY_W / 2 + 0.04]} castShadow>
        <boxGeometry args={[length * CABIN_LEN_FRAC - 0.15, CABIN_H - 0.12, 0.02]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.2} />
      </mesh>

      {/* Windshield (front) */}
      <mesh position={[-length * 0.08 + length * CABIN_LEN_FRAC / 2 - 0.02, BODY_H + CABIN_H / 2 + 0.18, 0]}>
        <boxGeometry args={[0.04, CABIN_H - 0.12, BODY_W - 0.18]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.2} />
      </mesh>

      {/* Wheels — 4 short cylinders, drawn as dark disks */}
      {[
        [wheelOffsetX, wheelOffsetZ],
        [wheelOffsetX, -wheelOffsetZ],
        [-wheelOffsetX, wheelOffsetZ],
        [-wheelOffsetX, -wheelOffsetZ],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.12, 8]} />
          <meshStandardMaterial color={palette.car.black} flatShading roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
