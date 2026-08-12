import { useEffect, useState, useRef } from "react";

const Lift = ({
  queue,
  setQueue,
  isEmergency,
  currentFloor,
  setCurrentFloor,
}) => {
  // [LOGIC WALA HISSA EXACTLY SAME HAI, KOI CHANGE NAHI]
  const [direction, setDirection] = useState("idle");
  const [doorOpen, setDoorOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  const moveRef = useRef(null);
  const timerRef = useRef(null);

  const queueRef = useRef(queue);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const prevDirectionRef = useRef("idle");
  useEffect(() => {
    if (direction !== "idle") prevDirectionRef.current = direction;
  }, [direction]);

  const FLOOR_HEIGHT = 51;
  const floors = Array.from({ length: 10 }, (_, i) => 9 - i);
  const normalize = (arrQueue) => arrQueue.map((f) => (f === "G" ? 0 : f));

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

  const decideDirection = () => {
    const normalized = normalize(queueRef.current);
    let hasUp = false,
      hasDown = false;
    normalized.forEach((f) => {
      if (f > currentFloor) hasUp = true;
      if (f < currentFloor) hasDown = true;
    });

    const prevDir = prevDirectionRef.current;
    if (prevDir === "down") {
      if (hasDown) setDirection("down");
      else if (hasUp) setDirection("up");
      else {
        setDirection("idle");
        prevDirectionRef.current = "idle";
      }
    } else if (prevDir === "up") {
      if (hasUp) setDirection("up");
      else if (hasDown) setDirection("down");
      else {
        setDirection("idle");
        prevDirectionRef.current = "idle";
      }
    } else {
      if (hasUp) setDirection("up");
      else if (hasDown) setDirection("down");
      else setDirection("idle");
    }
  };

  useEffect(() => {
    const normalized = normalize(queue);
    if (normalized.includes(currentFloor)) {
      setDirection("idle");
      const arriveDelay = setTimeout(() => {
        setDoorOpen(true);
        setTimer(3);
        setQueue((prev) =>
          prev.filter((f) => (f === "G" ? 0 : f) !== currentFloor),
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

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timer]);

  useEffect(() => {
    if (queue.length > 0 && direction === "idle" && !doorOpen && !isEmergency)
      decideDirection();
  }, [queue, direction, doorOpen, isEmergency]);

  const liftPosition = (9 - currentFloor) * FLOOR_HEIGHT;

  // [UI WALA HISLA YAHAN SE SHURU]
  return (
    <div className="relative w-full h-[500px] lg:h-[560px] bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]">
      {/* Status Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm p-3 border-b border-slate-700 flex justify-between px-4 text-slate-400 text-xs tracking-widest items-center font-mono uppercase">
        <span className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${isEmergency ? "bg-red-500" : direction !== "idle" ? "bg-emerald-400" : "bg-slate-500"}`}
          />
          {isEmergency ? "Halt" : direction}
        </span>
        <span className="text-slate-200 text-sm font-bold">
          {direction === "up" ? "▲" : direction === "down" ? "▼" : "■"}
        </span>
      </div>

      {/* Lift Shaft */}
      <div className="relative flex flex-col h-full justify-between select-none bg-slate-900/50">
        {floors.map((floor) => (
          <div
            key={floor}
            className={`flex-1 flex items-center justify-between px-4 text-xs font-mono border-b border-slate-800/40 transition-colors ${
              currentFloor === floor && doorOpen
                ? "text-indigo-300"
                : "text-slate-600"
            }`}
          >
            <span className="w-4">{floor === 0 ? "G" : floor}</span>
            <div className="w-8 border-b border-dotted border-slate-700/30" />
          </div>
        ))}

        {/* Moving Lift Cabin */}
        <div
          className="absolute right-4 w-24 h-[48px] flex items-center gap-1"
          style={{
            top: `${liftPosition}px`,
            transition: "top 1.7s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {timer > 0 && (
            <div className="absolute -left-8 bg-slate-800 text-slate-300 border border-slate-600 text-[10px] px-1.5 py-0.5 rounded font-mono">
              {timer}s
            </div>
          )}

          {/* Cabin Body */}
          <div className="relative w-full h-full rounded-md border-[3px] border-slate-600 shadow-lg overflow-hidden">
            {/* Inside Light (Visible when doors open) */}
            <div
              className={`absolute inset-0 bg-amber-50 transition-opacity duration-500 ${doorOpen ? "opacity-100" : "opacity-0"}`}
            ></div>

            {/* Left Door */}
            <div
              className={`absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-slate-400 to-slate-300 border-r border-slate-500/50 transition-transform duration-500 ease-in-out z-10 ${
                doorOpen ? "-translate-x-full" : "translate-x-0"
              }`}
            />
            {/* Right Door */}
            <div
              className={`absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-slate-400 to-slate-300 border-l border-slate-500/50 transition-transform duration-500 ease-in-out z-10 ${
                doorOpen ? "translate-x-full" : "translate-x-0"
              }`}
            />

            {/* Floor Number inside cabin */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span
                className={`text-lg font-black drop-shadow-md transition-colors ${doorOpen ? "text-slate-800" : "text-slate-100"}`}
              >
                {currentFloor === 0 ? "G" : currentFloor}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lift;
