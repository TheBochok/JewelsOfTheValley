import { palette, LANE_WIDTH, ROAD_SHOULDER, SIDEWALK_WIDTH } from '../../styles/palette'

export interface RoadProps {
  length?: number
  lanes?: number
  markings?: boolean
  /** Add a crosswalk at the +X end. */
  crosswalkEnd?: boolean
  /** Sidewalks alongside the road. */
  sidewalks?: boolean
  position?: [number, number, number]
  /** Road runs along +X by default. */
  rotation?: [number, number, number]
}

/**
 * Asphalt road segment. Runs along +X.
 *
 * Y stack (no z-fighting):
 *   ground sand:   y = 0.000
 *   grass plane:   y = 0.005  (CityScene)
 *   road bottom:   y = 0.000
 *   road top:      y = 0.040
 *   markings:      y = 0.045  (just above road top)
 *   crosswalk:     y = 0.046
 *   sidewalk top:  y = 0.120
 */
const ROAD_THICK = 0.04
const ROAD_TOP = ROAD_THICK // road bottom sits at y=0
const MARKING_Y = ROAD_TOP + 0.005
const SIDEWALK_THICK = 0.12

export function Road({
  length = 30,
  lanes = 2,
  markings = true,
  crosswalkEnd = false,
  sidewalks = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: RoadProps) {
  const travelWidth = lanes * LANE_WIDTH
  const totalWidth = travelWidth + ROAD_SHOULDER * 2

  return (
    <group position={position} rotation={rotation}>
      {/* Asphalt slab — top at y=ROAD_TOP, clearly above grass plane */}
      <mesh position={[0, ROAD_THICK / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[length, ROAD_THICK, totalWidth]} />
        <meshStandardMaterial color={palette.road.asphalt} flatShading roughness={0.95} />
      </mesh>

      {/* Center lane stripe */}
      {markings && lanes >= 2 && (
        <mesh position={[0, MARKING_Y, 0]}>
          <boxGeometry args={[length * 0.96, 0.005, 0.12]} />
          <meshStandardMaterial color={palette.road.lane} flatShading roughness={0.9} />
        </mesh>
      )}

      {/* Dashed edge stripes (both sides) */}
      {markings &&
        Array.from({ length: Math.floor(length / 3) }).map((_, i) => {
          const x = -length / 2 + 0.75 + i * 3
          return (
            <group key={i}>
              <mesh position={[x, MARKING_Y, travelWidth / 2 - 0.1]}>
                <boxGeometry args={[1.5, 0.005, 0.1]} />
                <meshStandardMaterial color={palette.road.lane} flatShading roughness={0.9} />
              </mesh>
              <mesh position={[x, MARKING_Y, -travelWidth / 2 + 0.1]}>
                <boxGeometry args={[1.5, 0.005, 0.1]} />
                <meshStandardMaterial color={palette.road.lane} flatShading roughness={0.9} />
              </mesh>
            </group>
          )
        })}

      {/* Crosswalk at the +X end */}
      {crosswalkEnd && (
        <group position={[length / 2 - 1, MARKING_Y + 0.001, 0]}>
          {Array.from({ length: 6 }).map((_, i) => {
            const z = -travelWidth / 2 + (i + 0.5) * (travelWidth / 6)
            return (
              <mesh key={i} position={[0, 0, z]}>
                <boxGeometry args={[1.6, 0.005, travelWidth / 6 - 0.1]} />
                <meshStandardMaterial color={palette.road.lane} flatShading roughness={0.9} />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Sidewalks — raised curb just outside the asphalt */}
      {sidewalks && (
        <>
          <mesh
            position={[0, SIDEWALK_THICK / 2, totalWidth / 2 + SIDEWALK_WIDTH / 2]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[length, SIDEWALK_THICK, SIDEWALK_WIDTH]} />
            <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.9} />
          </mesh>
          <mesh
            position={[0, SIDEWALK_THICK / 2, -totalWidth / 2 - SIDEWALK_WIDTH / 2]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[length, SIDEWALK_THICK, SIDEWALK_WIDTH]} />
            <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  )
}
