import { CityScene } from './components/scene/CityScene'
import { TestScene } from './components/scene/TestScene'

/**
 * App entry point. v1 step 4 — primitive tuning view.
 * Will be replaced with the Sunnyvale scene at step 6.
 */
export default function App() {
  return (
    <div className="fixed inset-0">
      <CityScene grass={{ width: 100, depth: 90 }}>
        <TestScene />
      </CityScene>
      <div className="pointer-events-none fixed left-4 top-4 rounded-md bg-white/85 px-3 py-1.5 text-xs font-mono uppercase tracking-wide text-ink shadow-sm">
        Jewels of Silicon Valley · primitive kit (step 4)
      </div>
      <div className="pointer-events-none fixed bottom-4 left-4 rounded-md bg-white/70 px-2 py-1 text-[10px] font-mono text-ink shadow-sm">
        drag = orbit · scroll = zoom · right-drag = pan
      </div>
    </div>
  )
}
