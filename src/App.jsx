import { useState } from "react";
import ControlPanel from "./Componets/ControlPanel";
import Lift from "./Componets/Lift";

const App = () => {
  const [queue, setQueue] = useState([]);
  const [isEmergency, setIsEmergency] = useState(false);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 bg-gray-100 min-h-screen p-6">
      <ControlPanel
        queue={queue}
        setQueue={setQueue}
        isEmergency={isEmergency}
        setIsEmergency={setIsEmergency}
      />
      <Lift
        queue={queue}
        setQueue={setQueue}
        isEmergency={isEmergency}
        setIsEmergency={setIsEmergency}
      />
    </div>
  );
};

export default App;
