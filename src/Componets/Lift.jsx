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

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timer]);

  // ✅ Check if current floor should stop
  const shouldStopAtFloor = (floor) => {
    return queue.some((f) => (f === "G" ? 0 : f) === floor);
  };

  const runNext = () => {
    if (queue.length === 0 || isMoving || isEmergency) return;

    const target = queue[0] === "G" ? 0 : queue[0];
    setDirection(target > currentFloor ? "UP" : "DOWN");

    moveLift();
  };

  // ✅ NEW: move step-by-step instead of jumping to target
  const moveLift = () => {
    setIsMoving(true);
    setLiftStatus("MOVING");
    setDoorOpen(false);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentFloor((prev) => {
        if (isEmergency) return prev;

        const step = direction === "UP" ? 1 : -1;
        const next = prev + step;

        // ✅ Stop if this floor is in queue
        if (shouldStopAtFloor(next)) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setTimeout(() => stopAtFloor(next), 200);
          return next;
        }

        // ✅ Check if no more requests in this direction
        const remaining = queue.map((f) => (f === "G" ? 0 : f));

        const hasMoreInDirection =
          direction === "UP"
            ? remaining.some((f) => f > next)
            : remaining.some((f) => f < next);

        if (!hasMoreInDirection) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setTimeout(() => stopAtFloor(next), 200);
          return next;
        }

        return next;
      });
    }, 2000);
  };

  const stopAtFloor = (floor) => {
    setLiftStatus("STOP");
    setTimer(3);

    setTimeout(() => {
      setDoorOpen(true);
    }, 300);

    setTimeout(() => {
      setDoorOpen(false);
    }, 2500);

    setTimeout(() => {
      // ✅ Remove ONLY current floor
      setQueue((prev) =>
        prev.filter((f) => {
          const val = f === "G" ? 0 : f;
          return val !== floor;
        }),
      );

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

        {/* Lift Cabin & Timer UI (UNCHANGED) */}
        <div
          className="absolute right-0 w-24 h-[50px] flex items-center gap-1 transition-all duration-300"
          style={{
            top: `${liftPosition}px`,
            transition: "top 1.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {timer > 0 && (
            <div className="flex items-center gap-1 bg-blue-600/90 text-white font-bold px-2 py-1 rounded-md shadow text-[11px] animate-pulse">
              <span>⏰</span>
              <span>{timer}s</span>
            </div>
          )}

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
