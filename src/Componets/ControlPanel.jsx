const ControlPanel = ({ setQueue, queue }) => {
  const buttons = ["G", 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleValue = (floorId) => {
    setQueue((prev) => {
      if (prev.includes(floorId)) return prev;
      return [...prev, floorId];
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 w-80">
      <h2 className="text-lg font-semibold text-center mb-4">
        Lift Control Panel
      </h2>

      <p className="text-center text-sm text-gray-600 mb-6 font-mono">
        Queue: [{queue.length > 0 ? queue.join(", ") : "Empty"}]
      </p>

      <div className="grid grid-cols-5 gap-3">
        {buttons.map((floor) => {
          const isActive = queue.includes(floor);
          return (
            <button
              key={floor}
              onClick={() => handleValue(floor)}
              className={`w-12 h-12 rounded-md border text-sm font-bold transition flex items-center justify-center ${
                isActive
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-green-200 text-black hover:bg-green-300 border-gray-300"
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