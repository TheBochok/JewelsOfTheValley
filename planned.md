# Planned

Living plan for Jewels of Silicon Valley. Update when scope changes.

---

## ✅ Done

### Step 1 — Scaffold
- Vite + React 18 + TypeScript strict
- `@react-three/fiber`, `@react-three/drei`, `three`, `zustand`, `tailwindcss`
- Directory layout per spec
- Blank R3F Canvas with OrbitControls renders
- `npm run build` & `tsc -b` clean

### Step 2 — STYLE.md
- 8-section style bible at `src/styles/STYLE.md`
- ~50 hex tokens across ground/roads, three building families, trees, cars
- Lighting rig (sun, ambient, hemisphere) locked
- Material rules (`MeshStandardMaterial` + `flatShading: true` everywhere)
- Proportion + density + camera defaults

### Step 3 — Primitive kit
Located in `src/components/primitives/`:
- `Building` — floors/width/depth, three roof styles, three colorFamilies, accentColor, awningColor/Side/StripeColor, storefront, entrance, rooftopMechanicals, signColor
- `House` — three styles (ranch/spanish/modernist), pool, garage, porch
- `Tree` + `TreeField` — palm / broadleaf / oak, instanced bulk placement
- `Road` — length / lanes / markings / sidewalks / crosswalk
- `Car` — 6 palette colors
- `Park` — pond / baseball / path
- `TrainStation` + `TrainTrack` — Spanish revival depot
- `Train` — bilevel Caltrain set, locomotive
- `WaterTower` — splayed legs + X-bracing + drei `<Text>` label
- `CafeTable` — table + chairs + striped umbrella
- `Gazebo` — octagonal park structure
- `Fountain` — octagonal basin + spout
- `ParkingLot` — asphalt + parking lines
- `Bench` — park bench
- `roofs.tsx` — `FlatRoof` / `GableRoof` / `HipRoof` with proper ridge-on-longer-axis hip logic
- Central `src/styles/palette.ts` — no component hardcodes hex values

### Step 4 — Test scene
- One of each primitive arranged in labeled rows
- Used as a tuning view; replaced by Sunnyvale scene in step 6

### Iterations on top of step 3 (per user feedback)
- Hip roof ridge axis bug (Spanish house was a degenerate pyramid)
- Water tower: chunkier legs + real X-bracing
- Civic glass bands made taller with spandrels
- Oak tree distinctly bigger than broadleaf
- Pool: real raised deck + sunken basin
- Train station: thicker canopy + fascia trim
- Z-fighting fixes: road/grass coplanarity, roof soffit vs wall top, window/glass piercing walls
- Per-building detail: cornice band, ground-floor plinth, vertical window mullions on civic glass, window frames around punched windows, commercial storefronts with sign bands, entrance doors with frames/transoms/stoops
- House front porches (columns + slab + step) — modernist gets a flat slab canopy instead
- Set-dressing primitives (CafeTable, Gazebo, Fountain, ParkingLot, Bench)
- Striped-awning option on Building
- Rooftop mechanicals on flat-roof buildings
- Garage door + driveway option on House

---

## 🔜 Next up (the original Step 5 → Step 8 path)

### Step 5 — Hero Sunnyvale landmarks
`src/components/landmarks/sunnyvale/` — one custom component per hero, each composing primitives + adding the specifics that distinguish it from a generic instance.

- [ ] **WaterTower** (Heritage Park) — `<WaterTower label="SUNNYVALE">` wrapped with the landmark's info + click target. May add a small adjacent service building from the actual site.
- [ ] **MurphyAvenue** — cluster of ~6 two-story Spanish revival commercial buildings. Each storefront is a `Building` with a distinct accent color drawn from `palette.mur.*`. Striped awnings, café tables out front, parked cars along the curb.
- [ ] **CivicCenter** — large modernist white/glass complex. Needs multi-mass composition (probably 2–3 building boxes adjacent), not just one `Building`. Plaza out front. Flag pole.
- [ ] **CaltrainStation** — `TrainStation` + `TrainTrack` + `Train`, sized + oriented per the real station footprint. Parking lot adjacent.

Landmarks 5 & 6 (Las Palmas Park, Washington Park) just use `Park` with appropriate config — no custom component needed.

### Step 6 — Generators + full Sunnyvale composition
`src/cities/sunnyvale.config.ts` is a data file. Place hero landmarks by position, then use generator functions to scatter ambient density:

- [ ] `generateRoadGrid(bounds, spacing)` — array of road segments
- [ ] `generateResidentialBlock({ origin, width, depth })` — 4 houses per block, varied styles, scattered
- [ ] `scatterTreesAlongRoad(road, { density, palmRatio })` — palm/broadleaf mix along sidewalks
- [ ] `scatterTreesInArea(bounds, { density, exclusions })` — fill yards/park interiors
- [ ] `parkedCarsAlongRoad(road, { spacing, palette })` — curb-side cars
- [ ] Validate density targets from STYLE.md §5 (8–12 trees/block, 25/75 palm/broadleaf, etc.)
- [ ] Triangle count audit; aim ≤ 80k tris

