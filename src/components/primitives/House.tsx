import { palette, FLOOR_HEIGHT } from '../../styles/palette'
import { GableRoof, HipRoof, FlatRoof } from './roofs'

export type HouseStyle = 'ranch' | 'spanish' | 'modernist'
export type HouseColorFamily = 'residential' // reserved — future variants

export interface HouseProps {
  style?: HouseStyle
  pool?: boolean
  /** Reserved for future expansion; v1 ignores. */
  colorFamily?: HouseColorFamily
  /** Pick one of palette.res.wall* variants. */
  wallColor?: string
  /** Adds a garage bay on the front face + a paved driveway out to +Z. */
  garage?: boolean
  /** Garage door color. Defaults to a desaturated trim. */
  garageColor?: string
  width?: number
  depth?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function House({
  style = 'ranch',
  pool = false,
  wallColor,
  garage = false,
  garageColor,
  width = 7,
  depth = 9,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: HouseProps) {
  const height = FLOOR_HEIGHT // single story
  const wall = wallColor ?? (style === 'spanish' ? palette.res.wallWarm : style === 'modernist' ? palette.civic.wall : palette.res.wallCream)

  return (
    <group position={position} rotation={rotation}>
      {/* Wall mass */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={wall} flatShading roughness={0.85} />
      </mesh>

      {/* Door frame (slightly wider than the door slab, lighter color) */}
      <mesh position={[0, 1.1, depth / 2 + 0.013]}>
        <boxGeometry args={[1.2, 2.3, 0.01]} />
        <meshStandardMaterial color={palette.res.wallWarm} flatShading roughness={0.85} />
      </mesh>
      {/* Door slab */}
      <mesh position={[0, 1.0, depth / 2 + 0.019]}>
        <boxGeometry args={[0.9, 2.0, 0.01]} />
        <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
      </mesh>

      {/* Two windows flanking the door, each with a frame */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 2.1, 1.6, depth / 2 + 0.013]}>
            <boxGeometry args={[1.2, 1.1, 0.01]} />
            <meshStandardMaterial color={palette.res.wallWarm} flatShading roughness={0.85} />
          </mesh>
          <mesh position={[s * 2.1, 1.6, depth / 2 + 0.019]}>
            <boxGeometry args={[1.0, 0.9, 0.01]} />
            <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.3} />
          </mesh>
          {/* Horizontal mullion */}
          <mesh position={[s * 2.1, 1.6, depth / 2 + 0.023]}>
            <boxGeometry args={[1.0, 0.05, 0.012]} />
            <meshStandardMaterial color={palette.res.wallWarm} flatShading roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Front porch: small slab roof on two thin columns + a stoop step */}
      {style !== 'modernist' && (
        <group position={[0, 0, depth / 2]}>
          {/* Columns */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 1.6, 1.1, 1.0]} castShadow>
              <boxGeometry args={[0.18, 2.2, 0.18]} />
              <meshStandardMaterial color={palette.res.wallWarm} flatShading roughness={0.85} />
            </mesh>
          ))}
          {/* Porch roof (thin slab matching the house tile color) */}
          <mesh position={[0, 2.2, 0.6]} castShadow>
            <boxGeometry args={[3.6, 0.14, 1.4]} />
            <meshStandardMaterial color={palette.res.roofTileDark} flatShading roughness={0.95} />
          </mesh>
          {/* Stoop step */}
          <mesh position={[0, 0.08, 1.1]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.16, 1.0]} />
            <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Modernist style instead gets a flat slab canopy over the door (no columns) */}
      {style === 'modernist' && (
        <group position={[0, 0, depth / 2]}>
          <mesh position={[0, 2.3, 0.5]} castShadow>
            <boxGeometry args={[2.4, 0.12, 1.1]} />
            <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.08, 0.6]} castShadow receiveShadow>
            <boxGeometry args={[2.0, 0.16, 0.9]} />
            <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Roof */}
      {style === 'ranch' && (
        <GableRoof width={width} depth={depth} baseY={height} color={palette.res.roofTileDark} />
      )}
      {style === 'spanish' && (
        <HipRoof width={width} depth={depth} baseY={height} color={palette.res.roofTile} />
      )}
      {style === 'modernist' && (
        <FlatRoof width={width} depth={depth} baseY={height} color={palette.civic.roof} parapet />
      )}

      {/* Chimney on ranch & spanish */}
      {(style === 'ranch' || style === 'spanish') && (
        <mesh position={[width * 0.3, height + 1.1, -depth * 0.15]} castShadow>
          <boxGeometry args={[0.6, 2.2, 0.6]} />
          <meshStandardMaterial color={palette.res.chimney} flatShading roughness={0.9} />
        </mesh>
      )}

      {/* Garage door on the front face + paved driveway running out to +Z. */}
      {garage && (
        <group>
          {/* Garage frame */}
          <mesh position={[-width * 0.28, 1.25, depth / 2 + 0.013]}>
            <boxGeometry args={[2.4, 2.5, 0.01]} />
            <meshStandardMaterial color={palette.res.wallWarm} flatShading roughness={0.85} />
          </mesh>
          {/* Garage door slab */}
          <mesh position={[-width * 0.28, 1.15, depth / 2 + 0.019]} castShadow>
            <boxGeometry args={[2.2, 2.3, 0.01]} />
            <meshStandardMaterial color={garageColor ?? palette.civic.wallAlt} flatShading roughness={0.85} />
          </mesh>
          {/* Horizontal door panels — 3 thin grooves */}
          {[-0.7, 0, 0.7].map((dy) => (
            <mesh key={dy} position={[-width * 0.28, 1.15 + dy, depth / 2 + 0.024]}>
              <boxGeometry args={[2.18, 0.04, 0.012]} />
              <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.85} />
            </mesh>
          ))}
          {/* Driveway slab leading out from the garage into +Z */}
          <mesh position={[-width * 0.28, 0.045, depth / 2 + 3.2]} receiveShadow>
            <boxGeometry args={[2.6, 0.09, 6.0]} />
            <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.95} />
          </mesh>
          {/* Driveway center seam */}
          <mesh position={[-width * 0.28, 0.092, depth / 2 + 3.2]}>
            <boxGeometry args={[0.05, 0.005, 5.6]} />
            <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.95} />
          </mesh>
        </group>
      )}

      {/* Pool, off to one side */}
      {pool && (
        <group position={[width / 2 + 2.4, 0, -depth * 0.1]}>
          {/* Concrete deck */}
          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.6, 0.12, 4.6]} />
            <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.95} />
          </mesh>
          {/* Pool basin (slightly darker than water, sunk below deck) */}
          <mesh position={[0, 0.07, 0]} castShadow>
            <boxGeometry args={[2.6, 0.16, 3.6]} />
            <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.5} />
          </mesh>
          {/* Water — sits just below the coping */}
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[2.55, 0.02, 3.55]} />
            <meshStandardMaterial color={palette.water} roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  )
}
