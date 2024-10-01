import { useEffect, useState } from "react";
import "./card.scss";
import axios from "axios";
import LoadingBar from "../LoadingBar/LoadingBar";

interface Props {
  title: string;
  api: string;
}

const Card = (props: Props) => {
  const [data, setData] = useState("");

  useEffect(() => {
    setLoader(true);
    const fetchMemberData = async () => {
      await axios
        .get(`${props.api}`, {
          headers: {
            Authorization: `Bearer ${localStorage
              .getItem("userToken")
              ?.toString()}`, // Add your token
            "Content-Type": "application/json", // Set content type for FormData
          },
        })
        .then((res) => {
          setData(res.data.data)
          setLoader(false);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    };
    fetchMemberData();
  }, [props.api]);

  // this block of code displays the loader
  const [loader, setLoader] = useState(true);

  return (
    <div className="card">
      {loader ? (
        <LoadingBar height="100%" />
      ) : (
        <div>
          <h3>{data ? data : 0}</h3>
          <h6>{props.title.toUpperCase()}</h6>
        </div>
      )}
    </div>
  );
};

export default Card;
