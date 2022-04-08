import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTimer, useStopwatch } from 'react-timer-hook';
import randomstring from 'randomstring';
import { submitFinalTimeResults, ActionTypes } from '../actions';
import Lesson from './Lesson';

const LessonWrapper = () => {
  const expiryTimestamp = new Date();
  const dispatch = useDispatch();
  const [timerFinished, setTimerFinished] = useState(false);
  const userId = useSelector((reduxState) => reduxState.correctness.id);
  const {
    start, pause, seconds, minutes,
  } = useStopwatch({ autoStart: false });
  // eslint-disable-next-line no-unused-vars
  const [stopwatch, setStopwatch] = useState(null);
  expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + 35);
  const timer = useTimer({
    expiryTimestamp,
    onExpire: () => {
      setTimerFinished(true);
      const timerStats = { minutes: timer == null ? 0 : timer.minutes, seconds: timer == null ? 0 : timer.seconds };
      const stopwatchStats = { minutes, seconds };
      const string = randomstring.generate(19);
      console.log('string: ', string);
      submitFinalTimeResults(userId, timerStats, stopwatchStats, string);
      dispatch({ type: ActionTypes.SET_FINAL_STRING, payload: { string } });
    },
  });
  const startOverallTimer = () => {
    console.log('start overall timer');
    timer.start();
  };
  const startStopwatch = () => {
    console.log('stopwatch started');
    start();
    console.log('stopwatch: ', seconds);
  };
  const stopStopwatch = () => {
    console.log('stopwatch ended');
    pause();
    console.log('stopwatch: ', seconds);
  };

  console.log('stopwatch seconds:', seconds);
  console.log('timer seconds: ', timer.seconds);

  return (
    <Lesson timerFinished={timerFinished} startOverallTimer={startOverallTimer} startStopwatch={startStopwatch} stopStopwatch={stopStopwatch} />
  );
};

export default LessonWrapper;
