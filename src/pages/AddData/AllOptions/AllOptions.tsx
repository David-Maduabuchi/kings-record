import { useEffect, useState } from "react";
import "./AllOptions.scss";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { NavLink } from "react-router-dom";

const AllOptions = () => {
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  });
  if (loader) return <LoadingBar height="50vh" />;

  return (
    <div className="AllOptionsContainer">
      <div className="plusContainer">
        <header>Select Required Action</header>
        <div className="plusCardSubContainer">
          <div className="addCard">
            <NavLink to={"/admin-dashboard/add-data/new-member"}>
              <img src="/svg/plus.svg" alt="" />
            </NavLink>
            ADD NEW MEMBER
          </div>
          <div className="addCard">
            <NavLink to={"/admin-dashboard/add-data/update-partnerships"}>
              <img src="/svg/plus.svg" alt="" />
            </NavLink>
            UPDATE PARTNERSHIP RECORDS
          </div>
          <div className="addCard">
            <NavLink to={"/admin-dashboard/add-data/update-givings"}>
              <img src="/svg/plus.svg" alt="" />
            </NavLink>
            UPDATE MEMBERS GIVINGS
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOptions;
