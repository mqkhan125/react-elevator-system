import { useEffect, useState } from "react";

const Lift = ({ queue, setQueue }) => {
  const [isMoving, setIsMoving] = useState(false);
  const [liftStatus, setLiftStatus] = useState("Idle");
  const [currentFloor, setCurrentFloor] = useState(0);
  let floors = Array.from({ length: 10 }, (_, i) => 9 - i);

  useEffect(() => {
    if (queue.length > 0 && liftStatus === "IDLE") {
      processNextFloor();
    }
  }, [queue, liftStatus]);

  const processNextFloor = () => {
    if (queue.length === 0) return; // safety

    const nextFloorRaw = queue[0];
    const targetFloor = nextFloorRaw === "G" ? 0 : nextFloorRaw;

    moveToFloor(targetFloor);
  };

  const moveToFloor = (targetFloor) => {
    setLiftStatus("MOVING");
    setIsMoving(true);

    const distance = Math.abs(targetFloor - currentFloor);
    const travelDuration = distance * 2000;

    setCurrentFloor(targetFloor);

    setTimeout(() => {
      stopAtFloor();
    }, travelDuration);
  };

  const stopAtFloor = () => {
    setLiftStatus("STOP");

    setTimeout(() => {
      completeRequest();
    }, 3000);
  };

  const completeRequest = () => {
    setQueue((prev) => prev.slice(1));

    if (queue.length <= 1) {
      setLiftStatus("IDLE");
      setIsMoving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-80 h-[600px] bg-gray-200 border-2 border-gray-400 rounded-lg overflow-hidden">
        <div className="flex flex-col h-full">
          {floors.map((floor) => (
            <div
              key={floor}
              className="flex-1 border-b border-gray-300 flex items-center justify-between px-3"
            >
              <span className="text-sm font-semibold text-gray-700">
                {floor === 0 ? "G" : floor}
              </span>
              <div className="w-10 h-full border-l border-gray-400 bg-gray-100"></div>
            </div>
          ))}
        </div>
        <div
          className="absolute bottom-0 right-0 w-12 h-[60px] bg-red-500 rounded-md shadow-lg
         flex items-center justify-center text-white text-md font-bold"
        >
          🚪
        </div>
      </div>
    </div>
  );
};

export default Lift;
