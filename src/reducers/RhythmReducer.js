import { ActionTypes } from '../actions';

const initialState = {
  activity: {},
};

const RhythmReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_RHYTHM_ACTIVITY:
      console.log('helloooo');
      return {
        ...state,
        activity: action.payload,
      };
    default:
      return state;
  }
};

export default RhythmReducer;
