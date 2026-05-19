import { Html } from '@react-three/drei'
import { ReactNode } from 'react'
import {
  Building,
  House,
  Tree,
  Road,
  Car,
  Park,
  TrainStation,
  TrainTrack,
  Train,
  WaterTower,
  CafeTable,
  Gazebo,
  Fountain,
  ParkingLot,
  Bench,
} from '../primitives'
import { palette } from '../../styles/palette'

/**
 * Step 4 test scene. One of each primitive on a flat plane, with floating
 * labels so we can name each shape from above. NOT shipped to users —
 * Sunnyvale scene replaces this in step 6.
 */
export function TestScene() {
  return (
    <>
      {/* Row A — Buildings (z = -22). Civic has rooftop mechanicals; Murphy gets striped awning. */}
      <Label position={[-28, 10, -28]}>Buildings</Label>
      <Building
        position={[-18, 0, -22]}
        floors={3}
        width={9}
        depth={9}
        roofStyle="flat"
        colorFamily="civic"
        rooftopMechanicals
      />
      <Building
        position={[-4, 0, -22]}
        floors={2}
        width={8}
        depth={8}
        roofStyle="hip"
        colorFamily="residential"
      />
      <Building
        position={[10, 0, -22]}
        floors={2}
        width={9}
        depth={7}
        roofStyle="flat"
        colorFamily="commercial"
        accentColor={palette.mur.yellow}
        awningColor={palette.mur.awningRed}
        awningStripeColor={palette.mur.awningStripe}
        awningSide="front"
        signColor={palette.mur.brick}
      />
      <Building
        position={[22, 0, -22]}
        floors={2}
        width={7}
        depth={7}
        roofStyle="gable"
        colorFamily="commercial"
        accentColor={palette.mur.sage}
        awningColor={palette.mur.awningGreen}
        awningStripeColor={palette.mur.awningStripe}
        awningSide="front"
        signColor={palette.res.trim}
      />

      {/* Cafe tables in front of Murphy storefronts */}
      <CafeTable position={[8, 0, -16.5]} umbrellaColor={palette.mur.awningRed} />
      <CafeTable position={[12, 0, -16.5]} umbrellaColor={palette.mur.awningYellow} chairs={2} />
      <CafeTable position={[20, 0, -16.5]} umbrellaColor={palette.mur.awningGreen} />

      {/* Row B — Houses (z = -10). One with garage + driveway. */}
      <Label position={[-28, 6, -12]}>Houses</Label>
      <House position={[-18, 0, -10]} style="ranch" garage />
      <House position={[-4, 0, -10]} style="spanish" pool />
      <House position={[10, 0, -10]} style="modernist" />

      {/* Row C — Trees + WaterTower (z = 0). With a fountain between them and a bench. */}
      <Label position={[-28, 6, -3]}>Trees + plaza</Label>
      <Tree position={[-18, 0, 0]} variant="palm" />
      <Tree position={[-10, 0, 0]} variant="broadleaf" />
      <Tree position={[-2, 0, 0]} variant="oak" />
      <Fountain position={[4, 0, 0]} />
      <Bench position={[7, 0, 0.5]} rotation={[0, Math.PI / 2, 0]} />
      <WaterTower position={[18, 0, 0]} label="SUNNYVALE" />

      {/* ParkingLot tucked between rows C and D — typical of strip-mall layouts */}
      <ParkingLot position={[-14, 0, 5]} width={10} depth={5} rows={1} />
      <Car position={[-16, 0, 5]} color="red" rotation={[0, Math.PI, 0]} />
      <Car position={[-13.5, 0, 5]} color="white" rotation={[0, Math.PI, 0]} />
      <Car position={[-11, 0, 5]} color="blue" rotation={[0, Math.PI, 0]} />

      {/* Row D — Road with cars (z = 10) */}
      <Label position={[-28, 4, 7]}>Road</Label>
      <Road
        position={[0, 0, 10]}
        length={42}
        lanes={2}
        markings
        sidewalks
        crosswalkEnd
      />
      <Car position={[-9, 0, 8.5]} color="red" />
      <Car position={[-3, 0, 11.5]} color="yellow" rotation={[0, Math.PI, 0]} />
      <Car position={[5, 0, 11.5]} color="white" rotation={[0, Math.PI, 0]} />
      <Car position={[14, 0, 8.5]} color="gray" />

      {/* Row E — Park (with gazebo) + Station */}
      <Label position={[-28, 4, 18]}>Park + Station</Label>
      <Park position={[-18, 0, 22]} width={18} depth={12} pond baseball path />
      <Gazebo position={[-22, 0, 19]} />
      <Bench position={[-15, 0, 19]} />
      <TrainStation position={[10, 0, 24]} length={14} depth={5} />
      <TrainTrack position={[10, 0, 18]} length={26} />
      <Train position={[10, 0, 18]} cars={2} />
    </>
  )
}

function Label({ position, children }: { position: [number, number, number]; children: ReactNode }) {
  return (
    <Html position={position} center distanceFactor={26} occlude={false}>
      <div className="rounded bg-white/85 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-ink shadow-sm whitespace-nowrap">
        {children}
      </div>
    </Html>
  )
}
