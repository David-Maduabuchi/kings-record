import { NavLink } from "react-router-dom";
import "./menuButton.scss";
interface Props {
  icon: string;
  label: string;
  link: string;
}

const MenuButtons = (props: Props) => {
  return (
    <NavLink className={"MenuButtonsContainer"} to={props.link}>
      <div className="menuButtons">
        <button className="sideBarButtons ">
          <img src={props.icon} alt="" />
          <span>{props.label}</span>
        </button>
      </div>
    </NavLink>
  );
};

export default MenuButtons;
