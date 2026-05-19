import { palette } from '../../styles/palette'

export interface TrainProps {
  /** Number of cars (incl. locomotive). */
  cars?: number
  /** Tints the locomotive nose accent. */
  noseColor?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const CAR_LEN = 7
const CAR_W = 1.4
const CAR_H = 1.6
const DECK_H = 0.18

/**
 * Caltrain-ish bilevel set. Runs along +X. Locomotive at the +X end.
 * Sits 0.18 above ground (rail deck). Place along a TrainTrack of matching length.
 */
export function Train({
  cars = 3,
  noseColor = palette.car.red,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: TrainProps) {
  const gap = 0.2
  const total = cars * CAR_LEN + (cars - 1) * gap

  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: cars }).map((_, i) => {
        const isLoco = i === cars - 1
        const xCenter = -total / 2 + CAR_LEN / 2 + i * (CAR_LEN + gap)
        return (
          <group key={i} position={[xCenter, 0, 0]}>
            <CarBody isLoco={isLoco} noseColor={noseColor} />
          </group>
        )
      })}
    </group>
  )
}

function CarBody({ isLoco, noseColor }: { isLoco: boolean; noseColor: string }) {
  const bodyColor = palette.car.white
  return (
    <group>
      {/* Body */}
      <mesh position={[0, DECK_H + CAR_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[CAR_LEN, CAR_H, CAR_W]} />
        <meshStandardMaterial color={bodyColor} flatShading roughness={0.5} />
      </mesh>
      {/* Window band */}
      <mesh position={[0, DECK_H + CAR_H * 0.7, 0]}>
        <boxGeometry args={[CAR_LEN - 0.6, CAR_H * 0.28, CAR_W + 0.02]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.25} />
      </mesh>
      {/* Lower window band (bilevel) */}
      <mesh position={[0, DECK_H + CAR_H * 0.32, 0]}>
        <boxGeometry args={[CAR_LEN - 0.6, CAR_H * 0.18, CAR_W + 0.02]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.25} />
      </mesh>
      {/* Red stripe */}
      <mesh position={[0, DECK_H + CAR_H * 0.5, 0]}>
        <boxGeometry args={[CAR_LEN - 0.4, 0.08, CAR_W + 0.03]} />
        <meshStandardMaterial color={palette.car.red} flatShading roughness={0.6} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, DECK_H + CAR_H + 0.05, 0]} castShadow>
        <boxGeometry args={[CAR_LEN - 0.2, 0.1, CAR_W - 0.05]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.8} />
      </mesh>
      {/* Locomotive nose */}
      {isLoco && (
        <mesh position={[CAR_LEN / 2 - 0.1, DECK_H + CAR_H / 2, 0]} castShadow>
          <boxGeometry args={[0.4, CAR_H * 0.8, CAR_W - 0.05]} />
          <meshStandardMaterial color={noseColor} flatShading roughness={0.5} />
        </mesh>
      )}
      {/* Wheels (just two visible trucks per car) */}
      {[CAR_LEN / 2 - 1.2, -(CAR_LEN / 2 - 1.2)].map((x) => (
        <group key={x} position={[x, 0.05, 0]}>
          {[CAR_W / 2 - 0.05, -CAR_W / 2 + 0.05].map((z, i) => (
            <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 8]} />
              <meshStandardMaterial color={palette.car.black} flatShading roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
