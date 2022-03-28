/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder';
import {
  getLesson, getErrorPercent, createNewAttempt,
  resetAllCorrectness, getAccuracyPercent, sendVideo, assignXP, updateUserStats, getRandomLesson, registerLessonCompletion, registerLessonAttempt, getUserInfo, updateLevel, assignCoins,
} from '../actions';
import ViewContent from './ViewContent';
import NextButton from './Exercises/NextButton';
import { resultPercentRanges } from '../lib/constants';
import Rhythm from './Rhythm';
import InfinityIntro from './InfinityIntro';

const Page = (props) => {
  console.log('thepageprops', props);
  const stopped = (url, blob) => {
    console.log(blob);
    console.log('in stopped');
    const myFile = new File(
      [blob],
      `${props.id}-${props.lesson_id}-${props.attempt}.mp4`,
      { type: 'video/mp4' },
    );
    props.sendVideo(myFile, props.id, props.lesson_id, props.attempt);
  };
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
    status,
  } = useReactMediaRecorder({ video: true, onStop: stopped, blobPropertyBag: { type: 'video/mp4' } });
  console.log({ mediaBlobUrl });

  let { type } = props;
  if (type === undefined) {
    type = 'Normal';
  }
  if (props.page.page_type === 'activity' || props.page.page_type === 'random_activity') {
    if (props.page.info.activity_type === 'Rhythm-Sensing') {
      return (
        <Rhythm
          percentage={props.percentage}
          xp={props.xp}
          stopRecording={stopRecording}
          status={status}
          startRecording={startRecording}
          instructions={props.page.info.r.instructions}
          activityID={props.page._id}
          notes={props.page.info.r.notes}
          timeSignature={props.page.info.r.time_signature}
          keys={props.page.info.r.keys}
          bpm={props.halfSpeed ? 60 : props.page.info.r.bpm}
          goToNext={props.goToNext}
          lives={props.lives}
          registerCompletion={props.registerCompletion}
          infinity={props.infinity}
          level={props.level}
          type={type}
          changePage={props.changePage}
          pageCount={props.pageCount}
          currentPage={props.currentPage}
          makeNewAttempt={props.makeNewAttempt}
        />
      );
    }
  } else {
    return (
      <ViewContent
        percentage={props.percentage}
        xp={props.xp}
        page={props.page}
        lives={props.lives}
        goToNext={props.goToNext}
        registerFailure={props.registerFailure}
        infinity={props.infinity}
        level={props.level}
        type={type}
        changePage={props.changePage}
        pageCount={props.pageCount}
        currentPage={props.currentPage}
      />
    );
  }
  return (
    <div className="page-information-container">
      <span>Page ID - The page type that this page claims has not been set up yet </span>
      <span>{props.page._id}</span>
    </div>
  );
};

