import { difficulties, choiceArray, bpmChoices } from '../lib/constants';

function generateTimeSignature() {
  const timeSignatures = ['4/4', '4/4', '4/4', '4/4', '4/4', '4/4', '4/4', '4/4', '4/4', '3/4', '3/4', '3/4', '3/4', '6/8', '8/8'];
  return timeSignatures[parseInt(Math.random() * (timeSignatures.length - 1), 10)];
}

function generateRandomBPM(difficulty) {
  let maxRange = 40;
  if (difficulty === difficulties.EASY) {
    maxRange = bpmChoices.EASY;
  } else if (difficulty === difficulties.MEDIUM) {
    maxRange = bpmChoices.MEDIUM;
  } else if (difficulty === difficulties.HARD) {
    maxRange = bpmChoices.HARD;
  }
  return parseInt(60 + Math.random() * maxRange, 10);
}

function optionsFromDifficulty(difficulty) {
  if (difficulty === difficulties.EASY) {
    return choiceArray.EASY;
  } else if (difficulty === difficulties.MEDIUM) {
    return choiceArray.MEDIUM;
  } else if (difficulty === difficulties.HARD) {
    return choiceArray.HARD;
  } else return choiceArray;
}

function getNoteDurationAsNumber(duration) {
  let noteValue = 0;

  if (duration === '16' || duration === '16r') {
    noteValue = 0.25;
  } else if (duration === '8' || duration === '8r') {
    noteValue = 0.5;
  } else if (duration === '8d' || duration === '8dr') {
    noteValue = 0.75;
  } else if (duration === '8dd' || duration === '8ddr') {
    noteValue = 0.875;
  } else if (duration === '8ddd' || duration === '8dddr') {
    noteValue = 0.9375;
  } else if (duration === 'q' || duration === 'qr') {
    noteValue = 1;
  } else if (duration === 'qd' || duration === 'qdr') {
    noteValue = 1.5;
  } else if (duration === 'qdd' || duration === 'qddr') {
    noteValue = 1.75;
  } else if (duration === 'qddd' || duration === 'qdddr') {
    noteValue = 1.875;
  } else if (duration === 'h' || duration === 'hr') {
    noteValue = 2;
  } else if (duration === 'hd' || duration === 'hdr') {
    noteValue = 3;
  } else if (duration === 'hdd' || duration === 'hddr') {
    noteValue = 3.5;
  } else if (duration === 'hddd' || duration === 'hdddr') {
    noteValue = 3.75;
  } else if (duration === 'w' || duration === 'wr') {
    noteValue = 4;
  } else if (duration === '1/2' || duration === '1/2r') {
    noteValue = 8;
  }
  const value = noteValue;
  return value;
}

function calculateDuration(noteCode, beatCode) {
  const noteDuration = getNoteDurationAsNumber(noteCode);
  const beatDuration = getNoteDurationAsNumber(beatCode);
  // console.log('noteDuration:', noteDuration, 'beatValue', beatValue);
  const duration = noteDuration / beatDuration;
  return duration;
}

function getClosestNoteCode(n, type) {
  console.log('getClosestNoteCode called with n', n);
  let code = null;
  if (n === 0.25 || n < 0.5) {
    code = '16';
  } else if (n === 0.5 || n < 0.75) {
    code = '8';
  } else if (n === 0.75 || n < 0.875) {
    code = '8d';
  } else if (n === 0.875 || n < 0.9375) {
    code = '8dd';
  } else if (n === 0.9375 || n < 1) {
    code = '8ddd';
  } else if (n === 1 || n < 1.5) {
    code = 'q';
  } else if (n === 1.5 || n < 1.75) {
    code = 'qd';
  } else if (n === 1.75 || n < 1.875) {
    code = 'qdd';
  } else if (n === 1.875 || n < 2) {
    code = 'qddd';
  } else if (n === 2 || n < 3) {
    code = 'h';
  } else if (n === 3 || n < 3.5) {
    code = 'hd';
  } else if (n === 3.5 || n < 3.75) {
    code = 'hdd';
  } else if (n === 3.75 || n < 4) {
    code = 'hddd';
  } else if (n === 4 || n < 8) {
    code = 'w';
  } else {
    code = '1/2';
  }

  if (type === 'rest') {
    code = code.concat('r');
  }
  // console.log('getClosestNote returning code:', code);
  return code;
}

