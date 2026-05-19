# STYLE.md — Jewels of Silicon Valley

The style bible. Every primitive, landmark, and scene reads from this file.
When code disagrees with this doc, the doc wins — fix the code.

Discipline: **restrained palette, consistent sun, soft AO, dense foliage.**
The reference image works because it has ~15 colors, one sun direction, and
trees softening every hard edge. We hold that line.

---

## 1. Color palette

All values are sRGB hex. They map 1:1 to `src/styles/palette.ts`. No
component file may contain a hardcoded color — it must import from palette.

### 1.1 Ground & infrastructure

| Token                  | Hex       | Use                                                         |
| ---------------------- | --------- | ----------------------------------------------------------- |
| `ground.grass`         | `#9bbf6b` | Default grass between buildings, parks, yards               |
| `ground.grassDark`     | `#7da352` | Grass under tree canopies (fake AO via vertex color)        |
| `ground.dirt`          | `#c2a878` | Baseball diamond infield, unpaved lots                      |
| `ground.sand`          | `#d8c89a` | Wide ground plane (the scene's "floor" beyond detailed area)|
| `road.asphalt`         | `#3f4046` | Road surface                                                |
| `road.asphaltDark`     | `#2f3035` | Road shadows / parking lot                                  |
| `road.lane`            | `#e8e6dc` | Lane markings & crosswalks                                  |
| `sidewalk`             | `#bcb6a3` | Sidewalks, plazas                                           |
| `water`                | `#7fb0c4` | Pond, fountain, pools                                       |

### 1.2 Building family A — Civic / modernist (white-cream)

For Sunnyvale Civic Center, modern office blocks, apartments on the right
side of the reference.

| Token            | Hex       | Use                            |
| ---------------- | --------- | ------------------------------ |
| `civic.wall`     | `#efe7d6` | Primary cream wall             |
| `civic.wallAlt`  | `#dcd2bd` | Secondary panel / shadow side  |
| `civic.trim`     | `#8d8579` | Window frames, parapet edges   |
| `civic.glass`    | `#3f6f86` | Tinted curtain wall            |
| `civic.glassLit` | `#5a8ea3` | Glass catching the sun         |
| `civic.roof`     | `#cdc4b0` | Flat roof (slightly cooler than walls) |

### 1.3 Building family B — Terracotta / Spanish revival residential

For most houses, the Caltrain station, and several Murphy Ave anchors.

| Token             | Hex       | Use                              |
| ----------------- | --------- | -------------------------------- |
| `res.wallCream`   | `#f1e6cf` | Stucco wall (default)            |
| `res.wallWarm`    | `#e8d2a9` | Warmer stucco variant            |
| `res.wallCool`    | `#dadbcf` | Cooler stucco variant (variation)|
| `res.roofTile`    | `#c0683d` | Terracotta clay tile (primary)   |
| `res.roofTileDark`| `#9a4f2c` | Roof shadow side                 |
| `res.trim`        | `#6e4632` | Door, window trim, fascia        |
| `res.chimney`     | `#a86348` | Brick chimney                    |

### 1.4 Building family C — Murphy Ave warm commercial

Mixed-color storefronts. **Rule: each color appears in at most ONE building
per block.** Variety reads as "designed"; repetition reads as a Lego dump.

| Token              | Hex       | Use                              |
| ------------------ | --------- | -------------------------------- |
| `mur.yellow`       | `#d9b34a` | Mustard storefront               |
| `mur.cream`        | `#e9d49a` | Pale yellow storefront           |
| `mur.sage`         | `#9bab7e` | Sage green storefront            |
| `mur.brick`        | `#a8553e` | Red brick storefront             |
| `mur.teal`         | `#5e8a87` | Teal storefront (accent, sparse) |
| `mur.awningRed`    | `#b85040` | Awning red                       |
| `mur.awningYellow` | `#d99c3a` | Awning yellow                    |
| `mur.awningGreen`  | `#5d7a48` | Awning green                     |
| `mur.awningStripe` | `#e8e6dc` | Awning white stripe              |

### 1.5 Foliage

| Token            | Hex       | Use                                       |
| ---------------- | --------- | ----------------------------------------- |
| `tree.broadDark` | `#3e6b3a` | Broadleaf canopy shadow / dense interior  |
| `tree.broadMid`  | `#5a8a48` | Broadleaf canopy primary                  |
| `tree.broadLite` | `#86a85c` | Broadleaf highlight (small accent meshes) |
| `tree.palmFrond` | `#6b9646` | Palm fronds                               |
| `tree.palmTrunk` | `#cdb98a` | Palm trunk (warm tan, NOT brown)          |
| `tree.broadTrunk`| `#5c4326` | Broadleaf trunk                           |

### 1.6 Cars (pick from this set only)

Six colors. No additions without updating this doc.

| Token         | Hex       |
| ------------- | --------- |
| `car.red`     | `#bf4634` |
| `car.yellow`  | `#d9b53d` |
| `car.blue`    | `#3a6a93` |
| `car.white`   | `#e8e3d4` |
| `car.gray`    | `#7d7e82` |
| `car.black`   | `#2c2e33` |

Distribution: ~30% white/gray, ~20% red, ~15% yellow, ~15% blue, ~10%
black, ~10% other-family extras. Yellow reads as taxi — use sparingly.

### 1.7 Sky / background

| Token       | Hex       | Use                                  |
| ----------- | --------- | ------------------------------------ |
| `sky.day`   | `#cfe4b3` | Canvas clear color (matches grass — the scene blends into infinity) |
| `sky.fog`   | `#d8e6c2` | Optional far fog tint                |

---

## 2. Lighting setup

**One sun. Always upper-right. Never move it.** Shadow direction must be
consistent across every scene we ever ship.

```ts
// Conceptual values — the canonical implementation lives in scene/Lights.tsx
sun.position = [25, 40, -15]   // x right, y up, z toward camera (-z = away)
sun.intensity = 1.15
sun.color = '#fff4d6'           // warm white, slight yellow

ambient.intensity = 0.35
ambient.color = '#e8efff'       // cool fill, balances warm sun

hemisphere.skyColor = '#cfe4b3' // matches sky.day
hemisphere.groundColor = '#9bbf6b' // matches grass — bounces green up
hemisphere.intensity = 0.55
```

- Shadows: PCF soft, map size 2048, camera bounds tight to the scene
  (-80..80 x, -80..80 z). Bias `-0.0005` to prevent acne on flat roofs.
- AO: subtle. If `<AO>` from drei is unstable, fake it with vertex-color
  darkening under tree canopies and at building bases (a single dark
  ring-quad sunk 0.01 into the ground).
- No bloom, no SSR, no chromatic aberration. **Performance > polish.**

---

## 3. Material rules

All materials are `MeshStandardMaterial`. No `MeshPhysicalMaterial`, no
`MeshPhongMaterial`, no custom shaders for v1.

| Surface           | roughness | metalness | flatShading |
| ----------------- | --------- | --------- | ----------- |
| Building walls    | 0.85      | 0.0       | true        |
| Roofs (tile)      | 0.95      | 0.0       | true        |
| Roofs (flat civic)| 0.85      | 0.0       | true        |
| Glass             | 0.25      | 0.0       | true        |
| Asphalt           | 0.95      | 0.0       | true        |
| Sidewalk          | 0.9       | 0.0       | true        |
| Tree canopy       | 1.0       | 0.0       | true        |
| Tree trunk        | 0.9       | 0.0       | true        |
| Car body          | 0.45      | 0.0       | true        |
| Car windows       | 0.2       | 0.0       | true        |
| Water             | 0.3       | 0.0       | false (smooth shading OK here) |

**flatShading: true is the visual identity.** It's what makes the polygons
read as facets. Lose this and the scene stops looking low-poly.

Geometry rules:
- Prefer Three.js primitives (Box/Cylinder/Cone/Sphere) with low segment
  counts. Spheres = 8 widthSegments, 6 heightSegments. Cones = 6 segments.
- Cylinders for trunks = 6 segments. Tree canopies are icosahedrons
  (`IcosahedronGeometry(r, 0)`) or scaled boxes — never spheres.
- Acceptable triangle budget per scene: ~80k triangles. Above that, audit.

---

## 4. Proportion rules

Everything is in **world units = meters** (informal). Pick coherent scales.

### 4.1 Buildings
- Floor height: **3.2 units** (one story).
- A "two-story" Murphy Ave shop: 6.4 units tall, 8–12 units wide,
  6–10 units deep.
- A single-family house footprint: 7×9 units, 3.2 tall (one story).
- Roof overhang on residential: **0.3 units** beyond walls on all sides.
- Roof pitch (gable): rise = depth × 0.35. Hip roofs: same rise, beveled.
- Civic block (Civic Center main mass): 18–22 wide, 12–16 deep,
  9.6 tall (3 stories).

### 4.2 Roads
- Lane width: **2.5 units**.
- 2-lane road: 5 units travel + 2× 0.5 shoulder = **6 units total width**.
- Sidewalk width: **1.5 units**, raised 0.1 above road.
- Road is sunk 0.01 below grass (so grass edge wins z-fight).
- Lane stripes: 0.12 wide, 1.5 long, 1.5 gap. Yellow center stripes are
  solid; white edge stripes are dashed.
- Crosswalk: 6 white bars, each 0.5 × 2.5, perpendicular to travel.

### 4.3 Trees
- Broadleaf: **trunk 1.8 tall × 0.25 radius**, canopy icosahedron
  radius **1.4–1.8** (vary ±15%). Total tree ~3.2–3.6 tall.
- Big broadleaf (oak): trunk 2.4 × 0.35, canopy radius 2.4. Total ~4.8.
- Palm: **trunk 6 tall, taper from 0.25 base to 0.18 top**, fronds a
  short cone or 6-bladed star, frond radius 1.6. Total ~7.6.
- Trees never sit perfectly upright on a grid — apply ±0.05 rad random
  tilt and ±0.15 random scale per instance (cheap, big readability win).

### 4.4 Cars
- Length 2.2, width 1.0, height 0.7 (body) + 0.4 (cabin).
- One car = ~44% of a lane width. Two cars never share a lane.
- Wheels: 4 short cylinders, radius 0.18, hidden 0.05 below body. Don't
  spend triangles on wheel detail — flat black discs are fine.

### 4.5 Misc
- WaterTower (Heritage Park style): legs 12 tall, tank diameter 5,
  tank height 4.5, conical top adds 1.5. Total ~18.
- Train cars: length 7, width 1.4, height 1.6 (sit on a 0.15 deck).
- Caltrain track gauge: 1.4 unit visual gauge (not real-world prototype).

---

## 5. Density rules

Match the reference image's "every gap has a tree" feeling. Sparse low-poly
scenes look like programmer art; dense ones read as designed.

| Element                  | Target density                                |
| ------------------------ | --------------------------------------------- |
| Trees per residential block | **8–12** (a "block" = one 30×30 area)      |
| Trees along a road       | **1 per 4–6 units** of road length, both sides|
| Trees in a park          | **0.05 per sq unit** (so 40×30 park = ~60 trees) |
| Palms vs broadleaf       | **25% palm / 75% broadleaf** overall          |
| Cars in a parking row    | **1 per 2.5 units** of row length             |
| Cars on a road segment   | **1 per 25 units** (light traffic feel)       |
| Houses per residential block | **4** (one per quadrant), staggered      |
| Pedestrians              | **none** in v1                                |

Tree placement jitter: ±0.8 units from the ideal grid point. A perfect
grid of trees looks like a parking lot for trees.

---

## 6. Camera defaults

Perspective camera with **long focal length to fake isometric**. Not an
orthographic camera — perspective gives slight depth cue, and `OrthographicCamera`
+ drei has known pan/zoom edge cases we don't want to debug.

```ts
camera = {
  position: [60, 55, 60],    // ~35° elevation, ~45° azimuth
  fov: 22,                   // long lens = compressed perspective
  near: 0.1,
  far: 500,
  zoom: 1.0,
}
```

- Elevation: **35°** (arctan(55 / √(60² + 60²)) ≈ 33° — close enough).
- Azimuth: **45°** measured from the scene's +x axis around y.
- The camera looks at the origin by default. Each landmark defines its own
  fly-to target.
- Mobile: drop fov to 28 (otherwise the scene reads too small).
- OrbitControls: enable damping, polar angle clamped to `[0.2, π/2 - 0.05]`
  so users can't go below ground or look straight down. Min distance 25,
  max distance 130.

Fly-to (when a landmark is clicked):
- Linear interp over 1.0s (no easing curve in v1).
- Target = landmark.position + landmark.cameraOffset (default offset:
  `[18, 20, 18]`).
- LookAt = landmark.position + [0, landmark.height/2, 0].

---

## 7. Composition rules of thumb

These aren't enforced by code but every PR should self-check:

1. **No pure saturated colors.** If a hex value has a channel at 0xff or
   0x00, desaturate it.
2. **Soften every building with at least one tree adjacent.** No naked
   wall reads to the camera without foliage nearby.
3. **Roof tile color is the loudest thing in residential blocks.** Don't
   let any other element compete with it (no neon cars next to red roofs).
4. **One color per Murphy Ave storefront.** Variety across the row, not
   within a single facade.
5. **Shadows always fall toward the lower-left** (the sun is upper-right).
   If a screenshot shows shadows going the wrong way, the lighting rig has
   drifted — fix immediately.
6. **Negative space is a feature.** A patch of plain grass between two
   busy blocks is intentional. Don't fill every square unit with detail.

---

## 8. What this doc deliberately does NOT cover

- Animations (train movement, car movement) — TBD post-v1.
- Day/night cycle — single fixed time of day for v1.
- Weather, particles, water reflections — not in v1.
- Pedestrians — not in v1.

When in doubt about something not listed here: **err toward less.**
