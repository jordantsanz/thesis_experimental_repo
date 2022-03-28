const TAP_VOLUME = 0.5;
const METRONOME_VOLUME = 0.3;

const difficulties = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

const MESSAGE = 'message';

const LOCAL_SERVER = 'http://localhost:9090';
const PROD_SERVER = 'https://warblermusic.herokuapp.com/';

const socketRoutes = {
  INIT_GAME_TEACHER: 'initGameTeacher',
  CHANGE_DIFFICULTY: 'changeDifficulty',
  INIT_GAME_STUDENT: 'initGameStudent',
  START_GAME: 'startGame',
  GUESS_ANSWER: 'guessAnswer',
  GUESS_ANSWER_RHYTHM: 'guessAnswerRhythm',
  NEXT_QUESTION: 'nextQuestion',
  END_GAME: 'endGame',
  END_QUESTION_FROM_TIME: 'endQuestionFromTime',
  DISCONNECT: 'manual-disconnect',
};

const TOTAL_MEASURES = 12;

const choiceArray = {
  EASY: [
    'q', 'q', 'h', 'h', 'h', 'h', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'h', 'h', 'h', 'h',
  ],
  MEDIUM: [
    '16', '8', '8', '8', '8', 'q', 'h', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'qd', 'qd', 'h', 'h',
  ],
  HARD: [
    '16', '8d', '8', '8', '8', '8', '8', '8', '8', '8', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'q', 'qd', 'h',
  ],
};

const accuracyPercentRanges = {
  COMPLETELY_CORRECT: 1, // percent given for getting accuracy "perfect"
  PARTIALLY_CORRECT: 0.5, // percent given for getting accuracy partially correct
  NOT_CORRECT: 0, // percent given for getting accuracy not correct
  PARTIAL_AND_NOT_BOUND: 0.33, // the bound to decide if not or partial; if less than 30% correct, not correct is given
  COMPLETELY_AND_PARTIAL_BOUND: 0.66, // the bound to decide if completely or partial; if over 70% correct, completely correct amount is given
};
const errorPercentRanges = {
  COMPLETELY_CORRECT: 1, // percent given for response in fastest range
  VERY_CORRECT: 0.5, // percent given for response in second fastest range
  PARTIALLY_CORRECT: 0.25, // percent given for response in third fastest range
  NOT_CORRECT: 0, // percent given for response slower than third fastest range

  COMPLETELY_CORRECT_UPPER_BOUND: 150, // bound from 0ms - xms for completely correct to be administered, where completely_correct_upper_bound = x
  VERY_CORRECT_UPPER_BOUND: 200, // bound from completely_corect_upper_bound ms - x ms for very correct to be administered, where very_correct_upper_bound = x
  PARTIALLY_CORRECT_UPPER_BOUND: 300, // bound from very_correct_upper_bound ms - x ms for partially correct to be adminsitered, where partially_correct_upper_bound = x
};

const affectPercentRanges = {
  NO_NEGATIVE_AFFECT_PERCENT: 1,
  PARTIAL_NEGATIVE_AFFECT_PERCENT: 0.5,
  MAJOR_NEGATIVE_AFFECT_PERCENT: 0,

  NO_NEGATIVE_AFFECT_UPPER_BOUND: 0.33,
  PARTIAL_NEGATIVE_AFFECT_UPPER_BOUND: 0.66,
};

const resultPercentRanges = {
  REPEAT_SLOWER_BOUND: 0.32,
  REPEAT_SAME_BOUND: 0.66,
};

const resultWords = {
  VERY_GOOD_UPPER_BOUND: 0.51,
  GOOD_LOWER_BOUND: 0.4,
  AVERAGE_LOWER_BOUND: 0.25,
};

const bpmChoices = {
  EASY: 10,
  MEDIUM: 20,
  HARD: 40,
};

export {
  TAP_VOLUME,
  METRONOME_VOLUME,
  LOCAL_SERVER,
  PROD_SERVER,
  MESSAGE,
  difficulties,
  socketRoutes,
  choiceArray,
  bpmChoices,
  TOTAL_MEASURES,
  accuracyPercentRanges,
  errorPercentRanges,
  affectPercentRanges,
  resultPercentRanges,
  resultWords,
};
