import { useState } from "react";
import ControlPanel from "./Componets/ControlPanel";
import Lift from "./Componets/Lift";

const App = () => {
  const [queue, setQueue] = useState([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10 bg-slate-100 min-h-screen p-4 lg:p-8 font-sans">
      {/* order-2 lg:order-1 ensures Panel goes to bottom on mobile, left on desktop */}
      <div className="order-2 lg:order-1 w-full max-w-xs lg:w-80">
        <ControlPanel
          queue={queue}
          setQueue={setQueue}
          isEmergency={isEmergency}
          setIsEmergency={setIsEmergency}
          currentFloor={currentFloor}
        />
      </div>

      {/* order-1 lg:order-2 ensures Lift stays on top on mobile, right on desktop */}
      <div className="order-1 lg:order-2 w-full max-w-xs lg:w-80">
        <Lift
          queue={queue}
          setQueue={setQueue}
          isEmergency={isEmergency}
          currentFloor={currentFloor}
          setCurrentFloor={setCurrentFloor}
        />
      </div>
    </div>
  );
};

export default App;
