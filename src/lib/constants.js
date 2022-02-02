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
};
