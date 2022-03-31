/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserInfo } from '../actions';
// import RhythmWrapper from './RhythmWrapper';
import Lesson from './Lesson';
import FaceApiTest from './FaceApiTest';
// import Start from './Start';

const App = (props) => {
  const token = localStorage.getItem('token');
  if (token && props.user.username === null) {
    console.log(localStorage);
    props.getUserInfo();
  }
  return (
    <Router>
      <Switch>
        <Route path="/test" component={FaceApiTest} />
        <Route path="/" component={Lesson} />
        <Route path="/lessons/random" component={Lesson} />
      </Switch>
    </Router>
  );
};

function mapStateToProps(reduxState) {
  return {
    user: reduxState.user,
  };
}

export default connect(mapStateToProps, { getUserInfo })(App);
