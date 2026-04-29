import { useState } from "react";
import Button from "./Button";

const ControlPanel = () => {
 const [queue, setQueue] = useState([])
const buttons = ["G",1,2,3,4,5,6,7,8,9]

const handleClick = (e) => {
  setQueue(e)
}

  return (
   <div>
    {
        buttons.map((floor) => (
            <Button key={floor}
            floor = {floor} 
            handleClick = {handleClick}
            />
        ))
    }
   </div>
  ) 
};

export default ControlPanel;
