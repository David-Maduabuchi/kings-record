import { SIDEBAR } from "../../interface/redux-interface";
import * as ACTION_TYPES from "../actions/action_types";

const initialState = {
  isSidebarOpen: false,
};

const SidebarReducer = (state = initialState, action: SIDEBAR) => {
  switch (action.type) {
    case ACTION_TYPES.OPEN_SIDEBAR:
      return {
        ...state,
        isSidebarOpen: true, // Always set to true
      };
    case ACTION_TYPES.CLOSE_SIDEBAR:
      return {
        ...state,
        isSidebarOpen: false, // Always set to true
      };
    case ACTION_TYPES.TOGGLE_SIDEBAR: // New toggle case
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen, // Toggle the current state
      };
    default:
      return state;
  }
};

export default SidebarReducer;
