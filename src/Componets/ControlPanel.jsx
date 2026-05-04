const ControlPanel = ({
  setQueue,
  queue,
  isEmergency,
  setIsEmergency,
  currentFloor,
}) => {
  const buttons = ["G", 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleValue = (floorId) => {
    const value = floorId === "G" ? 0 : floorId;

    setQueue((prev) => {
      const normalized = prev.map((f) => (f === "G" ? 0 : f));

      // agar data queue me hai already
      if (normalized.includes(value)) return prev;

      // agar lift currentFloor py hai already
      if (value === currentFloor) return prev;

      return [...prev, floorId];
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 w-80 text-white">
      <h2 className="text-xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400 mb-6">
        Lift Control Panel
      </h2>

      <div className="flex items-center justify-between bg-slate-950/60 px-4 py-3 rounded-xl border border-slate-800 mb-6 backdrop-blur-sm">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
          Active Queue
        </span>
        <code className="text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg text-teal-400 font-bold border border-slate-700/50">
          {queue.length > 0 ? queue.join(", ") : "Empty"}
        </code>
      </div>

      
      <div className="mb-8">
        <button
          onClick={() => setIsEmergency((prev) => !prev)}
          className={`w-full py-3 px-4 text-sm font-black tracking-wider rounded-xl border transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${
            isEmergency
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500/50 hover:shadow-purple-500/25 animate-bounce text-white"
              : "bg-gradient-to-r from-red-600 to-rose-600 border-red-500/50 hover:shadow-red-500/25 hover:brightness-110 text-white"
          }`}
        >
          {isEmergency ? (
            <>
              <span className="text-lg">🛡️</span> RESUME LIFT
            </>
          ) : (
            <>
              <span className="text-lg">🚨</span> EMERGENCY STOP
            </>
          )}
        </button>
      </div>


      <div className="grid grid-cols-5 gap-3">
        {buttons.map((floor) => {
          const isActive = queue.includes(floor);

          return (
            <button
              key={floor}
              onClick={() => handleValue(floor)}
              className={`w-12 h-12 rounded-xl text-sm font-extrabold transition-all duration-300 transform active:scale-95 flex items-center justify-center border shadow-md ${
                isActive
                  ? "bg-gradient-to-br from-red-500 to-rose-600 border-red-600 text-white shadow-red-500/30 scale-105 ring-2 ring-red-400/30"
                  : "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-teal-400 hover:border-slate-600 hover:shadow-lg"
              }`}
            >
              {floor}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ControlPanel;
