import { palette, FLOOR_HEIGHT, ColorFamily, RoofStyle } from '../../styles/palette'
import { FlatRoof, GableRoof, HipRoof } from './roofs'

export interface BuildingProps {
  floors?: number
  width?: number
  depth?: number
  roofStyle?: RoofStyle
  colorFamily?: ColorFamily
  /** Override wall color — useful for Murphy Ave variety. Must come from palette.mur.*. */
  accentColor?: string
  /** Adds a ground-floor awning (commercial only). */
  awningColor?: string
  /** If set, the awning is rendered as alternating stripes of this color and `awningColor`. */
  awningStripeColor?: string
  /** Side from which the awning protrudes. Default 'front' (+Z). */
  awningSide?: 'front' | 'back' | 'left' | 'right'
  /** Add small AC/mechanical units on top of a flat roof. */
  rooftopMechanicals?: boolean
  /** Show a commercial-style storefront on the front face (large display window + sign band).
   *  Defaults to true for commercial, false otherwise. */
  storefront?: boolean
  /** Show a center entrance door on the front face. Defaults to true. */
  entrance?: boolean
  /** Sign text — currently rendered as a colored band (no text). Used only when storefront=true. */
  signColor?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Building({
  floors = 2,
  width = 8,
  depth = 8,
  roofStyle = 'flat',
  colorFamily = 'civic',
  accentColor,
  awningColor,
  awningStripeColor,
  awningSide = 'front',
  rooftopMechanicals = false,
  storefront,
  entrance = true,
  signColor,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: BuildingProps) {
  const height = floors * FLOOR_HEIGHT
  const showStorefront = storefront ?? colorFamily === 'commercial'

  const wallColor =
    accentColor ??
    (colorFamily === 'civic'
      ? palette.civic.wall
      : colorFamily === 'residential'
      ? palette.res.wallCream
      : palette.mur.cream)

  const roofColor =
    colorFamily === 'civic'
      ? palette.civic.roof
      : colorFamily === 'commercial'
      ? palette.res.roofTile
      : palette.res.roofTile

  // Cornice (top trim band) & plinth (bottom band) colors.
  const corniceColor =
    colorFamily === 'civic' ? palette.civic.wallAlt : palette.res.trim
  const plinthColor =
    colorFamily === 'civic'
      ? palette.civic.wallAlt
      : palette.res.roofTileDark

  // Default sign band color: contrast against wall.
  const resolvedSignColor =
    signColor ??
    (accentColor ? palette.res.trim : palette.res.roofTileDark)

  // Ground floor of commercial buildings is replaced by the storefront —
  // skip ground-floor punched windows in that case to avoid double-glazing.
  const skipGroundFloorPunched = colorFamily === 'commercial' && showStorefront

  return (
    <group position={position} rotation={rotation}>
      {/* Main wall mass */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={wallColor} flatShading roughness={0.85} />
      </mesh>

      {/* Cornice — a slightly wider band at the top of the wall, just below the roof */}
      <mesh position={[0, height - 0.18, 0]} castShadow>
        <boxGeometry args={[width + 0.12, 0.36, depth + 0.12]} />
        <meshStandardMaterial color={corniceColor} flatShading roughness={0.85} />
      </mesh>

      {/* Ground-floor plinth (civic only; commercial uses storefront instead).
          Slightly wider than wall + darker color = visible base band. */}
      {colorFamily === 'civic' && (
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[width + 0.08, 1.0, depth + 0.08]} />
          <meshStandardMaterial color={plinthColor} flatShading roughness={0.85} />
        </mesh>
      )}

      {/* Civic glass bands with vertical mullions */}
      {colorFamily === 'civic' &&
        Array.from({ length: floors }).map((_, i) => (
          <CivicGlassBand key={i} floor={i} width={width} depth={depth} />
        ))}

      {/* Punched windows (residential & commercial upper floors) */}
      {colorFamily !== 'civic' &&
        Array.from({ length: floors }).map((_, floor) => {
          if (floor === 0 && skipGroundFloorPunched) return null
          const yMid = floor * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.55
          const winCount = Math.max(2, Math.floor(width / 2))
          return (
            <group key={floor}>
              {Array.from({ length: winCount }).map((_, i) => {
                const x = -width / 2 + (i + 0.5) * (width / winCount)
                return (
                  <PunchedWindow
                    key={i}
                    x={x}
                    yMid={yMid}
                    depth={depth}
                  />
                )
              })}
            </group>
          )
        })}

      {/* Commercial storefront on front face (replaces ground-floor punched windows). */}
      {showStorefront && (
        <Storefront width={width} depth={depth} signColor={resolvedSignColor} />
      )}

      {/* Front entrance door. For commercial w/ storefront, the door is in the storefront.
          For civic/residential, it sits center-front, ground floor. */}
      {entrance && !showStorefront && (
        <EntranceDoor width={width} depth={depth} />
      )}

      {/* Optional awning (commercial only) */}
      {awningColor && (
        <Awning
          color={awningColor}
          stripeColor={awningStripeColor}
          width={width}
          depth={depth}
          side={awningSide}
        />
      )}

      {/* Roof */}
      {roofStyle === 'flat' && <FlatRoof width={width} depth={depth} baseY={height} color={roofColor} />}
      {roofStyle === 'gable' && (
        <GableRoof width={width} depth={depth} baseY={height} color={roofColor} />
      )}
      {roofStyle === 'hip' && <HipRoof width={width} depth={depth} baseY={height} color={roofColor} />}

      {/* Rooftop mechanicals (flat roof only) */}
      {roofStyle === 'flat' && rooftopMechanicals && (
        <RooftopMechanicals width={width} depth={depth} baseY={height} />
      )}
    </group>
  )
}

function RooftopMechanicals({
  width,
  depth,
  baseY,
}: {
  width: number
  depth: number
  baseY: number
}) {
  const units = [
    { x: -width * 0.22, z: depth * 0.18, w: 1.4, h: 0.9, d: 1.4 },
    { x: width * 0.18, z: -depth * 0.14, w: 1.0, h: 0.7, d: 1.0 },
    { x: width * 0.28, z: depth * 0.2, w: 0.7, h: 0.5, d: 0.7 },
  ]
  return (
    <group>
      {units.map((u, i) => (
        <group key={i}>
          {/* Unit body */}
          <mesh position={[u.x, baseY + 0.7 + u.h / 2, u.z]} castShadow receiveShadow>
            <boxGeometry args={[u.w, u.h, u.d]} />
            <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.85} />
          </mesh>
          {/* Vent grille on top */}
          <mesh position={[u.x, baseY + 0.7 + u.h + 0.03, u.z]} castShadow>
            <boxGeometry args={[u.w - 0.15, 0.06, u.d - 0.15]} />
            <meshStandardMaterial color={palette.car.black} flatShading roughness={0.95} />
          </mesh>
        </group>
      ))}
      {/* A small parapet-mounted exhaust pipe */}
      <mesh position={[-width * 0.35, baseY + 1.15, -depth * 0.32]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 6]} />
        <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.85} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** A civic glass band on one floor: glass strips on all four faces +
 *  vertical mullions on front/back faces + horizontal spandrel above. */
function CivicGlassBand({
  floor,
  width,
  depth,
}: {
  floor: number
  width: number
  depth: number
}) {
  const yMid = floor * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.55
  const bandH = 1.9
  const spandrelH = 0.25
  const bandWFront = width * 0.86
  const bandWSide = depth * 0.86
  // Pane count: aim for panes ~1.4–1.8u wide.
  const panesFront = Math.max(3, Math.round(bandWFront / 1.6))
  const panesSide = Math.max(2, Math.round(bandWSide / 1.6))

  return (
    <group>
      {/* Glass on four faces */}
      <mesh position={[0, yMid, depth / 2 + 0.012]} castShadow>
        <boxGeometry args={[bandWFront, bandH, 0.01]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.25} />
      </mesh>
      <mesh position={[0, yMid, -depth / 2 - 0.012]} castShadow>
        <boxGeometry args={[bandWFront, bandH, 0.01]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.25} />
      </mesh>
      <mesh position={[width / 2 + 0.012, yMid, 0]} castShadow>
        <boxGeometry args={[0.01, bandH, bandWSide]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.25} />
      </mesh>
      <mesh position={[-width / 2 - 0.012, yMid, 0]} castShadow>
        <boxGeometry args={[0.01, bandH, bandWSide]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.25} />
      </mesh>

      {/* Vertical mullions on front + back faces */}
      {Array.from({ length: panesFront + 1 }).map((_, m) => {
        const x = -bandWFront / 2 + m * (bandWFront / panesFront)
        return (
          <group key={`f${m}`}>
            <mesh position={[x, yMid, depth / 2 + 0.018]}>
              <boxGeometry args={[0.07, bandH + 0.08, 0.012]} />
              <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.8} />
            </mesh>
            <mesh position={[x, yMid, -depth / 2 - 0.018]}>
              <boxGeometry args={[0.07, bandH + 0.08, 0.012]} />
              <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.8} />
            </mesh>
          </group>
        )
      })}

