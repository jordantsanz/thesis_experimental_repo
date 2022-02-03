// the starting point for your redux store
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import lessonMakingReducer from './lessonMakingReducer';
import lessonReducer from './lessonReducer';
import classReducer from './classReducer';
import betaAuthReducer from './betaAuthReducer';
import RhythmReducer from './RhythmReducer';
import correctnessReducer from './CorrectnessReducer';

const rootReducer = combineReducers({
  user: userReducer, // user information like badges
  auth: authReducer, // authentication purposes
  error: errorReducer,
  lessonMaking: lessonMakingReducer,
  lesson: lessonReducer,
  class: classReducer,
  betaAuth: betaAuthReducer,
  rhythm: RhythmReducer,
  correctness: correctnessReducer,
});

export default rootReducer;
