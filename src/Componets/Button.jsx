const Button = ({ floor, queue, handleValue }) => {
    return (
        <button
            onClick={() => handleValue(floor)}
            className={`
        w-12 h-12 rounded-md border text-sm font-medium
         flex items-center justify-center
        transition
        ${queue.includes(floor)
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                } `}
        >
            {floor}
        </button>
    );
};

export default Button;
