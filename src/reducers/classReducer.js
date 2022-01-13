import { ActionTypes } from '../actions';

const initialState = {
  students: null,
};

const classReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_CLASS:
    case ActionTypes.MAP_CLASS:
      return {
        students: action.payload.classInfo.students,
        modules: action.payload.classInfo.modules,
        organizationInfo: action.payload.classInfo.organizationInfo,
        assignments: action.payload.classInfo.assignments,
        announcements: action.payload.classInfo.announcements,
        leaderboard: action.payload.classInfo.leaderboard,
        settings: action.payload.classInfo.settings,
        name: action.payload.classInfo.name,
        _id: action.payload.classInfo._id,
        code: action.payload.classInfo.code,
        teacher: action.payload.classInfo.teacherInfo,
        lessons: action.payload.classInfo.lessons,
      };
    case ActionTypes.UNSELECT_CLASS:
      return initialState;
    default:
      return { ...state };
  }
};

export default classReducer;