      {/* Vertical mullions on side faces */}
      {Array.from({ length: panesSide + 1 }).map((_, m) => {
        const z = -bandWSide / 2 + m * (bandWSide / panesSide)
        return (
          <group key={`s${m}`}>
            <mesh position={[width / 2 + 0.018, yMid, z]}>
              <boxGeometry args={[0.012, bandH + 0.08, 0.07]} />
              <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.8} />
            </mesh>
            <mesh position={[-width / 2 - 0.018, yMid, z]}>
              <boxGeometry args={[0.012, bandH + 0.08, 0.07]} />
              <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.8} />
            </mesh>
          </group>
        )
      })}

      {/* Spandrel above the glass band */}
      <mesh position={[0, yMid + bandH / 2 + spandrelH / 2, depth / 2 + 0.013]}>
        <boxGeometry args={[width * 0.92, spandrelH, 0.01]} />
        <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.85} />
      </mesh>
      <mesh position={[0, yMid + bandH / 2 + spandrelH / 2, -depth / 2 - 0.013]}>
        <boxGeometry args={[width * 0.92, spandrelH, 0.01]} />
        <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.85} />
      </mesh>
      <mesh position={[width / 2 + 0.013, yMid + bandH / 2 + spandrelH / 2, 0]}>
        <boxGeometry args={[0.01, spandrelH, depth * 0.92]} />
        <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.85} />
      </mesh>
      <mesh position={[-width / 2 - 0.013, yMid + bandH / 2 + spandrelH / 2, 0]}>
        <boxGeometry args={[0.01, spandrelH, depth * 0.92]} />
        <meshStandardMaterial color={palette.civic.trim} flatShading roughness={0.85} />
      </mesh>
    </group>
  )
}

