import { useEffect, useState, useRef } from "react";

const Lift = ({ queue, setQueue, isEmergency, setIsEmergency }) => {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [liftStatus, setLiftStatus] = useState("IDLE");
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  const FLOOR_HEIGHT = 52;
  const floors = Array.from({ length: 10 }, (_, i) => 9 - i);

  useEffect(() => {
    if (queue.length > 0 && !isMoving && !isEmergency) {
      runNext();
    }
  }, [queue, isMoving, isEmergency]);

  // Handle emergency state changes
  useEffect(() => {
    if (isEmergency) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setIsMoving(false);
      setLiftStatus("EMERGENCY STOP");
    } else if (queue.length > 0) {
      runNext();
    } else {
      setLiftStatus("IDLE");
    }
  }, [isEmergency]);

  // Timer countdown logic
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timer]);

  const runNext = () => {
    if (queue.length === 0 || isMoving || isEmergency) return;

    const targetFloor = queue[0] === "G" ? 0 : queue[0];
    moveToFloor(targetFloor);
  };

  const moveToFloor = (targetFloor) => {
    if (targetFloor === currentFloor) {
      stopAtFloor();
      return;
    }

    setIsMoving(true);
    setLiftStatus("MOVING");
    setDirection(targetFloor > currentFloor ? "UP" : "DOWN");
    setDoorOpen(false);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentFloor((prev) => {
        if (isEmergency || prev === targetFloor) return prev;

        const step = targetFloor > prev ? 1 : -1;
        const next = prev + step;

        if (next === targetFloor) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setTimeout(() => {
            stopAtFloor();
          }, 200);
        }

        return next;
      });
    }, 2000);
  };

  const stopAtFloor = () => {
    setLiftStatus("STOP");
    setTimer(3);

    setTimeout(() => {
      setDoorOpen(true);
    }, 300);

    setTimeout(() => {
      setDoorOpen(false);
    }, 2500);

    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      setIsMoving(false);
      setLiftStatus("IDLE");
      setTimer(0);
    }, 3000);
  };

  const liftPosition = (9 - currentFloor) * FLOOR_HEIGHT;

  return (
    <div className="relative w-80 h-[560px] bg-gray-100 border-2 border-gray-400 rounded-md overflow-hidden flex flex-col shadow-md">
      <div className="bg-gray-800 p-2 border-b border-gray-400 flex justify-between items-center px-6 text-white">
        <span className="text-xs font-mono uppercase tracking-widest flex items-center gap-2">
          Status:
          <span
            className={`ml-1 font-bold px-2 py-0.5 rounded text-[10px] ${
              isEmergency
                ? "bg-purple-400/20 text-purple-300 animate-bounce"
                : liftStatus === "MOVING"
                  ? "bg-yellow-400/20 text-yellow-300 animate-pulse"
                  : liftStatus === "STOP"
                    ? "bg-red-400/20 text-red-300"
                    : "bg-green-400/20 text-green-300"
            }`}
          >
            {liftStatus}
          </span>
        </span>

        <span className="text-xs font-semibold">
          Direction:{" "}
          {liftStatus === "MOVING" ? (direction === "UP" ? "⬆️" : "⬇️") : "⏹️"}
        </span>
      </div>

      <div className="relative flex-col flex h-full justify-between">
        {floors.map((floor) => (
          <div
            key={floor}
            className="flex-1 border-b border-gray-300 flex items-center justify-between px-5 bg-black text-white font-bold"
          >
            <span className="text-sm">{floor === 0 ? "G" : floor}</span>

            <div className="w-10 h-full border-l border-gray-500"></div>
          </div>
        ))}

        {/* Lift Cabin & Clock Timer UI */}
        <div
          className="absolute right-0 w-24 h-[50px] flex items-center gap-1 transition-all duration-300"
          style={{
            top: `${liftPosition}px`,
            transition: "top 1.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Timer Display to the left of the Lift Cabin */}
          {timer > 0 && (
            <div className="flex items-center gap-1 bg-blue-600/90 text-white font-bold px-2 py-1 rounded-md shadow text-[11px] animate-pulse">
              <span>⏰</span>
              <span>{timer}s</span>
            </div>
          )}

          {/* Lift Box */}
          <div className="w-12 h-[50px] bg-red-500 rounded shadow-md flex items-center justify-center text-white font-bold text-lg select-none">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full w-1/2 bg-gray-700 transition-all duration-500 ${
                  doorOpen ? "-translate-x-full" : "translate-x-0"
                }`}
              />
              <div
                className={`absolute right-0 top-0 h-full w-1/2 bg-gray-700 transition-all duration-500 ${
                  doorOpen ? "translate-x-full" : "translate-x-0"
                }`}
              />

              <div className="z-10 flex flex-col items-center">
                <span className="text-xs font-mono animate-pulse">
                  {currentFloor === 0 ? "G" : currentFloor}
                </span>

                <span className="text-[14px]">
                  {liftStatus === "MOVING"
                    ? direction === "UP"
                      ? "⬆️"
                      : "⬇️"
                    : "⏹️"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lift;
