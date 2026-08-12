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
      if (normalized.includes(value)) return prev;
      if (value === currentFloor) return prev;
      return [...prev, floorId];
    });
  };

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] border border-slate-200 w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Control Panel
        </h2>

        {/* Active Queue Monitor */}
        <div className="bg-slate-900 text-slate-100 text-[11px] font-mono px-3 py-1.5 rounded-md min-w-[80px] text-center shadow-inner">
          {queue.length > 0 ? queue.join(" - ") : "---"}
        </div>
      </div>

      {/* Emergency Button */}
      <button
        onClick={() => setIsEmergency((prev) => !prev)}
        className={`w-full py-3 px-4 text-xs font-extrabold tracking-widest rounded-lg border-2 transition-all duration-200 mb-5 focus:outline-none active:scale-[0.98] ${
          isEmergency
            ? "bg-slate-700 border-slate-800 text-slate-200 shadow-inner"
            : "bg-red-600 border-red-700 text-white hover:bg-red-700 shadow-sm hover:shadow-md"
        }`}
      >
        {isEmergency ? "RESUME OPERATIONS" : "EMERGENCY STOP"}
      </button>

      {/* Floor Buttons - Physical 3D look */}
      <div className="grid grid-cols-5 gap-2.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
        {buttons.map((floor) => {
          const isActive = queue.includes(floor);

          return (
            <button
              key={floor}
              onClick={() => handleValue(floor)}
              className={`w-full aspect-square rounded-lg text-sm font-bold transition-all duration-100 flex items-center justify-center focus:outline-none ${
                isActive
                  ? "bg-indigo-600 text-white border border-indigo-700 shadow-[0_2px_4px_-1px_rgba(79,70,229,0.4)] scale-95" // Pressed look when active
                  : "bg-white text-slate-700 border border-slate-300 border-b-[3px] hover:bg-slate-100 active:scale-95 active:border-b-0 active:mt-[3px]" // 3D physical button effect
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
