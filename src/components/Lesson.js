/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder';
import {
  getLesson, getErrorPercent,
  resetAllCorrectness, getAccuracyPercent, sendVideo, assignXP, updateUserStats, getRandomLesson, registerLessonCompletion, registerLessonAttempt, getUserInfo, updateLevel, assignCoins,
} from '../actions';
import ViewContent from './ViewContent';
import NextButton from './Exercises/NextButton';
import Rhythm from './Rhythm';
import InfinityIntro from './InfinityIntro';

const Page = (props) => {
  const stopped = (url, blob) => {
    console.log(blob);
    console.log('in stopped');
    const myFile = new File(
      [blob],
      'name.mp4',
      { type: 'video/mp4' },
    );
    props.sendVideo(myFile);
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
          bpm={props.page.info.r.bpm}
          goToNext={props.goToNext}
          lives={props.lives}
          registerCompletion={props.registerCompletion}
          infinity={props.infinity}
          level={props.level}
          type={type}
          changePage={props.changePage}
          pageCount={props.pageCount}
          currentPage={props.currentPage}
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
      coins: 0,
      intro: true,
      pages: null,
      pagesCompleted: false,
      determiningCompletion: false,
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
    console.log('register completion called');
    this.props.getErrorPercent(errorArray);
    this.props.getAccuracyPercent(accuracyArray);
    this.setState({ pagesCompleted: true });
  }

  goToNext = (attempts, type) => {
    console.log('going to next!');
    if (this.props.type === 'preview') {
      this.setState((prevstate) => ({ currentPage: prevstate.currentPage + 6, pagesCompleted: true, determiningCompletion: true }));
    } else {
      console.log('going to next!!', type, attempts);
      if (this.state.currentPage > this.props.lesson.pages.length - 1) {
        if (!this.state.random) {
          this.props.registerLessonCompletion(this.props.lesson._id, this.props.user.id);
        }
        this.props.getUserInfo();
      }
      this.setState((prevstate) => ({ currentPage: prevstate.currentPage + 6, pagesCompleted: true, determiningCompletion: true }));
      console.log('finished going to next');
    }
  }

  makePages = () => {
    const { lesson } = this.props;
    // if (this.props.type === 'preview') {
    //   lesson = this.props.lessonMaking;
    //   console.log('lesson:', lesson);
    // }
    console.log('the lesson', lesson);
    const pagesList = [];

    for (let i = 0; i < lesson.pages.length; i++) {
      // console.log('in loop with page', lesson.pages[i]);
      const percentage = parseInt(100 * (i / lesson.pages.length), 10);
      // console.log('percentage:', i, '--', percentage);
      pagesList.push(
        <Page
          percentage={percentage}
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
        />,
      );
    }
    return pagesList;
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
    this.setState({ determiningCompletion: false });
    this.props.resetAllCorrectness();
  }

  render() {
    console.log('Lesson props', this.props);
    console.log('trying to render lesson with state: ', this.state);
    if (this.state.intro && this.state.random) {
      console.log('rendering infinity intro');
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
      console.log('props in lesson', this.props);
      let { pages } = this.state;
      if (this.state.pages === null) {
        pages = this.makePages();
      }
      console.log('currentPage', this.state.currentPage, 'pages', pages);
      if (this.state.currentPage <= pages.length && !this.state.determiningCompletion) {
        return (
          <div>
            {pages[this.state.currentPage - 1]}
            {/* {pages[this.state.currentPage]}
            {pages[this.state.currentPage + 1]}
            {pages[this.state.currentPage + 2]}
            {pages[this.state.currentPage + 3]}
            {pages[this.state.currentPage + 4]} */}
            {this.renderNextButton()}
          </div>
        );
      } else if (this.state.determiningCompletion && this.props.correctness.affectPercent !== -1) {
        return (
          <div>
            <div>Timing Percent: {this.props.correctness.errorPercent} </div>
            <div>Accuracy Percent: {this.props.correctness.accuracyPercent} </div>
            <div>Affect Percent: {this.props.correctness.affectPercent} </div>
            <div>Result: </div>
            <button type="button" onClick={this.goToNextFromResultsPage}>Go to next</button>
          </div>
        );
      } else if (this.state.determiningCompletion && this.props.correctness.affectPercent === -1) {
        return (
          <div>Calculating results...</div>
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
})(Lesson));
