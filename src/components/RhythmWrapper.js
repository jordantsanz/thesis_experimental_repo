/* eslint-disable camelcase */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionTypes } from '../actions';
import Rhythm from './Rhythm';
import { difficulties } from '../lib/constants';
import generateRandomActivity from './RhythmActivityGenerator';

const RhythmWrapper = () => {
  const {
    answerCount, currentNumber, info, page_type, title,
  } = useSelector((state) => state.rhythm.activity);

  const dispatch = useDispatch();
  if (info === undefined || info === null) {
    return (
      <button type="button" onClick={() => { dispatch({ type: ActionTypes.SET_RHYTHM_ACTIVITY, payload: generateRandomActivity(1, difficulties.EASY) }); }}>Make activity</button>
    );
  }
  return (
    <div>
      <Rhythm
        answerCount={answerCount}
        currentNumber={currentNumber}
        page_type={page_type}
        title={title}
        notes={info?.r?.notes}
        bpm={info?.r?.bpm}
        timeSignature={info?.r?.time_signature}
      />
    </div>
  );
};

export default RhythmWrapper;
