// import { useEffect } from "react";
import "./LoadingBar.scss"; // Create a CSS file for loading bar styling
// import { useLocation } from "react-router-dom";
interface Props {
  height: string;
}
const LoadingBar = (props: Props) => {
  // const { pathname } = useLocation();

// useEffect(() => {
  //   window.scrollTo(0, 0); // Scroll to the top of the page
  // }, [pathname]);

  

  return (
    <div className="main-loading-container" style={{
      height: props.height
    }}>
      <span className="loader"></span>
    </div>
  );
};

export default LoadingBar;