/** A punched window on the front + back faces, with a slightly lighter frame surround. */
function PunchedWindow({ x, yMid, depth }: { x: number; yMid: number; depth: number }) {
  return (
    <>
      {/* Frame (slightly bigger than the glass) — front */}
      <mesh position={[x, yMid, depth / 2 + 0.012]}>
        <boxGeometry args={[1.1, 1.3, 0.01]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>
      {/* Glass — front */}
      <mesh position={[x, yMid, depth / 2 + 0.018]}>
        <boxGeometry args={[0.9, 1.1, 0.01]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.3} />
      </mesh>
      {/* Mullion (one vertical bar splitting the pane) */}
      <mesh position={[x, yMid, depth / 2 + 0.022]}>
        <boxGeometry args={[0.05, 1.1, 0.012]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>
      {/* Mirror to back face */}
      <mesh position={[x, yMid, -depth / 2 - 0.012]}>
        <boxGeometry args={[1.1, 1.3, 0.01]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>
      <mesh position={[x, yMid, -depth / 2 - 0.018]}>
        <boxGeometry args={[0.9, 1.1, 0.01]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.3} />
      </mesh>
      <mesh position={[x, yMid, -depth / 2 - 0.022]}>
        <boxGeometry args={[0.05, 1.1, 0.012]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>
    </>
  )
}

/** A commercial storefront on the front face: large display window, sign band above, door on the right. */
function Storefront({
  width,
  depth,
  signColor,
}: {
  width: number
  depth: number
  signColor: string
}) {
  const winH = 2.0
  const winY = winH / 2 + 0.35
  const winW = width * 0.62 // leave room for a door on one side
  const winX = -width * 0.1 // window slightly left of center
  const doorX = width * 0.36
  const signY = FLOOR_HEIGHT - 0.18

  return (
    <group>
      {/* Window frame (slightly larger box behind the glass) */}
      <mesh position={[winX, winY, depth / 2 + 0.013]}>
        <boxGeometry args={[winW + 0.18, winH + 0.18, 0.01]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>
      {/* Display glass */}
      <mesh position={[winX, winY, depth / 2 + 0.019]}>
        <boxGeometry args={[winW, winH, 0.01]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.25} />
      </mesh>
      {/* Mullions inside the display glass */}
      {[-0.33, 0, 0.33].map((f) => (
        <mesh key={f} position={[winX + f * winW, winY, depth / 2 + 0.023]}>
          <boxGeometry args={[0.07, winH - 0.05, 0.012]} />
          <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
        </mesh>
      ))}
      {/* Door (slightly recessed-looking — dark trim plate) */}
      <mesh position={[doorX, 1.05, depth / 2 + 0.014]}>
        <boxGeometry args={[1.0, 2.1, 0.01]} />
        <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
      </mesh>
      {/* Door window (small upper pane) */}
      <mesh position={[doorX, 1.75, depth / 2 + 0.02]}>
        <boxGeometry args={[0.7, 0.6, 0.008]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.3} />
      </mesh>
      {/* Sign band above the storefront, full width */}
      <mesh position={[0, signY + 0.3, depth / 2 + 0.013]}>
        <boxGeometry args={[width * 0.9, 0.55, 0.012]} />
        <meshStandardMaterial color={signColor} flatShading roughness={0.85} />
      </mesh>
    </group>
  )
}

/** A center-front entrance door at ground floor. Used by civic/residential. */
function EntranceDoor({ width: _w, depth }: { width: number; depth: number }) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 1.15, depth / 2 + 0.013]}>
        <boxGeometry args={[1.4, 2.5, 0.01]} />
        <meshStandardMaterial color={palette.civic.wallAlt} flatShading roughness={0.85} />
      </mesh>
      {/* Door slab */}
      <mesh position={[0, 1.05, depth / 2 + 0.019]}>
        <boxGeometry args={[1.1, 2.2, 0.01]} />
        <meshStandardMaterial color={palette.res.trim} flatShading roughness={0.7} />
      </mesh>
      {/* Transom window above the door */}
      <mesh position={[0, 2.3, depth / 2 + 0.019]}>
        <boxGeometry args={[1.1, 0.4, 0.01]} />
        <meshStandardMaterial color={palette.civic.glass} flatShading roughness={0.3} />
      </mesh>
      {/* Stoop / step */}
      <mesh position={[0, 0.08, depth / 2 + 0.45]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.16, 0.9]} />
        <meshStandardMaterial color={palette.sidewalk} flatShading roughness={0.9} />
      </mesh>
    </group>
  )
}

