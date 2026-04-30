import { useEffect, useState, useRef } from "react";

const Lift = ({ queue, setQueue }) => {
  const [liftStatus, setLiftStatus] = useState("IDLE");
  const [currentFloor, setCurrentFloor] = useState(0);

  const intervalRef = useRef(null);

  let floors = Array.from({ length: 10 }, (_, i) => 9 - i);

  useEffect(() => {
    if (queue.length > 0 && liftStatus === "IDLE") {
      processNextFloor();
    }
  }, [queue, liftStatus]);

  const processNextFloor = () => {
    if (queue.length === 0) return;

    const targetFloor = queue[0] === "G" ? 0 : queue[0];
    moveToFloor(targetFloor);
  };

  const moveToFloor = (targetFloor) => {
    setLiftStatus("MOVING");

    // safety: stop previous interval if any
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentFloor((prev) => {
        const step = targetFloor > prev ? 1 : -1;
        const next = prev + step;

        if (next === targetFloor) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          stopAtFloor();
        }

        return next;
      });
    }, 2000);
  };

  const stopAtFloor = () => {
    setLiftStatus("STOP");

    setTimeout(() => {
      completeRequest();
    }, 3000);
  };

  const completeRequest = () => {
    setQueue((prev) => {
      const updated = prev.slice(1);

      if (updated.length === 0) {
        setLiftStatus("IDLE");
      }

      return updated;
    });
  };

  const FLOOR_HEIGHT = 60;

  const liftStyle = {
    top: `${(9 - currentFloor) * FLOOR_HEIGHT}px`,
    transition: "top 0.5s ease-in-out",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-80 h-[600px] bg-gray-200 border-2 border-gray-400 rounded-lg overflow-hidden">
        {/* Floors */}
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

        {/* Lift box */}
        <div
          className="absolute bottom-0 right-0 w-12 h-[60px] bg-red-500 rounded-md shadow-lg
            flex items-center justify-center text-white text-md font-bold"
          style={liftStyle}
        >
          🚪
        </div>
      </div>
    </div>
  );
};

export default Lift;
