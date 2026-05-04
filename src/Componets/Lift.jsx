import { useEffect, useState, useRef } from "react";

const Lift = ({
  queue,
  setQueue,
  isEmergency,
  currentFloor,
  setCurrentFloor,
}) => {
  const [direction, setDirection] = useState("idle");
  const [doorOpen, setDoorOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  const moveRef = useRef(null);
  const timerRef = useRef(null);

  const FLOOR_HEIGHT = 51;
  const floors = Array.from({ length: 10 }, (_, i) => 9 - i);

  const normalize = (arrQueue) => arrQueue.map((f) => (f === "G" ? 0 : f));

  // for lift moving (2 sec per floor)
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

  // for lift stop (waiting 3 sec)
  useEffect(() => {
    const normalized = normalize(queue);

    if (normalized.includes(currentFloor)) {
      setDirection("idle");

      const arriveDelay = setTimeout(() => {
        setDoorOpen(true);
        setTimer(3);

        setQueue((prev) =>
          prev.filter((f) => {
            const val = f === "G" ? 0 : f;
            return val !== currentFloor;
          }),
        );

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

  // timer
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timer]);

  const decideDirection = () => {
    const normalized = normalize(queue);

    let up = false;
    let down = false;

    normalized.forEach((f) => {
      if (f > currentFloor) up = true;
      if (f < currentFloor) down = true;
    });

    if (up) setDirection("up");
    else if (down) setDirection("down");
    else setDirection("idle");
  };

  useEffect(() => {
    if (queue.length > 0 && direction === "idle" && !isEmergency) {
      const target = queue[0] === "G" ? 0 : queue[0];

      if (target > currentFloor) setDirection("up");
      else if (target < currentFloor) setDirection("down");
    }
  }, [queue, direction, isEmergency]);

  const liftPosition = (9 - currentFloor) * FLOOR_HEIGHT;

  return (
    <div className="relative w-80 h-[560px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-3 border-b border-slate-800 flex justify-between px-6 text-slate-200 text-xs tracking-wider items-center">
        <span className="font-semibold flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isEmergency
                ? "bg-purple-500 animate-ping"
                : direction !== "idle"
                  ? "bg-green-500 animate-pulse"
                  : "bg-blue-400"
            }`}
          />
          Status: {isEmergency ? "EMERGENCY" : direction.toUpperCase()}
        </span>

        <span className="text-lg">
          {direction === "up" ? (
            <span className="text-green-400 animate-bounce">⬆️</span>
          ) : direction === "down" ? (
            <span className="text-rose-400 animate-bounce">⬇️</span>
          ) : (
            <span className="text-blue-400">⏹️</span>
          )}
        </span>
      </div>

      {/* Floors Layout */}
      <div className="relative flex flex-col h-full justify-between select-none">
        {floors.map((floor) => (
          <div
            key={floor}
            className="flex-1 border-b border-slate-900 flex items-center justify-between px-6 text-slate-500 font-mono text-sm bg-slate-950/20 backdrop-blur-sm"
          >
            <span>Floor {floor === 0 ? "G" : floor}</span>
            <div className="w-12 border-b border-dashed border-slate-800" />
          </div>
        ))}

  
        <div
          className="absolute right-0 w-28 h-[50px] flex items-center gap-2 px-1"
          style={{
            top: `${liftPosition}px`,
            transition: "top 1.7s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {timer > 0 && (
            <div className="bg-teal-950 text-teal-400 border border-teal-500/30 text-[10px] px-2.5 py-1 rounded-lg font-black animate-pulse flex items-center gap-1 shadow-lg shadow-teal-950/20">
              ⏰ {timer}s
            </div>
          )}

       
          <div className="w-12 h-[50px] bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-slate-600/60 flex items-center justify-center text-slate-100 font-black relative overflow-hidden shadow-xl shadow-slate-950/50">
            
            <div
              className={`absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-slate-900 to-slate-800 border-r border-slate-700 transition-transform duration-500 ${
                doorOpen ? "-translate-x-full" : "translate-x-0"
              }`}
            />
           
            <div
              className={`absolute right-0 top-0 w-1/2 h-full bg-gradient-to-r from-slate-800 to-slate-900 border-l border-slate-700 transition-transform duration-500 ${
                doorOpen ? "translate-x-full" : "translate-x-0"
              }`}
            />

            
            <span className="z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400 text-lg">
              {currentFloor === 0 ? "G" : currentFloor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lift;
