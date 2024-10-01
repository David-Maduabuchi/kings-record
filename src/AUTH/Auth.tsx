import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../store/actions/action_types";
import { Navigate } from "react-router-dom";
import { RootState } from "../interface/general";
import LoadingBar from "../components/LoadingBar/LoadingBar";

interface Auth {
  children: JSX.Element;
}
const AuthGuard = (props: Auth) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => {
    return state.auth_reducer.is_authenticated;
  });

  useEffect(() => {
    setLoading(true);
    const storedToken =  localStorage.getItem("userToken")
    if(storedToken){
      dispatch({
        type: ACTIONS.LOGIN_SUCCESS
      })
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dispatch]);

  if (loading) {
    return <LoadingBar height="90vh"/>; // Use the LoadingBar component here
  }

  if (!isAuthenticated) {
    dispatch({
      type: ACTIONS.REDIRECT_MESSAGE,
      payload: "Session expired, please login again to Continue",
    });
    return <Navigate to={"/signin"} />;
  }

  return props.children;
};

export default AuthGuard;
