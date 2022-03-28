/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { withRouter } from 'react-router-dom';
import { setUserHash } from '../actions';
import pic4 from '../images/4-4.png';
import eighth from '../images/eighth.png';
import fkey from '../images/f-key.png';
import fkehalf from '../images/f-key-half.png';
import half from '../images/half.png';
import jkey from '../images/j-key-two.png';
import jkey2 from '../images/j-key.png';
import measure from '../images/measure.png';
import percu from '../images/percussion.png';
import quar from '../images/quarter.png';
import treb from '../images/treble.png';
import whol from '../images/whole.png';
import RecordView from './RecordView';

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

  resizeWindow = () => {
    window.resizeTo(1440, 900);
  }

  begin = () => {
    this.resizeWindow();
    window.scrollTo(0, 0);
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
        <RecordView />
        <div className="infinity-body">
          <div className="infinity-title infinity-title-top">Learning Drum Notation</div>
          <ul className="rt-intro-text-holder-list">
            <li className="rt-intro-text">In this experiment, you will be taught drum music notation. You will learn note lengths and different drums.
            </li>
            <br />
            <li className="rt-intro-text">
              For each lesson, you will learn either a new note, a new instrument, or learn at a faster tempo (Tempo is just the speed at which the music is played).
            </li>
            <br />
            <li className="rt-intro-text">
              During each activity in the lesson, you will play instruments using the keys on your keyboard. Your accuracy and your timing will be measured.
            </li>
            <br />
            <li className="rt-intro-text">
              During these activities, the next note to play will be highlighted in blue.
              Notes that are played on time and with the right instrument will be highlighted in green. Notes that are played with the incorrect
              instrument or too early or late will be highlighted in red.
            </li>
            <br />
            <li className="rt-intro-text">
              For each activity, you will have the option to Listen or Start the activity. Listening will play the activity for you once first, and starting the activity will start your attempt.
              There is no penalty for listening first.
            </li>
            <br />
            <li className="rt-intro-text">
              When the activity starts, a metronome will count out four beats first. Then, you will play along to the metronome.
            </li>
            <br />
            <li className="rt-intro-text">
              The measure that the metronome is currently on will be highlighted in purple.
            </li>
            <ul className="rt-intro-text-holder-list">
              <div className="rt-bold">Other notes:</div>
              <br />
              <li className="rt-intro-text">
                Please enable microphone and camera access.
              </li>
              <li className="rt-intro-text">
                Turn your sound on. Do not use bluetooth headphones. Try wired headphones or play sounds on your computer speakers.
              </li>
              <br />
              <li className="rt-intro-text">
                Do not refresh the page or press the back button at any time.
              </li>
              <br />
              <li className="rt-intro-text">
                Please read each lesson and instructions carefully.
              </li>
              <br />
              <div className="rt-intro-pic-div">
                <li className="rt-intro-text">
                  Each lesson is taught in 4/4 time. This is called the time signature. 4/4 time means that each measure will have four beats in it, and that a
                  quarter note will correspond to one beat (you&apos;ll learn what a quarter note is later.)
                </li>
                <img alt="time-signature-4-4" className="4-4" src="../images/4-4.png" />
              </div>
              <br />
              <div className="rt-intro-pic-div">
                <li className="rt-intro-text">
                  Each lesson is taught on the percussion clef, as per drum notation.
                </li>
                <img alt="percussion-clef" className="4-4" src="../images/percussion.png" />
              </div>
            </ul>
            <br />
            <br />
            <br />
            <li className="rt-big-text">Once you have read all of the instructions, press the &quot;Play&quot; button at the bottom of the page to begin.</li>
          </ul>

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
