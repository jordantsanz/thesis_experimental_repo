/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
import axios from 'axios';
// const ROOT_URL = 'https://warblermusic.herokuapp.com/api';
// const ROOT_URL = 'https://warbler-ic-server.herokuapp.com/';

// import { generateRhythmActivity } from '../components/Random';
import { calculateAccuracyPercent, calculateAffectPercent, calculateErrorPercent } from './CalculatePercentages';
import premadeLessons from '../lib/PremadeLessons';
// url for face detection
// LOCAL:
const ROOT_URL = 'http://localhost:5000';
// PROD:
// const ROOT_URL = 'https://jsanz-thesis-backend.uk.r.appspot.com';

// url for database
// LOCAL:
// const ROOT_URL_DATABASE = 'http://localhost:9090/api';
// PROD:
const ROOT_URL_DATABASE = 'https://jsanz-thesis-database.herokuapp.com/api';
// action types
export const ActionTypes = {
  BETA_AUTH: 'BETA_AUTH',
  GET_LESSON: 'GET_LESSON',
  GET_LESSONS: 'GET_LESSONS',
  GET_USER_INFO: 'GET_USER_INFO',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO',
  HELLO_WORLD: 'HELLO_WORLD',
  ERROR_SET: 'ERROR_SET',
  AUTH_USER: 'AUTH_USER',
  NO_INFO_AUTH_USER: 'NO_INFO_AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  LOAD_PAGE: 'LOAD_PAGE',
  ERROR_HIDE: 'ERROR_HIDE',
  INIT_NEW_LESSON: 'INIT_NEW_LESSON',
  CREATE_CONTENT_PAGE: 'CREATE_CONTENT_PAGE',
  CREATE_ACTIVITY_PAGE: 'CREATE_ACTIVITY_PAGE',
  START_MAKING_NEW_PAGE_TYPE: 'START_MAKING_NEW_PAGE_TYPE',
  START_MAKING_ACTIVITY: 'START_MAKING_ACTIVITY',
  SAVE_BETA_EMAIL: 'SAVE_BETA_EMAIL',
  SAVE_LESSON: 'SAVE_LESSON',
  ADDED_NEW_CLASS: 'ADDED_NEW_CLASS',
  GET_CLASS: 'GET_CLASS',
  MAP_CLASS: 'MAP_CLASS',
  CHANGE_CREATE_PREVIEW: 'CHANGE_CREATE_PREVIEW',
  SET_LESSON_PAGES: 'SET_LESSON_PAGES',
  ADD_PAGE_TO_LC: 'ADD_PAGE_TO_LC',
  COPY_PAGE_LC: 'COPY_PAGE_LC',
  REMOVE_PAGE_FROM_LC: 'REMOVE_PAGE_FROM_LC',
  UPDATE_PAGE_TYPE: 'UPDATE_PAGE_TYPE',
  UPDATE_PAGE_INFO: 'UPDATE_PAGE_INFO',
  REMOVE_PAGE_LC: 'REMOVE_PAGE_LC',
  MAP_LESSON_TO_CREATION: 'MAP_LESSON_TO_CREATION',
  UPDATE_XP: 'UPDATE_XP',
  UPDATE_COINS: 'UPDATE_COINS',
  UPDATE_COMPLETED_LESSONS: 'UPDATE_COMPLETED_LESSONS',
  UNSELECT_CLASS: 'UNSELECT_CLASS',
  CLEAR_LESSONMAKING: 'CLEAR_LESSONMAKING',
  GO_TO_NEXT: 'GO_TO_NEXT',
  SET_ALL_QUESTIONS: 'SET_ALL_QUESTIONS',
  GET_AFFECT: 'GET_AFFECT',
  RESET_ALL_CORRECTNESS: 'RESET_ALL_CORRECTNESS',
  GET_ACCURACY: 'GET_ACCURACY',
  GET_ERROR_PERCENT: 'GET_ERROR_PERCENT',
  SET_USER_HASH: 'SET_USER_HASH',
};

// Remaking of lesson stuff.
export function finishMakingPage() {
  return ((dispatch) => {
    dispatch({ type: ActionTypes.FINISH_MAKING_PAGE });
  });
}

