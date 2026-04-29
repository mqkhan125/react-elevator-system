import { useState } from "react";
import Button from "./Button";

const ControlPanel = () => {
  const [queue, setQueue] = useState([]);
  const buttons = ["G", 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleValue = (floorId) => {
    setQueue((prevQueue) => {
        if(prevQueue.includes(floorId)){
            return prevQueue.filter((id) => id !== floorId)
        } else {
            return [...prevQueue, floorId]
        }
    })
  };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-center mb-4">
            Lift Control Panel
          </h2>

          <p className="text-center text-sm text-gray-600 mb-4">
            Selected Floors: {`[${queue.join(", ")}]`}
          </p>

          <div className="grid grid-cols-5 gap-3">
            {buttons.map((floor) => (
              <Button
                key={floor}
                floor={floor}
                handleValue={handleValue}
                queue={queue}
              />
            ))}
          </div>
        </div>
      </div>
    );
};

export default ControlPanel;
