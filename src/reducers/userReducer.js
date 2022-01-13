/* eslint-disable max-len */
import { ActionTypes } from '../actions/index';

const initialState = {
  username: localStorage.getItem('user'),
  email: '',
  completedLessons: [],
  classReferences: [],
  stats: {},
  xp: 0,
  coins: 0,
  level: 0,
};

const userReducer = (state = initialState, action) => {
  console.log('user reduced called with', action.type, action.payload);
  switch (action.type) {
    case ActionTypes.GET_USER_INFO:
    case ActionTypes.AUTH_USER:
      return {
        ...state,
        username: action.payload?.username,
        first_name: action.payload?.first_name,
        last_name: action.payload?.last_name,
        type: action.payload?.type,
        email: action.payload?.email,
        classes: action.payload?.classReferences,
        id: action.payload?.id,
        stats: action.payload?.stats,
        xp: action.payload?.stats?.xp,
        level: 0, // action.payload.stats.level
        coins: 0, // action.payload.stats.coins,
        completedLessons: action.payload?.completed_lessons,
        attemptedLessons: action.payload?.attempted_lessons,
        badges: action.payload?.badges,

        createdAt: action.payload?.createdAt,
        updatedAt: action.payload?.updatedAt,
      };
    case ActionTypes.ADDED_NEW_CLASS:
      return {
        ...state,
        classes: [...state.classes, action.payload.newClass],
      };
    case ActionTypes.UPDATE_XP:
      return {
        ...state,
        xp: state.xp + action.payload.xp,
      };
    case ActionTypes.UPDATE_COINS:
      return {
        ...state,
        coins: state.coins + action.payload.coins,
      };
    case ActionTypes.UPDATE_LEVELS:
      return {
        ...state,
        coins: action.payload.levels,
      };
    case ActionTypes.UPDATE_COMPLETED_LESSONS:
      return {
        ...state,
        completedLessons: action.payload.completed_lessons.userCompleted,
      };
    case ActionTypes.DEAUTH_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
