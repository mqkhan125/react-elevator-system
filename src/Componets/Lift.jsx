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

  // YEH REF LATEST QUEUE KE LIYE HAI (PEHLI BUG FIX)
  const queueRef = useRef(queue);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  // NAYA REF: LIFT KO YAD RAKHNE KE LIYE KE WO KIS DIRCTION SE AAYI THI
  const prevDirectionRef = useRef("idle");
  useEffect(() => {
    if (direction !== "idle") {
      prevDirectionRef.current = direction;
    }
  }, [direction]);

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

  // UPDATED DECIDE DIRECTION (REAL LIFT ALGORITHM)
  const decideDirection = () => {
    const normalized = normalize(queueRef.current);
    let hasUp = false;
    let hasDown = false;

    normalized.forEach((f) => {
      if (f > currentFloor) hasUp = true;
      if (f < currentFloor) hasDown = true;
    });

    const prevDir = prevDirectionRef.current;

    // AGAR LIFT PEHLE DOWN JA RAHI THI
    if (prevDir === "down") {
      if (hasDown)
        setDirection("down"); // Neeche aur floors hain? Neeche hi jao
      else if (hasUp)
        setDirection("up"); // Neeche khatam? Ab upar jao
      else {
        setDirection("idle");
        prevDirectionRef.current = "idle"; // Queue khatam, reset memory
      }
    }
    // AGAR LIFT PEHLE UP JA RAHI THI
    else if (prevDir === "up") {
      if (hasUp)
        setDirection("up"); // Upar aur floors hain? Upar hi jao
      else if (hasDown)
        setDirection("down"); // Upar khatam? Ab neeche jao
      else {
        setDirection("idle");
        prevDirectionRef.current = "idle"; // Queue khatam, reset memory
      }
    }
    // AGAR LIFT STANDSTILL PAR THI (FRESH START)
    else {
      if (hasUp) setDirection("up");
      else if (hasDown) setDirection("down");
      else setDirection("idle");
    }
  };

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
          decideDirection(); // AB YE REAL ALGORITHM FOLLOW KAREGA
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

  // JAB LIFT IDLE HO AUR DOOR BAND HO, TOH NAYE BUTTON CHECK KARO
  useEffect(() => {
    if (queue.length > 0 && direction === "idle" && !doorOpen && !isEmergency) {
      decideDirection();
    }
  }, [queue, direction, doorOpen, isEmergency]);

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
