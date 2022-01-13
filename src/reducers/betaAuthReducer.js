import { ActionTypes } from '../actions';

const initialState = {
  betaAuthed: false,
};

const betaAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.BETA_AUTH:
      return { betaAuthed: true };
    default:
      return { ...state };
  }
};

export default betaAuthReducer;
