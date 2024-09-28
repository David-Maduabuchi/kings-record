import { useEffect, useState } from "react";
import "./Records.scss";
import axios from "axios";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { TransformedData, transformThisData } from "@/interface/functions";
import DataTable from "@/components/dataTable/DataTable";
import * as ACTIONS from "../../store/actions/action_types";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
const Records = () => {
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(true);
  const [tableLoader, setTableLoader] = useState(false);
  const [initialData, setInitialData] = useState<TransformedData[]>([]);
  // const [dynamicData, setDynamicData] = useState(initialData) // this guy will be used for search operations

    const dispatch = useDispatch();
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
      dispatch({
        type: ACTIONS.CLOSE_SIDEBAR,
      }); // Scroll to the top of the page
    }, [pathname, dispatch]);


  const column = [
    {
      col2: "Title",
      col3: "Surname",
      col4: "FirstName",
      col5: "Email",
      col6: "Phone Number",
      col7: "Partnerships",
      col8: "Givings",
      col9: "Total",
    },
  ];

  useEffect(() => {
    setTableLoader(true);
    const fetchTableData = async () => {
      await axios
        .get("https://kingsrecord-backend.onrender.com/api/v1/spreadsheet", {
          headers: {
            Authorization: `Bearer ${localStorage
              .getItem("userToken")
              ?.toString()}`, // Add your token
            "Content-Type": "application/json", // Set content type for FormData
          },
        })
        .then((res) => {
          setInitialData(transformThisData(res.data.data)); //transformDataToSomethign Suitable
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTableLoader(false);
        });
    };
    fetchTableData();
  }, []);

  return (
    <div className="admin-records">
      <div className="records-header">
        <div className="svgs-container">
          <span className="header-icons">
            <img src="/svg/fields.svg" alt="" />
            Fields
          </span>
          <span className="header-icons">
            <img src="/svg/filter.svg" alt="" />
            Filter
          </span>
          <span className="header-icons">
            <img src="/svg/sort.svg" alt="" />
            Sort
          </span>
          <span className="header-icons">
            <img src="/svg/ellipsis.svg" alt="" />
          </span>
        </div>
        <div className="search-button">
          <img src="/svg/search.svg" alt="" />
          <input
            type="text"
            placeholder="Search User"
            name="username"
            id="username"
            autoFocus
            autoComplete="off"
          />
        </div>
      </div>
      {/* INTRODUCTION HEADER */}
      {isInfoBoxOpen && (
        <div className="records-info">
          <p>
            You can easily edit, store, and modify records within spreadsheets.
            Effortlessly update data, track changes, and manage entries in real
            time. Your spreadsheets are securely stored, accessible anytime, and
            fully customizable to meet your needs, ensuring smooth and efficient
            data management.
          </p>
          <button onClick={() => setIsInfoBoxOpen(false)}>Okay, got it!</button>
        </div>
      )}

      {/* <DataTable /> */}
      <div className="recordsTable" >
        {tableLoader ? <LoadingBar height="200px" /> : <DataTable column={column} rows={initialData}/>}
      </div>
    </div>
  );
};

export default Records;
