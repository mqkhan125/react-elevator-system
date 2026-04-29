const Button = ({floor, handleClick}) => {
  return (
    <button onClick={() => handleClick(floor)}
    className='
        w-12 h-12 rounded-md border text-sm font-medium
         flex items-center justify-center
        transition '>
        {floor}
    </button>
  )
}

export default Button