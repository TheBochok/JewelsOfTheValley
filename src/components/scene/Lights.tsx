import { palette } from '../../styles/palette'

/**
 * The canonical sun rig. Position is fixed forever (STYLE.md §2).
 * Sun comes from upper-right; shadows fall toward lower-left.
 */
export function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#e8efff" />
      <hemisphereLight
        intensity={0.55}
        color={palette.sky.day}
        groundColor={palette.ground.grass}
      />
      <directionalLight
        position={[25, 40, -15]}
        intensity={1.15}
        color="#fff4d6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0005}
      />
    </>
  )
}
