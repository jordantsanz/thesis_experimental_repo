import { ActionTypes } from '../actions';

const initialState = {
  affectPercent: -1,
  accuracyPercent: -1,
  errorPercent: -1,
  id: '',
};

const correctnessReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_AFFECT:
      console.log('affect set called');
      return {
        ...state,
        affectPercent: action.payload.affectPercent,
      };
    case ActionTypes.RESET_ALL_CORRECTNESS:
      console.log('reset all correctness called');
      return {
        ...state,
        affectPercent: -1,
        accuracyPercent: -1,
        errorPercent: -1,
      };
    case ActionTypes.GET_ACCURACY:
      console.log('accuracy set called');
      return {
        ...state,
        accuracyPercent: action.payload.accuracyPercent,
      };
    case ActionTypes.GET_ERROR_PERCENT:
      console.log('error set called');
      return {
        ...state,
        errorPercent: action.payload.errorPercent,
      };
    case ActionTypes.SET_USER_HASH:
      console.log('set user hash called');
      return {
        ...state,
        id: action.payload.id,
      };
    default:
      return state;
  }
};

export default correctnessReducer;