### Step 7 — UI overlay + camera fly-to
- [ ] `src/store/useAppStore.ts` — Zustand store: selectedLandmarkId, selectedLandmarkInfo, cameraTarget
- [ ] `src/components/ui/InfoPanel.tsx` — right-side panel, bottom-sheet on mobile (Tailwind responsive)
- [ ] `src/components/ui/LandmarkHotspot.tsx` — drei `<Html occlude>` indicator floating above each landmark, click → store update
- [ ] Camera fly-to: linear lerp ~1s from current camera state to `landmark.position + landmark.cameraOffset`
- [ ] Mobile touch testing (pinch zoom, single-finger orbit)
- [ ] Small wordmark in corner ("Sunnyvale")

### Step 8 — Deploy to Vercel
- [ ] `vercel.json` (probably unnecessary for plain Vite, but check)
- [ ] Manual-chunks config to split three.js into its own vendor chunk (current bundle is 1.1MB single file)
- [ ] Verify mobile performance on a 2-year-old Android (per perf budget in step 1 spec)
- [ ] Deploy from `main` branch
- [ ] Smoke test on the deployed URL

---

## 🛠 Backlog — quality items not yet done

Things I flagged in review but didn't implement. Pull from this when polishing.

### Building primitive
- [ ] **Setback option** — top floor recessed for taller civic buildings (e.g., 3-story with top 1 floor narrower)
- [ ] **Multi-mass option** — L-shape or T-shape footprint (two boxes joined)
- [ ] **Corner pilasters** — vertical accent strips at building corners on commercial
- [ ] **Balconies** for residential / apartment family
- [ ] **Building name signage** above entrance (drei `<Text>` for landmarks)
- [ ] **More roof variety** — Mansard, shed, butterfly

### Murphy Ave specifics (for landmark composition in step 5)
- [ ] **2-color storefront alternation** — one shop is yellow w/ red awning, next is sage w/ green-striped awning, etc.
- [ ] **Outdoor dining clusters** in front of each storefront (already have primitive — needs composition)
- [ ] **Mixed sign band content** — different sign colors per shop

### House primitive
- [ ] **Mailbox** at curb
- [ ] **Side yard fence**
- [ ] **Front yard walkway** (sidewalk → porch)
- [ ] **Roof variation per house** (some terracotta, some dark, some cool gray)
- [ ] **Optional dormer windows** on gable roofs

### Tree primitive
- [ ] **Bushes / small shrub variant** — for ground-cover variety
- [ ] **Conifer variant** — for an occasional cypress
- [ ] **More size variation on palms** — currently uniform per call
- [ ] **Slight tilt jitter** baked into `TreeField` (random ±0.05 rad per instance)

### Car primitive
- [ ] **SUV / truck variant** — taller silhouette
- [ ] **Variable window glass color** — currently all `civic.glass` blue; some should be near-black

### Park primitive
- [ ] **Playground equipment** — slide, swing set (visible in reference)
- [ ] **Curved path** instead of single straight diagonal

### Scene infrastructure
- [ ] **Subtle AO** under building bases & under tree canopies (vertex-color faked or SSAO post)
- [ ] **Fog tuning** — currently `[130, 280]`, may need adjustment for landmark distances
- [ ] **Frustum-cull verification** for instanced fields (drei `<Instances>` should handle but verify)
- [ ] **Codepath for high-DPI capping** — currently `dpr={[1, 2]}`, may need 1.5 cap on mobile

---

## 🚫 Out of scope for v1
(Per STYLE.md §8 — revisit post-launch.)

- Animations: train movement, car movement, fountain spray
- Day/night cycle or alternative sun positions
- Weather, particles, water surface reflections
- Pedestrians
- Audio
- Sharing / deep-linking specific landmarks via URL params
- Multi-city: SwitchCity, top nav, additional 9 cities

---

## Open questions for the user

- Do you want me to bake the Murphy striped-awning text/signage as real readable text (using drei `<Text>` per shop, slower but recognizable)? Or keep as colored bands (faster, abstract)?
- Apartment building (visible on reference image right side, 5-story complex multi-color facade): do you want a landmark for this specifically in Sunnyvale, or skip until other cities?
- Mobile touch behavior: should pinch-to-zoom + drag-to-orbit be the only interaction, or do we add tap-on-landmark too (with a slight tolerance)? OrbitControls' default is fine but tap targeting is harder.
- Deployment platform: spec says Vercel — confirmed, or open to Netlify/Cloudflare?
