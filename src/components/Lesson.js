/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getLesson, assignXP, updateUserStats, getRandomLesson, registerLessonCompletion, registerLessonAttempt, getUserInfo, updateLevel, assignCoins,
} from '../actions';
import ViewContent from './ViewContent';
import Rhythm from './Rhythm';
import InfinityIntro from './InfinityIntro';

const Page = (props) => {
  console.log('page props', props);
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
          instructions={props.page.info.r.instructions}
          activityID={props.page._id}
          notes={props.page.info.r.notes}
          timeSignature={props.page.info.r.time_signature}
          keys={props.page.info.r.keys}
          bpm={props.page.info.r.bpm}
          goToNext={props.goToNext}
          lives={props.lives}
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

  registerFailure = () => {
    if (this.state.random) {
      const lives = this.state.lives - 1;
      if (lives === 0) {
        // finish
      }
      this.setState((prevState) => { return { lives: prevState.lives - 1 }; });
    }
  }

  goToNext = (attempts, type) => {
    console.log('going to next!');
    if (this.props.type === 'preview') {
      this.setState((prevstate) => ({ currentPage: prevstate.currentPage + 1 }));
    } else {
      console.log('going to next!!', type, attempts);
      if (this.state.currentPage > this.props.lesson.pages.length - 1) {
        if (!this.state.random) {
          this.props.registerLessonCompletion(this.props.lesson._id, this.props.user.id);
        }
        this.props.getUserInfo();
      }
      this.setState((prevstate) => ({ currentPage: prevstate.currentPage + 1 }));
      console.log('finished going to next');
    }
  }

  makePages = () => {
    const { lesson } = this.props;
    // if (this.props.type === 'preview') {
    //   lesson = this.props.lessonMaking;
    //   console.log('lesson:', lesson);
    // }
    console.log('creating pages with lives', this.state.lives);
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
          registerFailure={this.registerFailure}
          infinity={this.state.random}
          level={i + 1}
          type={this.props.type}
          changePage={this.changePage}
          pageCount={lesson.pages.length}
          currentPage={this.state.currentPage}
        />,
      );
    }
    return pagesList;
  }

  changePage = (n) => {
    this.setState((prevState) => ({ currentPage: prevState.currentPage + n }));
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
      if (this.state.currentPage <= pages.length) {
        return (
          <div>
            {pages[this.state.currentPage - 1]}
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
    };
  }
}

export default withRouter(connect(mapStateToProps, {
  getLesson, assignXP, updateUserStats, getRandomLesson, registerLessonCompletion, registerLessonAttempt, getUserInfo, updateLevel, assignCoins,
})(Lesson));