class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      lives: -1,
      random: true,
      xp: 0,
      intro: true,
      pages: null,
      instructionPages: null,
      pagesCompleted: false,
      determiningCompletion: false,
      attempt: 0,
      halfSpeed: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (!this.props.lesson && this.props.type !== 'preview') {
      if (id === 'random') {
        console.log('getting random lesson');
      } else {
        this.props.getLesson(id, this.props.history, false);
      }
    }

    if (id === 'random') {
      console.log('setting lives to 3');
      this.setState({ lives: 3, random: true });
    }
  }

  registerCompletion = (errorArray, accuracyArray) => {
    console.log('register completion called', errorArray, accuracyArray);
    this.props.getErrorPercent(errorArray, this.props.correctness.id, this.state.currentPage - 1, this.state.attempt);
    this.props.getAccuracyPercent(accuracyArray, this.props.correctness.id, this.state.currentPage - 1, this.state.attempt);
    this.setState({ pagesCompleted: true });
  }

  makeNewAttempt = () => {
    console.log('make new attempt called');
    this.props.createNewAttempt(this.props.correctness.id, this.state.currentPage - 1, this.state.attempt);
  }

  goToNext = (attempts, type) => {
    console.log('going to next!');
    if (this.props.type === 'preview') {
      this.setState((prevstate) => ({ pagesCompleted: true, determiningCompletion: true }));
    } else {
      console.log('going to next!!', type, attempts);
      if (this.state.currentPage > this.props.lesson.pages.length - 1) {
        if (!this.state.random) {
          this.props.registerLessonCompletion(this.props.lesson._id, this.props.user.id);
        }
        this.props.getUserInfo();
      }
      this.setState((prevstate) => ({ pagesCompleted: true, determiningCompletion: true }));
      console.log('finished going to next');
    }
  }

  makePages = () => {
    console.log('making pages');
    const { lesson } = this.props;
    // if (this.props.type === 'preview') {
    //   lesson = this.props.lessonMaking;
    //   console.log('lesson:', lesson);
    // }
    console.log('the lesson', lesson);
    const pagesList = [];
    const instructionPagesList = [];

    for (let i = 0; i < lesson.pages.length; i++) {
      // console.log('in loop with page', lesson.pages[i]);
      const percentage = parseInt(100 * (i / lesson.pages.length), 10);
      // console.log('percentage:', i, '--', percentage);
      pagesList.push(
        <Page
          percentage={percentage}
          lesson_id={lesson.pages[i].lesson_id}
          xp={this.state.xp}
          page={lesson.pages[i]}
          key={i}
          goToNext={this.goToNext}
          lives={this.state.lives}
          registerCompletion={this.registerCompletion}
          infinity={this.state.random}
          level={i + 1}
          type={this.props.type}
          changePage={this.changePage}
          pageCount={lesson.pages.length}
          currentPage={this.state.currentPage + i - 1}
          sendVideo={this.props.sendVideo}
          id={this.props.correctness.id}
          halfSpeed={this.state.halfSpeed}
          attempt={this.state.attempt}
          makeNewAttempt={this.makeNewAttempt}
        />,
      );
      instructionPagesList.push(lesson.pages[i].instructionPage);
    }
    return [pagesList, instructionPagesList];
  }

  changePage = (n) => {
    this.setState((prevState) => ({ currentPage: prevState.currentPage + n }));
  }

  renderNextButton = () => {
    if (this.state.pagesCompleted) {
      return (
        <NextButton goToNext={this.goToNext} />
      );
    } else {
      return (
        <div />
      );
    }
  }

  reset = () => {
    let lives = -1;
    if (this.state.random) {
      lives = 3;
      this.setState({ intro: true });
    }
    this.setState({
      currentPage: 1,
      lives,
      xp: 0,
    });
  }

  beginInfinityLesson = (activityTypes, clef) => {
    this.props.getRandomLesson(this.props.history, activityTypes, clef);
    this.setState({ intro: false });
  }

  goToNextFromResultsPage = () => {
    const result = this.determineResultType();
    if (result === 'continue') {
      this.setState((prevState) => ({ currentPage: prevState.currentPage + 1, attempt: 0 }));
    } else if (result === 'repeat_slower') {
      this.setState((prevState) => ({ attempt: prevState.attempt + 1, halfSpeed: true }));
    } else {
      this.setState((prevState) => ({ attempt: prevState.attempt + 1 }));
    }
    this.setState({ determiningCompletion: false, pagesCompleted: false });
    this.props.resetAllCorrectness();
  }

  determineResult = () => {
    // ! Use this for facial affect version
    // const avgPercent = (this.props.correctness.errorPercent + this.props.correctness.affectPercent + this.props.correctness.accuracyPercent) / 3;

    const avgPercent = (this.props.correctness.errorPercent + this.props.correctness.accuracyPercent) / 2;
    if (avgPercent <= resultPercentRanges.REPEAT_SLOWER_BOUND) {
      return 'Repeat again, but slower this time.';
    } else if (avgPercent <= resultPercentRanges.REPEAT_SAME_BOUND) {
      return 'Try this again at the same speed.';
    } else {
      return 'Nice job! Let\'s move onto the next section.';
    }
  }

  determineResultType = () => {
    // ! Use this for facial affect version
    // const avgPercent = (this.props.correctness.errorPercent + this.props.correctness.affectPercent + this.props.correctness.accuracyPercent) / 3;
    const avgPercent = (this.props.correctness.errorPercent + this.props.correctness.accuracyPercent) / 2;
    if (avgPercent <= resultPercentRanges.REPEAT_SLOWER_BOUND) {
      return 'repeat_slower';
    } else if (avgPercent <= resultPercentRanges.REPEAT_SAME_BOUND) {
      return 'repeat_same';
    } else {
      return 'continue';
    }
  }

  render() {
    if (this.state.intro && this.state.random) {
      return (
        <InfinityIntro begin={this.beginInfinityLesson} />
      );
    } if (
      (this.props.lesson === undefined || this.props.lesson === null)
      || (this.props.type === 'preview' && this.props.lesson === undefined && this.props.lesson.pages.length === 0)) {
      return (
        <div className="loading" />
      );
    } else if (this.state.random && this.state.lives === 0) {
      return (
        <div />
      );
    } else {
      let { pages, instructionPages } = this.state;
      if (this.state.pages === null) {
        [pages, instructionPages] = this.makePages();
      }
      console.log('currentPage', this.state.currentPage, 'pages', pages);
      if (this.state.currentPage <= pages.length && !this.state.determiningCompletion) {
        return (
          <div>
            <div className="page-text-instructions">
              <div className="rt-page-text-left">
                <div className="rt-lesson-name">Lesson {this.state.currentPage}</div>
              </div>

              <div className="rt-lesson-title">{instructionPages[this.state.currentPage - 1].title}</div>
              <br />
              <div className="rt-inner">
                <ul className="rt-text-col">
                  <li className="rt-lesson-text-1">{instructionPages[this.state.currentPage - 1].text1}</li>
                  <br />
                  <li className="rt-lesson-text-2">{instructionPages[this.state.currentPage - 1].text2}</li>
                  <br />
                  <li className="rt-lesson-text-3">{instructionPages[this.state.currentPage - 1].text3}</li>
                </ul>
                {instructionPages[this.state.currentPage - 1].hasImage
                  ? <img alt="for-lesson-guidance" className="rt-lesson-img" src={instructionPages[this.state.currentPage - 1].image} />
                  : null}
              </div>
            </div>
            <div className="rt-center">
              <div className="rt-lesson-subtitle">Activity</div>
            </div>
            {pages[this.state.currentPage - 1]}
            {this.renderNextButton()}
          </div>
        );
        ///  NEED TO CHANGE FOR REAL: should be facialAffect !== -1 for face condition
      } else if (this.state.determiningCompletion && this.props.correctness.errorPercent !== -1 && this.props.correctness.accuracyPercent !== -1) {
        return (
          <div className="infinity">
            <div className="infinity-body rt-results-page">
              <div className="infinity-title infinity-title-top">Results</div>
              <ul className="rt-results-inner">
                <li className="rt-result">Timing Percent: {this.props.correctness.errorPercent} </li>
                <br />
                <li className="rt-result">Accuracy Percent: {this.props.correctness.accuracyPercent} </li>
                <br />
                {/* <li className="rt-result">Affect Percent: {this.props.correctness.affectPercent} </li> */}
                <br />
                <br />
                <br />
                <br />
                <div className="rt-final-result">Result: {this.determineResult()}</div>
              </ul>

              <div className="inf-play-holder" onClick={this.goToNextFromResultsPage}>
                <button className="inf-play green" type="button">Next lesson</button>
              </div>
            </div>
          </div>
        );
      } else if (this.state.determiningCompletion && this.props.correctness.affectPercent === -1) {
        return (
          <div className="infinity">
            <div className="infinity-body rt-results-page">
              <div className="infinity-title infinity-title-top">Calculating Results...do NOT refresh!</div>
            </div>
          </div>
        );
      } else {
        return (
          <div />
        );
      }
    }
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
      correctness: reduxState.correctness,
    };
  }
}

export default withRouter(connect(mapStateToProps, {
  getLesson,
  assignXP,
  sendVideo,
  updateUserStats,
  getRandomLesson,
  registerLessonCompletion,
  registerLessonAttempt,
  getUserInfo,
  updateLevel,
  assignCoins,
  getErrorPercent,
  getAccuracyPercent,
  resetAllCorrectness,
  createNewAttempt,
})(Lesson));
