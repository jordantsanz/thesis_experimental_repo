// the starting point for your redux store
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import lessonReducer from './lessonReducer';
import RhythmReducer from './RhythmReducer';
import correctnessReducer from './CorrectnessReducer';

const rootReducer = combineReducers({
  user: userReducer, // user information like badges
  auth: authReducer, // authentication purposes
  error: errorReducer,
  lesson: lessonReducer,
  rhythm: RhythmReducer,
  correctness: correctnessReducer,
});

export default rootReducer;
