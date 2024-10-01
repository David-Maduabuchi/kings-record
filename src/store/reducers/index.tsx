import { combineReducers } from "redux";
import AuthReducer from "./authReducer";
import SidebarReducer from "./SidebarReducer";

const rootReducer = combineReducers({
  auth_reducer: AuthReducer,
  sidebar_reducer: SidebarReducer,
});

export default rootReducer;
