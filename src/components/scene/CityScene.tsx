import { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { palette } from '../../styles/palette'
import { Lights } from './Lights'
import { Ground } from './Ground'

interface CitySceneProps {
  children: ReactNode
  /** Optional inner grass patch (width/depth in world units). */
  grass?: { width: number; depth: number } | null
}

/**
 * Canvas + lighting rig + ground plane. Wraps a city's contents.
 * Camera/material settings come from STYLE.md.
 */
export function CityScene({ children, grass = null }: CitySceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [60, 55, 60], fov: 22, near: 0.1, far: 500 }}
    >
      <color attach="background" args={[palette.sky.day]} />
      <fog attach="fog" args={[palette.sky.fog, 130, 280]} />
      <Lights />
      <Ground grass={grass} />
      {children}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={25}
        maxDistance={130}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
    </Canvas>
  )
}
