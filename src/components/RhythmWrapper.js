/* eslint-disable camelcase */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionTypes } from '../actions';
import Rhythm from './Rhythm';
import { difficulties } from '../lib/constants';
import generateRandomActivity from './RhythmActivityGenerator';

const RhythmWrapper = () => {
  const { currentPageNumber, pages } = useSelector((state) => state.rhythm);
  const {
    answerCount, currentNumber, info, page_type, title,
  } = pages.length !== 0 ? pages[currentPageNumber] : {
    answerCount: undefined, currentNumber: undefined, info: undefined, page_type: undefined, title: undefined,
  };

  const dispatch = useDispatch();
  const goToNext = () => {
    dispatch({ type: ActionTypes.GO_TO_NEXT, payload: currentPageNumber + 1 });
  };
  if (pages.length === 0) {
    return (
      <button type="button"
        onClick={() => {
          generateRandomActivity(1, difficulties.EASY).then((question) => {
            dispatch({ type: ActionTypes.MAKE_QUESTION, payload: question });
          });
        }}
      >Make activity
      </button>
    );
  } else {
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
          goToNext={() => { goToNext(); }}
        />
      </div>
    );
  }
};

export default RhythmWrapper;
