import { Instances, Instance } from '@react-three/drei'
import { useMemo } from 'react'
import { palette, TreeVariant } from '../../styles/palette'

export interface TreeProps {
  variant?: TreeVariant
  /** Override total height (units). If omitted uses the variant's natural height. */
  height?: number
  /** Rotation around Y in radians. */
  rotationY?: number
  position?: [number, number, number]
}

const VARIANT_HEIGHT: Record<TreeVariant, number> = {
  broadleaf: 3.4,
  oak: 5.5,
  palm: 7.6,
}

/**
 * A single tree. Use for one-off placements (a landmark feature tree, etc).
 * For bulk placement (>10) use <TreeField> — naive trees tank the frame rate.
 */
export function Tree({
  variant = 'broadleaf',
  height,
  rotationY = 0,
  position = [0, 0, 0],
}: TreeProps) {
  const scale = (height ?? VARIANT_HEIGHT[variant]) / VARIANT_HEIGHT[variant]
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {variant === 'palm' ? <PalmGeometry /> : <BroadleafGeometry oak={variant === 'oak'} />}
    </group>
  )
}

function BroadleafGeometry({ oak = false }: { oak?: boolean }) {
  const trunkH = oak ? 2.4 : 1.8
  const trunkR = oak ? 0.35 : 0.25
  const canopyR = oak ? 2.4 : 1.5
  return (
    <>
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[trunkR * 0.85, trunkR, trunkH, 6, 1]} />
        <meshStandardMaterial color={palette.tree.broadTrunk} flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0, trunkH + canopyR * 0.65, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[canopyR, 0]} />
        <meshStandardMaterial color={oak ? palette.tree.broadDark : palette.tree.broadMid} flatShading roughness={1.0} />
      </mesh>
      {/* Secondary blob on the sunlit side, sells the layered canopy */}
      <mesh
        position={[canopyR * 0.45, trunkH + canopyR * 1.05, canopyR * 0.25]}
        castShadow
      >
        <icosahedronGeometry args={[canopyR * 0.55, 0]} />
        <meshStandardMaterial color={oak ? palette.tree.broadMid : palette.tree.broadLite} flatShading roughness={1.0} />
      </mesh>
      {/* Third small blob on the opposite side */}
      <mesh
        position={[-canopyR * 0.35, trunkH + canopyR * 0.85, -canopyR * 0.3]}
        castShadow
      >
        <icosahedronGeometry args={[canopyR * 0.45, 0]} />
        <meshStandardMaterial color={oak ? palette.tree.broadDark : palette.tree.broadMid} flatShading roughness={1.0} />
      </mesh>
    </>
  )
}

function PalmGeometry() {
  const trunkH = 6.0
  const fronds = 6
  return (
    <>
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.26, trunkH, 6, 1]} />
        <meshStandardMaterial color={palette.tree.palmTrunk} flatShading roughness={0.9} />
      </mesh>
      <group position={[0, trunkH, 0]}>
        {Array.from({ length: fronds }).map((_, i) => {
          const ang = (i / fronds) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(ang) * 0.7, 0.1, Math.sin(ang) * 0.7]}
              rotation={[Math.sin(ang) * 0.3, ang, Math.cos(ang) * -0.3 - 0.15]}
              castShadow
            >
              <boxGeometry args={[1.7, 0.06, 0.4]} />
              <meshStandardMaterial color={palette.tree.palmFrond} flatShading roughness={1.0} />
            </mesh>
          )
        })}
        <mesh position={[0, 0.2, 0]} castShadow>
          <icosahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color={palette.tree.broadDark} flatShading roughness={1.0} />
        </mesh>
      </group>
    </>
  )
}

// --------------------------------------------------------------------------
// TreeField — bulk-placement using GPU instancing. One draw call per part.
// --------------------------------------------------------------------------

export interface TreeInstance {
  position: [number, number, number]
  variant: TreeVariant
  /** Per-instance scale multiplier, default 1.0. Apply ±15% jitter at the call site. */
  scale?: number
  /** Per-instance Y rotation. */
  rotationY?: number
}

interface TreeFieldProps {
  trees: TreeInstance[]
  /** Limit must be >= trees.length. Default 1000. */
  limit?: number
}