export function makeContentPage(lessonid, fields) {
  return ((dispatch) => {
    axios.post(`${ROOT_URL}/makelessons/makecontentpage`, { lessonid, fields }).then((response) => {
      console.log('response was: ', response);
      dispatch({ type: ActionTypes.CREATE_CONTENT_PAGE, payload: response.data });
    });
  });
}

export function sendVideo(video, id, lesson_id, attempt) {
  console.log('actions send video', id);
  return ((dispatch) => {
    const formData = new FormData();
    formData.append('video', video);
    console.log('sending video');
    axios.post(`${ROOT_URL}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      console.log('response received', res);
      const percent = calculateAffectPercent(res.data);
      axios.put(`${ROOT_URL_DATABASE}/affect`, {
        percent, id, lesson_id, attempt, dataframe: res.data,
      });
      dispatch({ type: ActionTypes.GET_AFFECT, payload: { affectPercent: percent } });
    });
  });
}

export function setUserHash(hash) {
  axios.post(`${ROOT_URL_DATABASE}/newSubject`, { id: hash });
  return ((dispatch) => {
    dispatch({ type: ActionTypes.SET_USER_HASH, payload: { id: hash } });
  });
}

export function createNewAttempt(id, lesson_id, attempt) {
  axios.post(`${ROOT_URL_DATABASE}/newattempt`, {
    id, lesson_id, attempt, isControl: true,
  });
}

export function resetAllCorrectness() {
  console.log('reset all correctness in actions');
  return ((dispatch) => {
    dispatch({ type: ActionTypes.RESET_ALL_CORRECTNESS, payload: {} });
  });
}

export function getErrorPercent(errorArray, id, lesson_id, attempt) {
  console.log('get error percent in actions', id);
  const percent = calculateErrorPercent(errorArray);
  axios.put(`${ROOT_URL_DATABASE}/error`, {
    percent, id, lesson_id, attempt,
  });
  return ((dispatch) => {
    console.log('dispatch error');
    dispatch({ type: ActionTypes.GET_ERROR_PERCENT, payload: { errorPercent: percent } });
  });
}

export function getAccuracyPercent(accuracyArray, id, lesson_id, attempt) {
  console.log('get accuracy in actions', id);
  const percent = calculateAccuracyPercent(accuracyArray);

  axios.put(`${ROOT_URL_DATABASE}/accuracy`, {
    percent, id, lesson_id, attempt,
  });
  return ((dispatch) => {
    console.log('dispatch accuracy');
    dispatch({ type: ActionTypes.GET_ACCURACY, payload: { accuracyPercent: percent } });
  });
}

export function makeActivityPage(lessonid, fields) {
  console.log(fields);
  return ((dispatch) => {
    axios.post(`${ROOT_URL}/makelessons/makeactivitypage`, { lessonid, fields }).then((response) => {
      console.log('response was: ', response);
      dispatch({ type: ActionTypes.CREATE_ACTIVITY_PAGE, payload: response.data });
    });
  });
}

//  MAKING LESSONS
export function startMakingActivity(activityType) {
  return ((dispatch) => {
    console.log('started making activity.');
    dispatch({ type: ActionTypes.START_MAKING_ACTIVITY, payload: { activityType } });
  });
}

export function makingPageType(type) {
  return ((dispatch) => {
    dispatch({ type: ActionTypes.START_MAKING_NEW_PAGE_TYPE, payload: { type } });
  });
}

export function initializeLesson(lesson, classID = null, userID = null) {
  console.log('initializing lesson with name', lesson.title);
  console.log('class id is: ', classID);
  console.log('user id is: ', userID);
  return (dispatch) => {
    axios.post(`${ROOT_URL}/makelessons`, { lesson, classID, userID }).then((response) => {
      console.log('the response.data is: ', response.data);
      // SHOULD INITIALIZE WITH THE USER INFORMATION WHEN WE ESTABLISH THAT.
      dispatch({ type: ActionTypes.INIT_NEW_LESSON, payload: { lessonid: response.data.lesson._id, title: response.data.lesson.title } });
    });
  };
}

export function saveLesson(pagesList, titlePanel, lessonid, publish, classID, userID) {
  console.log('saving lesson with all information', pagesList, titlePanel, lessonid, publish, classID, userID);
  return (dispatch) => {
    axios.post(`${ROOT_URL}/makelessons/savelesson`, {
      pagesList, titlePanel, lessonid, publish, classID, userID,
    }).then((response) => {
      console.log('saved lesson');
      console.log('got response', response);
      dispatch({
        type: ActionTypes.SAVE_LESSON,
        payload: {
          pagesList, titlePanel, publish, allInfo: response.data,
        },
      });
    });
  };
}

export function setError(error) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.ERROR_SET, error });
  };
}

export function hideError() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.ERROR_HIDE });
  };
}
// gets a lesson given that lesson id and the current user
export function getLesson(id, history, shouldIPush) {
  console.log('Calling getLesson in client with id', id);
  return (dispatch) => {
    axios.get(`${ROOT_URL}/lessons/${id}`)
      .then((response) => {
        console.log('getLesson responded with response', response.data);
        dispatch({ type: ActionTypes.GET_LESSON, payload: response.data });
        if (shouldIPush) {
          history.push(`/lessons/${id}`);
        }
      })
      .catch((error) => {
        console.log('error in getLesson client:', error);
        dispatch({ type: ActionTypes.ERROR_SET, payload: error });
        dispatch(setError(error.response.status));
      });
  };
}

export function getLessonToEdit(id, history, classCode) {
  console.log('calling get lesson to edit.');
  return (dispatch) => {
    axios.get(`${ROOT_URL}/lessons/${id}`)
      .then((response) => {
        console.log('getLesson responded with response', response.data);
        dispatch({ type: ActionTypes.MAP_LESSON_TO_CREATION, payload: response.data });
        history.push(`/createlesson/${classCode}`);
      })
      .catch((error) => {
        console.log('error in getLesson client:', error);
        dispatch({ type: ActionTypes.ERROR_SET, payload: error });
        dispatch(setError(error.response.status));
      });
  };
}

export function getLessons() {
  console.log('Calling getLessons in client');
  return (dispatch) => {
    axios.get(`${ROOT_URL}/lessons`)
      .then((response) => {
        console.log('getLessons response', response);
        dispatch({ type: ActionTypes.GET_LESSONS, payload: response.data });
      })
      .catch((error) => {
        console.log('server responded with error:', error);
        dispatch(setError(error.response.status));
      });
  };
}

export function loadPage(username, lessonid, lessonTitle, pageNumber) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/${username}/${lessonid}/${pageNumber}`, lessonTitle, pageNumber)
      .then((response) => {
        dispatch({ type: ActionTypes.LOAD_PAGE, payload: response.data });
      })
      .catch((error) => {
        dispatch(setError(error.response.status));
      });
  };
}

// gets user info given username
export function getUserInfo() {
  console.log('calling getUserInfo in client\n');
  return (dispatch) => {
    axios.get(`${ROOT_URL}/home`, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      dispatch({ type: ActionTypes.GET_USER_INFO, payload: response.data });
    }).catch((error) => {
      console.log('error in getUserInfo\n');
      dispatch(setError(error.response.status));
    });
  };
}

