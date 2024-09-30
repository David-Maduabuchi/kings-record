import Card from "@/components/card/Card";
import "./overview.scss";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BarChartBox from "@/components/barChart/BarChartBox";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { useDispatch } from "react-redux";
import * as ACTIONS from "../../store/actions/action_types";
const Overview = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  // const [isCardOpen, setIsCardOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Partnership");
  // const [cardOption, setCardOption] = useState("Yearly");
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const cardDropdownRef = useRef<HTMLDivElement>(null);
  const options = ["Partnership", "Givings"];
  const dispatch = useDispatch();
  // const cardOptions = ["Yearly", "Monthly", "Weekly"];

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({  
      type: ACTIONS.CLOSE_SIDEBAR,
    }); // Scroll to the top of the page
  }, [pathname, dispatch]);
  //Replace Data with Info from the Database
  const memberShipData = {
    title: "Total Members",
    api: "https://kingsrecordbackend-production.up.railway.app/api/v1/members",
  };

  const partnershipData = {
    api: "https://kingsrecordbackend-production.up.railway.app/api/v1/partnership-yearly/2024",
    title: "Total Partnership this year",
  };

  const givingsData = {
    api: "https://kingsrecordbackend-production.up.railway.app/api/v1/givings-yearly/2024",
    title: "total givings this year",
  };

  // FOR THE BARCHART GRAPH

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // const handleCardOptionClick = (option: string) => {
  //   setCardOption(option);
  //   setIsCardOpen(false); // Close dropdown when an option is selected

  //   //change this chain later
  //   if (option === "Partnership") {
  //     setLoading(true);
  //     // Perform Get Request
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 2000);
  //   } else if (option === "Givings") {
  //     setLoading(true);
  //     // perform get Request
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 2000);
  //   } else if (option === "Rejected") {
  //     setLoading(true);

  //     //perform get request
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 2000);
  //   } else if (option === "All") {
  //     setLoading(true);
  //     // set it to the initial data
  //     // Switch to use effect to fetch data on page load to set the partnership
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 2000);
  //   }
  // };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // const toggleCardDropdown = () => {
  //   setIsCardOpen(!isOpen);
  // };

  // this block of code displays the loader
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  });
  if (loader) return <LoadingBar height="90vh" />;

  return (
    <div className="overview">
      <header>
        <h3>Overview</h3>
        {/* CARD DROPDOWN */}
        {/* <div className="dropdownContainer">
          <div
            className="dropdown"
            ref={cardDropdownRef}
            style={{ position: "relative", display: "inline-block" }}
          >
            <button onClick={toggleCardDropdown} className="dropdown-button">
              <span>{cardOption}</span>
              <img src="/svg/down-arrow-head.svg" alt="" />
            </button>
            {isCardOpen && (
              <ul className="dropdown-menu">
                {cardOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleCardOptionClick(option)}
                  >
                    <span className="option">{option}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div> */}
      </header>
      <div className="cardContainer">
        <Card {...memberShipData} />
        <Card {...partnershipData} />
        <Card {...givingsData} />
      </div>
      <section className="graphContainer">
        {/* GRAPH HEADER */}
        <div className="graphHeader">
          <div className="graphInfo">
            <h3>TOTAL {selectedOption.toUpperCase()}</h3>
            <h5>April 2024 - September 2024</h5>
          </div>
          <div className="dropdownContainer">
            <span className="category">Category</span>
            <div
              className="dropdown"
              ref={dropdownRef}
              style={{ position: "relative", display: "inline-block" }}
            >
              <button onClick={toggleDropdown} className="dropdown-button">
                <span>{selectedOption}</span>
                <img src="/svg/down-arrow-head.svg" alt="" />
              </button>
              {isOpen && (
                <ul className="dropdown-menu">
                  {options.map((option) => (
                    <li key={option} onClick={() => handleOptionClick(option)}>
                      <span className="option">{option}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* END OFGRAPH HEADER */}

        <div className="main-graph">
          <BarChartBox
            graphInfo={selectedOption}
            selectedOption={selectedOption}
          />
        </div>
      </section>
    </div>
  );
};

export default Overview;
