import { ActionTypes } from '../actions';

const initialState = {
  currentPageNumber: 0,
  pages: [],
};

const RhythmReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GO_TO_NEXT:
      console.log('changed');
      return {
        ...state,
        currentPageNumber: action.payload,
      };
    case ActionTypes.SET_ALL_QUESTIONS:
      return {
        ...state,
        pages: action.payload,
        currentPageNumber: 0,
      };
    default:
      return state;
  }
};

export default RhythmReducer;
