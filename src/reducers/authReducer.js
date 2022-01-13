import { ActionTypes } from '../actions';

const initialState = {
  authenticated: false,
  username: '',
};

const authReducer = (state = initialState, action) => {
  console.log('action is', action);
  switch (action.type) {
    case ActionTypes.NO_INFO_AUTH_USER:
      return { authenticated: true };
    case ActionTypes.AUTH_USER:
      return { authenticated: true };
    case ActionTypes.DEAUTH_USER:
      return { authenticated: false };
    default:
      return { ...state };
  }
};

export default authReducer;
