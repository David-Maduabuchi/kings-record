import { useEffect, useState } from "react";
import successGif from "../../../public/images/success-gif.gif";
import "./Toast.scss"; // Include your toast CSS here
interface Props {
  type: string;
  successMessage: string;
  successSubmessage: string;
}
const Toast = (props: Props) => {
  const [visible, setVisible] = useState(true);
  const [close, setClose] = useState(false);

  useEffect(() => {
    setTimeout(() => setClose(true), 4800);
    const timer = setTimeout(() => {
      setVisible(false);
      // Call the close handler after the toast duration ends
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [props]);

  const handleClose = () => {
    setClose(true);

    setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  if (!visible) return null;

const successMessage = (
  <div>
    <p className="first">{props.successMessage}</p>
    <p className="second">{props.successSubmessage}</p>
  </div>
);
const errorMessage = (
  <div>
    <p className="first">An error occured</p>
    <p className="second">Please try again</p>
  </div>
);

  return (
    <div className={`toast ${props.type} ${close && "slide-out"}`}>
      <div className="toast-content">
        <img src={props.type === "success" ? successGif : "/images/ErrorIcon.png"} alt="" />
        {props.type === "success" ? successMessage: errorMessage}
        <button className={`toast-close `} onClick={handleClose}>
          &times;
        </button>
      </div>
      <div className="toast-duration"></div>
    </div>
  );
};

export default Toast;
