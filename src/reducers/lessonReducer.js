import { ActionTypes } from '../actions/index';

const initialState = {
  lessonids: [],
};

const lessonReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_LESSONS:
      return {
        ...state,
        lessonids: action.payload,
      };
    case ActionTypes.GET_LESSON:
      return {
        ...state,
        lessonids: state.lessonids,
        currentLesson: action.payload,
      };
    default:
      return state;
  }
};

export default lessonReducer;