export function signOutUser() {
  return (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: ActionTypes.DEAUTH_USER });
  };
}

export function signInUser(user, history) {
  return (dispatch) => {
    console.log('sending sign in request with info: ', user);
    axios.post(`${ROOT_URL}/signin`, user, history).then(async (response) => {
      console.log('first response', response);
      if (response.data.user.username != null) {
        localStorage.setItem('token', response.data.token);
        dispatch({ type: ActionTypes.ERROR_HIDE, payload: null });
        axios.get(`${ROOT_URL}/home`, { headers: { authorization: response.data.token } }).then(async (innerResponse) => {
          console.log('second response', innerResponse);
          dispatch({ type: ActionTypes.AUTH_USER, payload: innerResponse.data });
          history.push('/userhome');
        });
      }
    })
      .catch((error) => {
        console.log('error');
        console.log(user);
        dispatch(setError(error.response.status));
      });
  };
}

export function signupUser(user, history) {
  console.log('User in signupuser: ', user);
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signup`, user, history).then((response) => {
      dispatch({ type: ActionTypes.AUTH_USER, payload: response.data.user });
      console.log('response in newuser', response);
      console.log(user);
      if (response.status == 200) {
        localStorage.setItem('token', response.data.token);
        dispatch({ type: ActionTypes.ERROR_HIDE, payload: null });
        history.push('/userhome');
      }
    })
      .catch((error) => {
        console.log('error in signing up:', error);
        dispatch(setError(error.response.status));
      });
  };
}

export function createClass(email) {
  console.log('creating class with email', email);
  return (dispatch) => {
    axios.post(`${ROOT_URL}/createClass`, { teacherEmail: email })
      .then((res) => {
        console.log('success creating class:', res);
      })
      .catch((error) => {
        console.log('error creating class', error);
      });
  };
}

export function addStudentToClass(code, email) {
  console.log('joining class with code ', code);
  console.log('student email is ', email);
  return (dispatch) => {
    axios.put(`${ROOT_URL}/joinClass`, { studentCode: code, studentEmail: email })
      .then((res) => {
        console.log('success adding student to class: ', res);
      })
      .catch((error) => {
        console.log('error joining class', error);
      });
  };
}

export function saveUserBetaEmail(email) {
  console.log('saving user email ', email);
  console.log('posting');
  axios.post(`${ROOT_URL}/betaEmail`, { email })
    .then((res) => {
      console.log('Made new user email', res);
    })

    .catch((error) => {
      console.log('unable to make email', error);
    });
}

/*
Parameters: User id.
Function: Adds a class to the database and maps the new class to the teacher's classes in the redux state.
*/
export function addClassToTeacher(userID, className) {
  console.log('adding class to teacher. User id is: ', userID, 'class name is: ', className);
  return (dispatch) => {
    axios.post(`${ROOT_URL}/classhome/teachers`, { userID, className })
      .then((response) => {
        console.log('reponse was: ', response);
        dispatch({ type: ActionTypes.ADDED_NEW_CLASS, payload: { newClass: response.data.newClass } });
      }).catch((error) => {
        console.log('unable to add class to teacher.', error);
      });
  };
}

/*
Parameters: User id, class code.
Function: Adds a class to the database and maps the new class to the teacher's classes in the redux state.
*/
export function addClassToStudent(classCode, userID) {
  console.log('adding class to student');
  return (dispatch) => {
    axios.post(`${ROOT_URL}/classhome/students`, { classCode, userID })
      .then((response) => {
        console.log('response was: ', response);
        dispatch({ type: ActionTypes.ADDED_NEW_CLASS, payload: { newClass: response.data } });
      }).catch((error) => {
        console.log('unable to add class to student.', error);
      });
  };
}

export function getClass(classCode) {
  console.log('getting class with code: ', classCode);
  return (dispatch) => {
    axios.get(`${ROOT_URL}/getclass/${classCode}`)
      .then((response) => {
        console.log('got response: ', response);
        dispatch({ type: ActionTypes.GET_CLASS, payload: { classInfo: response.data } });
      }).catch((error) => {
        console.log('unable to get class with code: ', classCode, error);
      });
  };
}

export function mapLessonToCreateLesson(lesson) {
  console.log(lesson);
  return (dispatch) => {
    dispatch({ type: ActionTypes.MAP_LESSON_TO_CREATION, payload: lesson });
  };
}

export function mapClassToRedux(classInfo) {
  console.log('mapping class to redux with class info: ', classInfo);
  return (dispatch) => {
    dispatch({ type: ActionTypes.MAP_CLASS, payload: { classInfo } });
  };
}

export function changeCreateorPreview(cOrP) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CHANGE_CREATE_PREVIEW, payload: cOrP });
  };
}

export function mapPagesToState(pages) {
  console.log('mapping pages', pages, 'to state');
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_LESSON_PAGES, payload: pages });
  };
}

export function addPageToLC(page) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.ADD_PAGE_TO_LC, payload: page });
  };
}

export function removePageFromLC(pagesAfterRemoval) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.REMOVE_PAGE_FROM_LC, payload: pagesAfterRemoval });
  };
}

export function changeIndividualPageType(index, type) {
  console.log('changeIndividualPageType called');
  return (dispatch) => {
    dispatch({ type: ActionTypes.UPDATE_PAGE_TYPE, payload: { index, type } });
  };
}

export function mapUpdatedInfoToState(pagesList, titlePanel, publish) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.UPDATE_PAGE_INFO, payload: { pagesList, titlePanel, publish } });
  };
}

export function removePageFromPages(index) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.REMOVE_PAGE_FROM_LC, payload: { index } });
  };
}

export function assignXP(xp, userID) {
  console.log('assigning', xp, 'xp');
  // make call to backend to update
  return (dispatch) => {
    console.log('dispatch run');
    axios.put(`${ROOT_URL}/updateXP`, { userID, xp }).then((response) => {
      console.log('got response from updater user XP', response);
      dispatch({ type: ActionTypes.UPDATE_XP, payload: { xp } });
    });
  };
}

export function updateLevel(xp, level, userID) {
  console.log('updating level with xp', xp, 'level', level, 'userID', userID);
  // formula to calculate how much xp for next level

  // compare

  // dispatch if level change
  return (dispatch) => {
    console.log('dispatch run with level', level + 1);
  };
}

export function assignCoins(coins, userID) {
  console.log('assigning', coins, 'coins');
  // make call to backend to update
  return (dispatch) => {
    console.log('dispatch run with coins', coins);
    // axios.put(`${ROOT_URL}/updateXP`, { userID, coins }).then((response) => {
    //   console.log('got response from updater user coins', response);
    //   dispatch({ type: ActionTypes.UPDATE_COINS, payload: { coins } });
    // });
  };
}

export function updateUserStats(activityType, attempts) {
  // update in redux state
  // make call to backend
  console.log('updateUserStats called with type', activityType, 'attempts', attempts);
}

// Done
export function registerLessonAttempt(lessonID, userID) {
  console.log('called register with lid, uid', lessonID, userID);
  return (dispatch) => {
    axios.put(`${ROOT_URL}/attempt/lesson`, { lessonID, userID }).then((response) => {
      console.log('response in registerLessonAttempt is: ', response);
    });
  };
}

export function registerLessonCompletion(lessonID, userID) {
  console.log('called register complete with lid, uid', lessonID, userID);
  return (dispatch) => {
    axios.put(`${ROOT_URL}/completed/lesson`, { lessonID, userID }).then((response) => {
      console.log('response in register completed lesson is: ', response);
      dispatch({ type: ActionTypes.UPDATE_COMPLETED_LESSONS, payload: { completed_lessons: response.data } });
    });
  };
}

export function getRandomLesson(history, types, clef) {
  // call createRandomActivity 100 times and store in []
  // console.log('getRandomLesson called');
  // const arr = [];
  // for (let i = 0; i < 100; i += 1) {
  //   arr.push(generateRhythmActivity(i, 'easy'));
  // }
  // const json = { pages: arr, title: 'random' };
  // console.log('json created,', json);

  const arr2 = premadeLessons;
  console.log({ arr2 });
  const json = { pages: arr2, title: 'random' };

  return (dispatch) => {
    console.log('dispatch run');
    dispatch({ type: ActionTypes.GET_LESSON, payload: json });
    history.push('/lessons/random');
  };
}

// Makes a call to the backend with information on the activity ID as well as the number of times that it was attempted.
// User ID is also passed and the user stats for activity completions are updated.
export function registerActivityCompletion(activityID, attemptCount, userID, activityType) {
  console.log('called register completion with id: ', activityID, 'and att count: ', attemptCount);
  console.log('user id is: ', userID);
  return (dispatch) => {
    axios.put(`${ROOT_URL}/completed/activity`, {
      activityID, attemptCount, userID, activityType,
    }).then((response) => {
      console.log('response in register Activity Completion is: ', response);
    });
  };
}

export function addPublishedLessonToMyClass(classID, lessonID) {
  console.log('adding published lesson w id: ', lessonID, 'and class', classID);
  return (dispatch) => {
    axios.put(`${ROOT_URL}/addLessonToMyClass`, {
      classID, lessonID,
    }).then((response) => {
      console.log('the response was: ', response);
    });
  };
}

export function copyPageinLessonCreation(index, currentPages) {
  const pageToCopy = currentPages[index];
  currentPages.push(pageToCopy);
  return (dispatch) => {
    dispatch({ type: ActionTypes.COPY_PAGE_LC, payload: { currentPages } });
  };
}

export function unselectClass() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.UNSELECT_CLASS });
  };
}

export function clearLessonMaking() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_LESSONMAKING });
  };
}

export function setPublish(lessonID, publish) {
  console.log('setPublish called with publish', publish);
  return (dispatch) => {
    axios.put(`${ROOT_URL}/updatePublishStatus`, { lessonID, publish }).then((response) => {
      console.log('the publish response was.', response);
      return response;
    });
  };
}

export function betaAuth() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.BETA_AUTH });
  };
}
