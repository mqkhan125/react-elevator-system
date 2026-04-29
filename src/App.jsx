import ControlPanel from "./Componets/ControlPanel"
import Lift from "./Componets/Lift"

const App = () => {
  return (
    <>
    <div className="flex justify-center items-center gap-8">
    <ControlPanel />
    <Lift />
    </div>
    </>
  )
}

export default App