function getRandomDuration(beats, prev, difficulty) {
  /*
      Given # of beats left, get a note with a shorter duration than that
    */
  // const options = [
  //   '16', '8', '8d', '8dd', '8ddd', 'q', 'qd', 'qdd', 'qddd', 'h', 'hd', 'hdd', 'hddd', 'w', '1/2',
  //   '16r', '8r', '8dr', '8ddr', '8dddr', 'qr', 'qdr', 'qddr', 'qdddr', 'hr', 'hdr', 'hddr', 'hddr', 'wr', '1/2r',
  // ];

  // let's try making there by a 50% chance of the next note being equal to the previous one.

  const options = optionsFromDifficulty(difficulty);

  let depth = 0;

  while (depth < 50) {
    let randomDuration = options[parseInt((Math.random() * (options.length - 1)), 10)];
    if (depth === 0 && Math.random() < 0.5 && prev !== null) {
      if (prev.includes('d')) {
        if (prev === '8d') {
          randomDuration = '16';
        } else {
          randomDuration = '8';
        }
      } else {
        randomDuration = prev;
      }
    }
    if (getNoteDurationAsNumber(randomDuration) <= beats) {
      return randomDuration;
    }
    depth += 1;
  }

  const duration = getClosestNoteCode(beats);
  if (getNoteDurationAsNumber(duration) <= beats) {
    return duration;
  }

  return null;
}

function generateRhythmDurations(timeSignature, difficulty) {
  /*
      Generate 3 measures worth for now
    */
  const arr = timeSignature.split('/');
  const num = parseInt(arr[0], 10);
  const beatValue = parseInt(arr[1], 10);
  let measureCount = 0;
  const durations = [];

  let beatCode = 'q';
  // interpret denominator
  if (beatValue === 8) {
    beatCode = '8';
  }

  while (measureCount < 2) {
    let beatCount = num * getNoteDurationAsNumber(beatCode);
    // console.log('beatCountRandom', beatCount);
    let depth = 0;
    while (beatCount > 0 && depth < 50) {
      // console.log('looping beatcount', beatCount);
      let prev = null;
      if (durations.length > 0) {
        prev = durations[durations.length - 1];
      }
      const duration = getRandomDuration(beatCount, prev, difficulty);
      if (duration === null) {
        depth = 51;
      } else {
        // console.log('duration:', duration);
        const durationValue = calculateDuration(duration, beatCode);
        // console.log('durationValue for', duration, 'durationValue', durationValue);
        beatCount -= durationValue;
        durations.push(duration);
        depth += 1;
      }
    }
    measureCount += 1;
  }
  // console.log('returning durations', durations);
  return durations;
}

export default async function generateRhythmActivity(i, difficulty) {
  // console.log('generateRhythmActivity called');
  /*
      Inputs:
      Outputs: {
          page_type: "random_activity",
          info: {
              activity_type: "rhythm-sensing",
              r: {
                  instructions: "Tap the space bar along to the rhyhm",
                  cleftype: "treble",
                  bpm: <String>,
                  time_signature: <String>,
                  notes: [
                      <String - duration format>,...
                  ]
                  answer_count: <Integer> (notes.length)
              }
          }
      }
    */
  //   const questions = [];
  //   for (let i = 1; i < numberOfQuestions + 1; i += 1) {
  const timeSignature = generateTimeSignature();
  // console.log('timeSignature', timeSignature);
  const durations = generateRhythmDurations(timeSignature, difficulty);
  // console.log('durations', durations);
  const bpm = generateRandomBPM(difficulty); // generateRandomBPM();
  const output = {
    page_type: 'random_activity',
    answerCount: -1,
    lesson_id: i,
    currentNumber: i + 1,
    title: 'Press the space bar to the correct rhythm!',
    info: {
      activity_type: 'Rhythm-Sensing',
      r: {
        instructions: 'Press the space bar to the correct rhythm!',
        cleftype: 'treble',
        bpm,
        time_signature: timeSignature,
        notes: durations,
        answer_count: 0,
      },
    },
  };

  console.log(output.lesson_id, 'output lesson id');

  // questions.push(output);
  //   }

  return output;
}
