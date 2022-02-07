/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { withRouter } from 'react-router-dom';
import { setUserHash } from '../actions';

class InfinityIntro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clef: 'treble',
      error: false,
    };
  }

  updateClef = (clef) => {
    this.setState({ clef });
  }

  componentDidMount = () => {
    this.setRandomHash();
  }

  begin = () => {
    this.props.begin('rhythm', this.state.clef);
  }

  setRandomHash = () => {
    const hash = uuidv4();
    this.props.setUserHash(hash);
  }

  renderError = () => {
    if (this.state.error) {
      return (
        <div style={{ color: 'red' }}>You must select one or more activity types</div>
      );
    } else {
      return (
        <div />
      );
    }
  }

  render() {
    console.log('inf props', this.props);
    return (
      <div className="infinity">
        <div className="infinity-body">
          <div className="infinity-title infinity-title-top">Text to provide beforehand</div>
          <div className="inf-play-holder" onClick={this.begin}>
            <div className="inf-play green">
              Play
            </div>
          </div>
          {this.renderError()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  if (window.location.pathname.split('/')[1] === 'createlesson') {
    console.log('in lesson making');
    return {
      lesson: reduxState.lessonMaking,
    };
  } else {
    return {
      user: reduxState.user,
      lesson: reduxState.lesson.currentLesson,
      lessonMaking: reduxState.lessonMaking,
    };
  }
}

export default withRouter(connect(mapStateToProps, { setUserHash })(InfinityIntro));
