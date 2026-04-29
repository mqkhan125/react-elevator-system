import { useState } from "react"
import ControlPanel from "./Componets/ControlPanel"
import Lift from "./Componets/Lift"

const App = () => {
  const [queue , setQueue] = useState([])
  return (
    <>
    <div className="flex justify-center items-center gap-8">
    <ControlPanel queue={queue}
    setQueue={setQueue} />
    <Lift queue={queue} setQueue={setQueue}/>
    </div>
    </>
  )
}

export default App