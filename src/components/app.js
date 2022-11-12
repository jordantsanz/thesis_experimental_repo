import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserInfo, setUserMTurkID } from '../actions';
import LessonWrapper from './LessonWrapper';

const App = (props) => {
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      e.returnValue = '';
    }
    return '';
  };

  const id = window.location.pathname;
  console.log('found the id: ', id);
  const idWithoutSlash = id.slice(1);
  console.log('id without slash: ', idWithoutSlash);
  const idToken = localStorage.getItem('mturk');
  setUserMTurkID(idWithoutSlash);

  if (idToken && props.user.username === null) {
    console.log(localStorage);
    props.getUserInfo();
  } else {
    props.setUserMTurkID(idWithoutSlash);
  }
  return (
    <Router>
      <Switch>
        <Route path="/" component={LessonWrapper} />
      </Switch>
    </Router>
  );
};

function mapStateToProps(reduxState) {
  return {
    user: reduxState.user,
  };
}

export default connect(mapStateToProps, { getUserInfo, setUserMTurkID })(App);
