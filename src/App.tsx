import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from "react-router-dom";
import SignIn from "./pages/signin/SignIn";
import Overview from "./pages/overview/Overview";

import "./styles/global.scss";
import SignUp from "./pages/signup/Signup";
import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";
import AuthGuard from "./AUTH/Auth";
import Records from "./pages/records/Records";
import NotFound from "./pages/PageNotFound/NotFound";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import * as ACTIONS from "./store/actions/action_types"
import AddData from "./pages/addData/AddData";
import AllOptions from "./pages/addData/AllOptions/AllOptions";
import AddNew from "./pages/addData/AddNew/AddNew";
import UpdateGiving from "./pages/addData/UpdateGiving/UpdateGiving";
import UpdatePartnership from "./pages/addData/UpdatePartnership/UpdatePartnership";

const DashboardLayout = () => {
   const dispatch = useDispatch();
   const { pathname } = useLocation();

   useEffect(() => {
     window.scrollTo(0, 0);
     dispatch({
       type: ACTIONS.CLOSE_SIDEBAR,
     }); // Scroll to the top of the page
   }, [pathname, dispatch]);
  return (
    <div className="main">
      <div className="projcont ">
        <div className="menuContainer">
          <Menu />
        </div>
        <div className="dynamic-container">
          <div className="navBar">
            <Navbar />
          </div>

          <div className="contentContainer">
            {/* I can either use reactRouterDom here but I wanna use this guy */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup/" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/admin-dashboard/"
        element={<Navigate to={"/admin-dashboard/overview"} />}
      />
      <Route
        path="/admin-dashboard/"
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route path="overview" element={<Overview />} />
        <Route path="records" element={<Records />} />
        <Route
          path="add-data"
          element={<Navigate to={"/admin-dashboard/add-data/all"} />}
        />
        <Route path="add-data" element={<AddData />}>
          <Route path="all" element={<AllOptions />} />
          <Route path="new-member" element={<AddNew />} />
          <Route path="update-givings" element={<UpdateGiving />} />
          <Route path="update-partnerships" element={<UpdatePartnership />} />
        </Route>
      </Route>
      {/* Catch-all route for non-existing pages */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
