import { AuthActionTypes } from "../../interface/redux-interface";
import * as ACTION_TYPES from "../actions/action_types";

const initialState = {
  is_authenticated: false,
  profile: null,
  redirectionMessage: "",
  redirectEmail: "",
};

const AuthReducer = (state = initialState, action: AuthActionTypes) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        is_authenticated: true,
      };
    case ACTION_TYPES.LOGIN_FAILURE:
      console.log(ACTION_TYPES.LOGIN_FAILURE);
      return {
        ...state,
        is_authenticated: false,
      };
    case ACTION_TYPES.REDIRECT_MESSAGE:
      return {
        ...state,
        redirectionMessage: action.payload
      }
    case ACTION_TYPES.ADD_EMAIL_TO_DB:
      return {
        ...state,
        redirectEmail: action.payload
      }
    default:
      return state;
  }
};

export default AuthReducer;
