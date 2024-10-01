import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuButtons from "../menuButtons/MenuButtons";
import "./menu.scss";
import { menuData } from "../../data/data";
import * as ACTIONS from "../../store/actions/action_types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../interface/general";
import { toggleButtonRef } from "@/interface/functions";

const Menu = () => {
  const sidebarRef = useRef<HTMLDivElement | null>(null); // Reference to the sidebar element
  const dispatch = useDispatch();
  const redirect = useNavigate();

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const location = useLocation();
  const [activeButton, setActiveButton] = useState(() => {
    const savedActiveButton = localStorage.getItem("activeId");
    return savedActiveButton ? parseInt(savedActiveButton, 10) : 1;
  });

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedButton = [...menuData].find(
      (button) => button.url === currentPath
    );

    if (matchedButton) {
      setActiveButton(matchedButton.id);
      document.title = matchedButton.title;
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("activeId", activeButton.toString());
  }, [activeButton]);

  const sideBarState = useSelector(
    (state: RootState) => state.sidebar_reducer.isSidebarOpen
  );
  const closeSidebar = () => {
    dispatch({
      type: ACTIONS.TOGGLE_SIDEBAR,
    });
  };
  const logout = () => {
    dispatch({
      type: ACTIONS.REDIRECT_MESSAGE,
      payload:
        "Don’t worry, we’ve saved your seat. Come back anytime",
    });
    localStorage.removeItem("userToken");
    redirect("/signin")
    
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) && // Check if click is outside the sidebar
        !toggleButtonRef.current?.contains(event.target as Node) // Prevent closing if clicked on toggle button
      ) {
        dispatch({
          type: ACTIONS.TOGGLE_SIDEBAR,
        });
      }
    };

    if (sideBarState) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sideBarState, dispatch]);

  // Disable scrolling when sidebar is open
  useEffect(() => {
    if (sideBarState) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }

    // Cleanup on unmount or when sidebar closes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sideBarState]);
  return (
    <div
      ref={sidebarRef}
      className={`menu ${sideBarState ? "open-sidebar" : "close-sidebar"}`}
    >
      <div className="icon">
        <img src="/images/logo.png" alt="" />
        <span className="icon-text">KINGSRECORD</span>
      </div>
      {/* First Container */}
      <div className="button-container">
        {menuData.map((button, index) => (
          <div
            key={index}
            onClick={() => {
              document.title = button.title;
              setActiveButton(button.id);
              closeSidebar();
            }}
            className={`listItem ${
              activeButton === button.id ? "active-bg" : ""
            }`}
          >
            <MenuButtons
              link={button.url}
              icon={button.icon}
              label={button.title}
            />
          </div>
        ))}
      </div>

      <div className="logout" onClick={logout}>
        <MenuButtons
          link={"/admin-dashboard"}
          icon={"/svg/logout.svg"}
          label={"Logout"}
        />
      </div>
    </div>
  );
};

export default Menu;