export function TreeField({ trees, limit = 1000 }: TreeFieldProps) {
  const grouped = useMemo(() => {
    const broad: TreeInstance[] = []
    const oak: TreeInstance[] = []
    const palm: TreeInstance[] = []
    for (const t of trees) {
      if (t.variant === 'palm') palm.push(t)
      else if (t.variant === 'oak') oak.push(t)
      else broad.push(t)
    }
    return { broad, oak, palm }
  }, [trees])

  return (
    <>
      <BroadleafInstances trees={grouped.broad} limit={limit} oak={false} />
      <BroadleafInstances trees={grouped.oak} limit={limit} oak={true} />
      <PalmInstances trees={grouped.palm} limit={limit} />
    </>
  )
}

function BroadleafInstances({ trees, limit, oak }: { trees: TreeInstance[]; limit: number; oak: boolean }) {
  if (trees.length === 0) return null
  const trunkH = oak ? 2.4 : 1.8
  const trunkR = oak ? 0.35 : 0.25
  const canopyR = oak ? 2.0 : 1.5
  return (
    <>
      <Instances limit={limit} range={trees.length} castShadow>
        <cylinderGeometry args={[trunkR * 0.85, trunkR, trunkH, 6, 1]} />
        <meshStandardMaterial color={palette.tree.broadTrunk} flatShading roughness={0.9} />
        {trees.map((t, i) => {
          const s = (t.scale ?? 1) * (VARIANT_HEIGHT[t.variant] / (oak ? VARIANT_HEIGHT.oak : VARIANT_HEIGHT.broadleaf))
          return (
            <Instance
              key={i}
              position={[t.position[0], t.position[1] + (trunkH / 2) * s, t.position[2]]}
              rotation={[0, t.rotationY ?? 0, 0]}
              scale={s}
            />
          )
        })}
      </Instances>
      <Instances limit={limit} range={trees.length} castShadow receiveShadow>
        <icosahedronGeometry args={[canopyR, 0]} />
        <meshStandardMaterial color={oak ? palette.tree.broadDark : palette.tree.broadMid} flatShading roughness={1.0} />
        {trees.map((t, i) => {
          const s = (t.scale ?? 1) * (VARIANT_HEIGHT[t.variant] / (oak ? VARIANT_HEIGHT.oak : VARIANT_HEIGHT.broadleaf))
          return (
            <Instance
              key={i}
              position={[t.position[0], t.position[1] + (trunkH + canopyR * 0.6) * s, t.position[2]]}
              rotation={[0, t.rotationY ?? 0, 0]}
              scale={s}
            />
          )
        })}
      </Instances>
    </>
  )
}

function PalmInstances({ trees, limit }: { trees: TreeInstance[]; limit: number }) {
  if (trees.length === 0) return null
  const trunkH = 6.0
  const fronds = 6
  return (
    <>
      <Instances limit={limit} range={trees.length} castShadow>
        <cylinderGeometry args={[0.18, 0.26, trunkH, 6, 1]} />
        <meshStandardMaterial color={palette.tree.palmTrunk} flatShading roughness={0.9} />
        {trees.map((t, i) => (
          <Instance
            key={i}
            position={[t.position[0], t.position[1] + (trunkH / 2) * (t.scale ?? 1), t.position[2]]}
            rotation={[0, t.rotationY ?? 0, 0]}
            scale={t.scale ?? 1}
          />
        ))}
      </Instances>
      {Array.from({ length: fronds }).map((_, frondIdx) => {
        const ang = (frondIdx / fronds) * Math.PI * 2
        return (
          <Instances key={frondIdx} limit={limit} range={trees.length} castShadow>
            <boxGeometry args={[1.7, 0.06, 0.4]} />
            <meshStandardMaterial color={palette.tree.palmFrond} flatShading roughness={1.0} />
            {trees.map((t, i) => {
              const s = t.scale ?? 1
              const rotY = t.rotationY ?? 0
              return (
                <Instance
                  key={i}
                  position={[
                    t.position[0] + Math.cos(ang + rotY) * 0.7 * s,
                    t.position[1] + (trunkH + 0.1) * s,
                    t.position[2] + Math.sin(ang + rotY) * 0.7 * s,
                  ]}
                  rotation={[Math.sin(ang) * 0.3, ang + rotY, Math.cos(ang) * -0.3 - 0.15]}
                  scale={s}
                />
              )
            })}
          </Instances>
        )
      })}
    </>
  )
}
