import { getFormattedDate, toggleButtonRef } from "@/interface/functions";
import "./navbar.scss";
import { useDispatch } from "react-redux";
import * as ACTIONS from "../../store/actions/action_types"
import { useEffect, useState } from "react";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // Hide navbar when scrolling down
      } else {
        setShowNavbar(true); // Show navbar when scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const dispatch = useDispatch();
  const openSidebar = () => {
    dispatch({
      type: ACTIONS.TOGGLE_SIDEBAR,
    });
  };
  return (
    <div className={`Navbar ${showNavbar ? "activeNav" : "hiddenNav"}`}>
      <div className="intro-box">
        <h1>Welcome, {localStorage.getItem("username")}.</h1>
        <h5>{getFormattedDate()}</h5>
      </div>
      <div
        className="sidebarIcon"
        ref={toggleButtonRef}
        onClick={openSidebar}
      >
        <img src="/svg/menu.svg" alt="" />
      </div>

      <div className="input-profile-cont">
        {/* <div className="header-search-box">
          <img className="icon" src="/svg/search.svg" alt="" />
          <input type="text" className="header-input" placeholder="Search and discover"  />
        </div> */}
        <div className="profile-container">
          <img src="/svg/help.svg" alt="" />
          <img src="/svg/notification.svg" alt="" />
          <img src="/svg/settings.svg" alt="" />
          <img src="/images/profile.png" alt="" className="profile-img" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
