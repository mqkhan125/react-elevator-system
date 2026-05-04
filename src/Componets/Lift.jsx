import { useEffect, useState, useRef } from "react";

const Lift = ({ queue, setQueue, isEmergency }) => {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [direction, setDirection] = useState("idle"); 
  const [doorOpen, setDoorOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  const moveRef = useRef(null);
  const timerRef = useRef(null);

  const FLOOR_HEIGHT = 52;
  const floors = Array.from({ length: 10 }, (_, i) => 9 - i);

  // normalize queue (G → 0)
  const normalize = (arr) => arr.map((f) => (f === "G" ? 0 : f));

  // 🚆 MOVE LIFT (2 sec per floor)
  useEffect(() => {
    if (direction === "idle" || isEmergency || doorOpen) return;

    moveRef.current = setTimeout(() => {
      setCurrentFloor((prev) => {
        if (direction === "up") return prev + 1;
        if (direction === "down") return prev - 1;
        return prev;
      });
    }, 2000);

    return () => clearTimeout(moveRef.current);
  }, [currentFloor, direction, isEmergency, doorOpen]);

  // 🛑 STOP AT FLOOR (after reaching)
  useEffect(() => {
    const normalized = normalize(queue);

    if (normalized.includes(currentFloor)) {
      // stop movement
      setDirection("idle");

      // slight delay for smooth arrival
      const arriveDelay = setTimeout(() => {
        setDoorOpen(true);
        setTimer(3);

        // remove floor from queue
        setQueue((prev) =>
          prev.filter((f) => {
            const val = f === "G" ? 0 : f;
            return val !== currentFloor;
          }),
        );

        // wait 3 sec
        const doorTimer = setTimeout(() => {
          setDoorOpen(false);
          setTimer(0);
          decideDirection();
        }, 3000);

        return () => clearTimeout(doorTimer);
      }, 200);

      return () => clearTimeout(arriveDelay);
    }
  }, [currentFloor]);

  // ⏱ TIMER DISPLAY
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timer]);

  // 🔁 DECIDE NEXT DIRECTION (simple & correct)
  const decideDirection = () => {
    const normalized = normalize(queue);

    let hasUp = false;
    let hasDown = false;

    normalized.forEach((f) => {
      if (f > currentFloor) hasUp = true;
      if (f < currentFloor) hasDown = true;
    });

    if (hasUp) setDirection("up");
    else if (hasDown) setDirection("down");
    else setDirection("idle");
  };

  // ▶ START MOVEMENT WHEN QUEUE COMES
  useEffect(() => {
    if (queue.length > 0 && direction === "idle" && !isEmergency) {
      const target = queue[0] === "G" ? 0 : queue[0];

      if (target > currentFloor) setDirection("up");
      else if (target < currentFloor) setDirection("down");
    }
  }, [queue, direction, isEmergency]);

  const liftPosition = (9 - currentFloor) * FLOOR_HEIGHT;

  return (
    <div className="relative w-80 h-[560px] bg-gray-100 border-2 border-gray-400 rounded-md overflow-hidden flex flex-col shadow-md">
      {/* HEADER */}
      <div className="bg-gray-800 p-2 border-b border-gray-400 flex justify-between items-center px-6 text-white">
        <span className="text-xs font-mono">
          Status: {isEmergency ? "EMERGENCY" : direction.toUpperCase()}
        </span>

        <span className="text-xs">
          {direction === "up" ? "⬆️" : direction === "down" ? "⬇️" : "⏹️"}
        </span>
      </div>

      {/* FLOORS */}
      <div className="relative flex-col flex h-full justify-between">
        {floors.map((floor) => (
          <div
            key={floor}
            className="flex-1 border-b border-gray-300 flex items-center justify-between px-5 bg-black text-white font-bold"
          >
            <span>{floor === 0 ? "G" : floor}</span>
            <div className="w-10 h-full border-l border-gray-500"></div>
          </div>
        ))}

        {/* LIFT */}
        <div
          className="absolute right-0 w-24 h-[50px] flex items-center gap-1 transition-all duration-300"
          style={{
            top: `${liftPosition}px`,
            transition: "top 1.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* TIMER */}
          {timer > 0 && (
            <div className="bg-blue-600 text-white px-2 py-1 text-xs rounded animate-pulse">
              ⏰ {timer}s
            </div>
          )}

          {/* CABIN */}
          <div className="w-12 h-[50px] bg-red-500 rounded flex items-center justify-center text-white font-bold relative overflow-hidden">
            {/* DOOR ANIMATION */}
            <div
              className={`absolute left-0 top-0 w-1/2 h-full bg-gray-700 transition-transform duration-500 ${
                doorOpen ? "-translate-x-full" : "translate-x-0"
              }`}
            />
            <div
              className={`absolute right-0 top-0 w-1/2 h-full bg-gray-700 transition-transform duration-500 ${
                doorOpen ? "translate-x-full" : "translate-x-0"
              }`}
            />

            <span className="z-10">
              {currentFloor === 0 ? "G" : currentFloor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lift;