function Awning({
  color,
  stripeColor,
  width,
  depth,
  side,
}: {
  color: string
  stripeColor?: string
  width: number
  depth: number
  side: 'front' | 'back' | 'left' | 'right'
}) {
  const protrude = 1.4
  const y = FLOOR_HEIGHT * 0.95
  const aw = width * 0.92
  const ad = depth * 0.92

  // For striped awning: split into 6 stripes alternating colors. Each stripe is
  // a separate thin box. For solid awning: one box.
  const renderStrip = (
    sideSign: number,
    isFrontBack: boolean,
    yOffset = 0,
    tiltX = 0,
    tiltZ = 0,
  ) => {
    const stripLong = isFrontBack ? aw : ad
    const stripeCount = stripeColor ? 6 : 1
    return Array.from({ length: stripeCount }).map((_, i) => {
      const t0 = -stripLong / 2 + (i / stripeCount) * stripLong
      const t1 = -stripLong / 2 + ((i + 1) / stripeCount) * stripLong
      const center = (t0 + t1) / 2
      const len = t1 - t0
      const stripeC = stripeColor && i % 2 === 1 ? stripeColor : color
      const pos: [number, number, number] = isFrontBack
        ? [center, y + yOffset, sideSign * (depth / 2 + protrude / 2)]
        : [sideSign * (width / 2 + protrude / 2), y + yOffset, center]
      const args: [number, number, number] = isFrontBack
        ? [len, 0.1, protrude]
        : [protrude, 0.1, len]
      return (
        <mesh key={i} position={pos} rotation={[tiltX, 0, tiltZ]} castShadow>
          <boxGeometry args={args} />
          <meshStandardMaterial color={stripeC} flatShading roughness={0.8} />
        </mesh>
      )
    })
  }

  if (side === 'front') return <>{renderStrip(1, true, 0, -0.18, 0)}</>
  if (side === 'back') return <>{renderStrip(-1, true, 0, 0.18, 0)}</>
  if (side === 'right') return <>{renderStrip(1, false, 0, 0, 0.18)}</>
  return <>{renderStrip(-1, false, 0, 0, -0.18)}</>
}
