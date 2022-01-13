/* eslint-disable no-case-declarations */
import { ActionTypes } from '../actions/index';

const initialState = {
  lessonid: '',
  author: '',
  title: '',
  description: '',
  lesson_type: '',
  experience_earned: null,
  pages: [],
  cOrP: 'Create',
};

const lessonMakingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.INIT_NEW_LESSON:
      console.log('initializing new lesson in lessonreducer.');
      return {
        ...state,
        lessonid: action.payload.lessonid,
        title: action.payload.title,
      };
    case ActionTypes.SAVE_LESSON:
    case ActionTypes.UPDATE_PAGE_INFO:
      console.log('saving lesson');
      return {
        ...state,
        title: action.payload.titlePanel.title,
        description: action.payload.titlePanel.description,
        pages: action.payload.pagesList,
        publish: action.payload.publish,
        lessonid: action.payload.allInfo._id,
        author: action.payload.allInfo.author_id,
      };
    case ActionTypes.CHANGE_CREATE_PREVIEW:
      return {
        ...state,
        cOrP: action.payload,
      };
    case ActionTypes.SET_LESSON_PAGES:
      return {
        ...state,
        pages: action.payload,
      };
    case ActionTypes.ADD_PAGE_TO_LC:
      return {
        ...state,
        pages: [...state.pages, action.payload],
      };
    case ActionTypes.UPDATE_PAGE_TYPE:
      console.log('action payload is: ', action.payload);
      // eslint-disable-next-line no-case-declarations
      const updatedPages = [...state.pages];
      console.log('updatedpages', updatedPages);
      updatedPages[action.payload.index] = { ...updatedPages[action.payload.index], page_type: action.payload.type, info: null };
      return {
        ...state,
        pages: updatedPages,
      };
    case ActionTypes.REMOVE_PAGE_FROM_LC:
      if (action.payload.index !== -1) {
        const arr = [...state.pages];
        arr.splice(action.payload.index, 1);
        return {
          ...state,
          pages: arr,
        };
      } else {
        return {
          ...state,
        };
      }
    case ActionTypes.COPY_PAGE_LC:
      return {
        ...state,
        pages: action.payload.currentPages,
      };
    case ActionTypes.MAP_LESSON_TO_CREATION:
      console.log(action.payload);
      return {
        lessonid: action.payload._id,
        pages: action.payload.pages,
        title: action.payload.title,
        class_id: action.payload.class_id,
        author_id: action.payload.author_id,
        description: action.payload.description,
        publish: action.payload.publish,
      };
    case ActionTypes.CLEAR_LESSONMAKING:
      return initialState;
    default:
      return state;
  }
};

export default lessonMakingReducer;
