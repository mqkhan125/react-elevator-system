const Button = ({ floor, queue, handleValue }) => {
  const isActive = queue.includes(floor);

  return (
    <button
      onClick={() => handleValue(floor)}
      className={`w-14 h-14 rounded-xl font-black text-base transition-all duration-200 border shadow flex items-center justify-center ${
        isActive
          ? "bg-gradient-to-r from-red-600 to-rose-500 text-white border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-cyan-400"
      }`}
    >
      {floor}
    </button>
  );
};

export default Button;
