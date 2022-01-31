/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
/*
Outline:
Goal: Randomly generate activities so students get unlimited practice

Unknowns:
    * Can we do this without storing all of the info in the database?
    * Could we generate a new lesson, store it in the database (in a temp folder maybe) -- and then delete it once the student is done with them?
    * Store it all in the database and make calls --> for now, generate 100, just do calls to the database to get the info

Inputs:
Students should be able to select areas of focus:
    1. Desired subject
        1. Options:
            we could go with either just giving the option of different activity types, or we could make it more subjective
    2. Desired clef

Process:
    1. Lay-out the desired outputs for any given activity type (ie. what needs to go into the activity for it to function)
    2. Generate random outputs
        Note: we don't want them to be impossible... --> bound them within the given key signature? Minimize flats and sharps?
    3. standardize instructions for each activity type
Output:
    1. As many questions as they get right --> no do-overs
    2. Exponentially more xp for correct answers as they proceed farther and farther (starting really low)

*/
import { difficulties, choiceArray } from '../lib/constants';
/* Helper functions level 2 */
function generateTimeSignature() {
  return '4/4';
}

function generateKeySignature() {
  const keys = [
    'C',
    'F',
    'Bb',
    'Eb',
    'Ab',
    'Db',
    'Gb',
    'Cb',
    'G',
    'D',
    'A',
    'E',
    'B',
    'F#',
    'C#',
    'Am',
    'Dm',
    'Gm',
    'Cm',
    'Fm',
    'Bbm',
    'Ebm',
    'Abm',
    'Em',
    'Bm',
    'F#m',
    'C#m',
    'G#m',
    'D#m',
    'A#m',
  ];
  const randKey = keys[parseInt(Math.random() * (keys.length - 1), 10)];
  return randKey;
}

function generateClef() {
  // const clefs = ['treble', 'alto', 'soprano', 'mezzo-soprano', 'baritone-c', 'baritone-f', 'subbass', 'percussion', 'french', 'bass'];
  const clefs = ['treble', 'bass'];
  const randomClef = clefs[parseInt((clefs.length - 1) * Math.random(), 10)];
  return randomClef;
}

function generateRandomBPM() {
  return parseInt(60 + Math.random() * 40, 10);
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
  // console.log('value for', duration, ': ', value);
  return value;
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

function optionsFromDifficulty(difficulty) {
  if (difficulty === difficulties.EASY) {
    return choiceArray.EASY;
  } else if (difficulty === difficulties.MEDIUM) {
    return choiceArray.MEDIUM;
  } else if (difficulty === difficulties.HARD) {
    return choiceArray.HARD;
  } else return choiceArray;
}

function getRandomKey() {
  const keyOptions = ['f', 'a', 'e'];
  return keyOptions[parseInt((Math.random() * (keyOptions.length - 1)), 10)];
}

function getRandomDuration(beats, prev) {
  /*
    Given # of beats left, get a note with a shorter duration than that
  */
  // const options = [
  //   '16', '8', '8d', '8dd', '8ddd', 'q', 'qd', 'qdd', 'qddd', 'h', 'hd', 'hdd', 'hddd', 'w', '1/2',
  //   '16r', '8r', '8dr', '8ddr', '8dddr', 'qr', 'qdr', 'qddr', 'qdddr', 'hr', 'hdr', 'hddr', 'hddr', 'wr', '1/2r',
  // ];

  // let's try making there by a 50% chance of the next note being equal to the previous one.

  const options = optionsFromDifficulty('easy');

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

function calculateDuration(noteCode, beatCode) {
  const noteDuration = getNoteDurationAsNumber(noteCode);
  const beatDuration = getNoteDurationAsNumber(beatCode);
  // console.log('noteDuration:', noteDuration, 'beatValue', beatValue);
  const duration = noteDuration / beatDuration;
  return duration;
}

function generateRhythmDurations(timeSignature) {
  /*
    Generate 3 measures worth for now
  */
  const arr = timeSignature.split('/');
  const num = parseInt(arr[0], 10);
  const beatValue = parseInt(arr[1], 10);
  let measureCount = 0;
  const durations = [];
  const keys = [];

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
      const duration = getRandomDuration(beatCount, prev);
      let key = '';
      if (duration.includes('r')) {
        key = '';
      } else {
        key = getRandomKey();
      }
      if (duration === null) {
        depth = 51;
      } else {
        // console.log('duration:', duration);
        const durationValue = calculateDuration(duration, beatCode);
        // console.log('durationValue for', duration, 'durationValue', durationValue);
        beatCount -= durationValue;
        durations.push(duration);
        keys.push(key);
        depth += 1;
      }
    }
    measureCount += 1;
  }
  // console.log('returning durations', durations);
  return { durations, keys };
}

function assignClefToNotes(notes, clef) {
  // ['treble', 'alto', 'soprano', 'mezzo-soprano', 'baritone-c', 'baritone-f', 'subbass', 'percussion', 'french', 'bass'];
  let options = ['3'];
  // if (clef === 'tenor') {
  //   options = ['3', '4'];
  // } else if (clef === 'alto' || clef === 'treble' || 'clef' === 'soprano') {
  //   options = ['4', '5'];
  // }

  if (clef === 'treble') {
    options = ['4', '5'];
  } else if (clef === 'bass') {
    options = ['2', '3'];
  } else if (clef === 'alto') {
    options = ['3', '4'];
  } else if (clef === 'soprano') {
    options = ['4', '5'];
  } else if (clef === 'mezzo-soprano') {
    options = ['3', '4'];
  }

  const updatedNotes = [];
  notes.map((note) => {
    const i = parseInt(Math.random() * (options.length), 10);
    let n = options[i];
    if (i > options.length - 1) {
      n = options[options.length - 1];
    }
    const keys = note.concat('/', n);
    const obj = { keys: [keys], duration: 'w' };
    updatedNotes.push(obj);
  });
  return updatedNotes;
}

function getRandomSightreadingPitches(clef) {
  // for now, just do keySignature
  const pitches = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'a#', 'b#', 'c#', 'd#', 'e#', 'f#', 'g#',
    'ab', 'bb', 'cb', 'db', 'eb', 'fb', 'gb',
  ];

  const chosenPitches = [];

  let i = 0;
  let depth = 0;
  while (i < 6 && depth < 50) {
    const pitch = pitches[parseInt(Math.random() * (pitches.length - 1), 10)];
    if (!chosenPitches.includes(pitch)) {
      chosenPitches.push(pitch);
      i += 1;
    }
    depth += 1;
  }

  const notes = assignClefToNotes(chosenPitches, clef);
  // console.log('notes', notes);
  return notes;
}
/* Helper functions for Intervals */
function getIntervalName(name) {
  /*
  create map that links semitones to interval names
  */
  const map = new Map();
  map.set(0, 'Unison');
  map.set(1, 'Minor Second');
  map.set(2, 'Major Second');
  map.set(3, 'Minor Third');
  map.set(4, 'Major Third');
  map.set(5, 'Perfect Fourth');
  map.set(6, 'Tritone');
  map.set(7, 'Perfect Fifth');
  map.set(8, 'Minor Sixth');
  map.set(9, 'Major Sixth');
  map.set(10, 'Minor Seventh');
  map.set(11, 'Major Seventh');
  map.set(12, 'Octave');

  return map.get(name);
}

function generateInterval() {
  const semitones = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const semitone = semitones[parseInt(Math.random() * (semitones.length - 1), 10)];
  const name = getIntervalName(semitone);
  const res = [semitone, name];
  return res;
}

function getStartingIndex(notes, semitones) {
  return parseInt(Math.random() * (notes.length - semitones - 1), 10);
}

function getIncorrectSecondNote(notes, semitones, startingIndex) {
  let depth = 0;
  let found = false;

  let secondIndex = startingIndex + semitones - 1;
  while (!found && depth < 50) {
    secondIndex = parseInt(startingIndex + (Math.random() * (startingIndex + 13)), 10);
    if (secondIndex !== startingIndex + semitones && secondIndex < notes.length) {
      found = true;
    }
    depth += 1;
  }
  return secondIndex;
}
function generateIntervals(semitones) {
  // given semitones, we want to generate a group of 10 intervals --> some correct, some not
  const intervals = [];
  const correctness = [];

  const notes = [
    'c/2', 'c#/2', 'd/2', 'd#/2', 'e/2', 'f/2', 'f#/2', 'g/2', 'g#/2', 'a/2', 'a#/2', 'b/2',
    'c/3', 'c#/3', 'd/3', 'd#/3', 'e/3', 'f/3', 'f#/3', 'g/3', 'g#/3', 'a/3', 'a#/3', 'b/3',
    'c/4', 'c#/4', 'd/4', 'd#/4', 'e/4', 'f/4', 'f#/4', 'g/4', 'g#/4', 'a/4', 'a#/4', 'b/4',
    'c/5', 'c#/5', 'd/5', 'd#/5', 'e/5', 'f/5', 'f#/5', 'g/5', 'g#/5', 'a/5', 'a#/5', 'b/5',
    'c/6', 'c#/6', 'd/6', 'd#/6', 'e/6', 'f/6', 'f#/6', 'g/6', 'g#/6', 'a/6', 'a#/6', 'b/6',
  ];

  // generate first interval (Correct)
  const i1 = getStartingIndex(notes, semitones);

  const i2 = i1 + semitones;
  intervals.push([notes[i1], notes[i2]]);
  correctness.push(true);
  // generate last 9
  for (let i = 0; i < 9; i += 1) {
    // console.log('i = ', i);
    const startingIndex = getStartingIndex(notes, semitones);

    // let's say we want 60% of answers to be incorrect
    const n = Math.random();
    if (n > 0.5) {
      // console.log('getting incorrect second note');
      // generate incorrect second index
      correctness.push(false);
      const second = getIncorrectSecondNote(notes, semitones, startingIndex);
      // console.log('secondIndex', second);
      intervals.push([notes[startingIndex], notes[second]]);
    } else {
      // console.log('second note correct');
      correctness.push(true);
      const second = startingIndex + semitones;
      // console.log('secondIndex', second);
      intervals.push([notes[startingIndex], notes[second]]);
    }
  }
  return [intervals, correctness];
}
/* End intervals helper functions */

function generateSingingInterval(clef) {
  const notes = [
    'c/2', 'c#/2', 'd/2', 'd#/2', 'e/2', 'f/2', 'f#/2', 'g/2', 'g#/2', 'a/2', 'a#/2', 'b/2',
    'c/3', 'c#/3', 'd/3', 'd#/3', 'e/3', 'f/3', 'f#/3', 'g/3', 'g#/3', 'a/3', 'a#/3', 'b/3',
    'c/4', 'c#/4', 'd/4', 'd#/4', 'e/4', 'f/4', 'f#/4', 'g/4', 'g#/4', 'a/4', 'a#/4', 'b/4',
    'c/5', 'c#/5', 'd/5', 'd#/5', 'e/5', 'f/5', 'f#/5', 'g/5', 'g#/5', 'a/5', 'a#/5', 'b/5',
    'c/6', 'c#/6', 'd/6', 'd#/6', 'e/6', 'f/6', 'f#/6', 'g/6', 'g#/6', 'a/6', 'a#/6', 'b/6',
  ];

  let lowerBound = 24;
  let upperBound = 36;
  if (clef === 'treble') {
    // [c3 - g4] -- [12, 31]
    lowerBound = 24;
    upperBound = 43;
  } else if (clef === 'bass') {
    // [g2 - b3] -- [7, 23]
    lowerBound = 7;
    upperBound = 23;
  } else if (clef === 'alto') {
    // [e4 - e5] -- [28, 40]
    lowerBound = 28;
    upperBound = 40;
  } else if (clef === 'mezzo-soprano') {
    // [g4 - g5] -- [31, 43]
    lowerBound = 31;
    upperBound = 43;
  } else if (clef === 'soprano') {
    // [g4 - g5] -- [31, 43]
    lowerBound = 31;
    upperBound = 43;
  }

  const index1 = lowerBound + parseInt(Math.random() * (upperBound - lowerBound), 10);
  const index2 = lowerBound + parseInt(Math.random() * (upperBound - lowerBound), 10);
  return [notes[index1], notes[index2]];
}

function areSameArrays(a1, a2) {
  if (a1.length !== a2.length) {
    return false;
  }
  for (let i = 0; i < a1.length; i += 1) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}

function isRepeatArray(options, a) {
  for (let i = 0; i < options.length; i += 1) {
    if (options[i] !== 0 && areSameArrays(a, options[i])) {
      return true;
    }
  }
  return false;
}
function generateListeningNotes(clef) {
  //  console.log('generateListeningNotes called with clef', clef);
  // assume: only quarter notes --> generate four notes within the given clef
  const notes = [
    'c/2', 'c#/2', 'd/2', 'd#/2', 'e/2', 'f/2', 'f#/2', 'g/2', 'g#/2', 'a/2', 'a#/2', 'b/2',
    'c/3', 'c#/3', 'd/3', 'd#/3', 'e/3', 'f/3', 'f#/3', 'g/3', 'g#/3', 'a/3', 'a#/3', 'b/3',
    'c/4', 'c#/4', 'd/4', 'd#/4', 'e/4', 'f/4', 'f#/4', 'g/4', 'g#/4', 'a/4', 'a#/4', 'b/4',
    'c/5', 'c#/5', 'd/5', 'd#/5', 'e/5', 'f/5', 'f#/5', 'g/5', 'g#/5', 'a/5', 'a#/5', 'b/5',
    'c/6', 'c#/6', 'd/6', 'd#/6', 'e/6', 'f/6', 'f#/6', 'g/6', 'g#/6', 'a/6', 'a#/6', 'b/6',
  ];

  let lowerBound = 24;
  let upperBound = 36;
  if (clef === 'treble') {
    // [c4 - g5] -- [28, 40]
    lowerBound = 24;
    upperBound = 43;
  } else if (clef === 'bass') {
    // [g2 - b3] -- [7, 23]
    lowerBound = 7;
    upperBound = 23;
  } else if (clef === 'alto') {
    // [c4 - e5] -- [24, 40]
    lowerBound = 24;
    upperBound = 40;
  } else if (clef === 'mezzo-soprano') {
    // [g4 - g5] -- [31, 43]
    lowerBound = 31;
    upperBound = 43;
  } else if (clef === 'soprano') {
    // [g4 - g5] -- [31, 43]
    lowerBound = 31;
    upperBound = 43;
  }

  /* initialize empty with zeroes and fill with options */
  const options = [0, 0, 0, 0];

  // console.log('getting correctAnswer with lBound', lowerBound, 'and uBound', upperBound);
  /* Get Correct answer */
  let indexes = [];
  const firstNoteIndex = lowerBound + parseInt(Math.random() * (upperBound - lowerBound), 10);
  indexes.push(firstNoteIndex);
  while (indexes.length < 4) {
    const i = lowerBound + parseInt(Math.random() * (upperBound - lowerBound), 10);
    // console.log('i: ', i, 'indexes:', indexes);
    if (Math.abs(indexes[indexes.length - 1] - i) < 7) {
      indexes.push(i);
    }
  }
  // console.log('got correct answer');

  const correctIndex = parseInt(Math.random() * 4, 10);
  console.log('correctIndex', correctIndex);
  options[correctIndex] = indexes;
  console.log('options:', options);
  /* Get incorrect answers */
  let currIndex = 0;
  while (currIndex < 4) {
    indexes = [];
    indexes.push(firstNoteIndex);

    // create incorrect answer
    while (indexes.length < 4) {
      const i = lowerBound + parseInt(Math.random() * (upperBound - lowerBound), 10);
      if (Math.abs(indexes[indexes.length - 1] - i) < 7) {
        indexes.push(i);
      }
    }
    // console.log('got indexes');
    while (options[currIndex] !== 0 && currIndex < 4) {
      currIndex += 1;
    }
    // console.log('inserting in options at currIndex', currIndex);
    if (!isRepeatArray(options, indexes)) {
      options[currIndex] = indexes;
      currIndex += 1;
    }
  }

  // convert to note format

  const res = [];
  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];
    const noteArr = [];
    for (let j = 0; j < option.length; j += 1) {
      noteArr.push(notes[option[j]]);
    }
    res.push(noteArr);
  }
  // console.log('success!');
  return [correctIndex, res];
}

/* END Helper functions level 2 */

/* Helper functions level 1 */
function pickActivityType(types) {
  // picks activity type
  // const all = ['rhythm', 'sightreading', 'listening', 'intervals', 'singing'];

  const rand = Math.random();
  const randomIndex = parseInt(types.length * rand, 10);
  const activityType = types[randomIndex];
  return activityType;
}

export function generateRhythmActivity() {
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

  const timeSignature = generateTimeSignature();
  // console.log('timeSignature', timeSignature);
  const { durations, keys } = generateRhythmDurations(timeSignature);
  // console.log('durations', durations);
  const bpm = generateRandomBPM(); // generateRandomBPM();
  const output = {
    page_type: 'random_activity',
    info: {
      activity_type: 'Rhythm-Sensing',
      r: {
        instructions: 'Press the space bar to the correct rhythm!',
        cleftype: 'treble',
        bpm,
        time_signature: timeSignature,
        notes: durations,
        keys,
        answer_count: 0,
      },
    },
  };
  // console.log('output: ', output);
  return output;
}

function generateSightreadingActivity(clef) {
  /*
        Inputs:
        Outputs: {
            page_type: "random_activity",
            info: {
                activity_type: "sightreading",
                sr: {
                    instructions: "Drag each letter below it's corresponding note on the clef",
                    key_signature: <String>,
                    time_signature: '4/4',
                    cleftype: <String>,
                    correct_answers: [
                        {keys: [<String>], duration: 'q' },...
                    ]
                    answer_count: 6
                }
            }
        }
     */

  const keySignature = generateKeySignature();
  const correctAnswers = getRandomSightreadingPitches(clef);
  const output = {
    page_type: 'random_activity',
    info: {
      activity_type: 'Sightreading',
      sr: {
        instructions: 'Drag each letter below its corresponding note on the staff',
        key_signature: keySignature,
        time_signature: '4/4',
        cleftype: clef,
        correct_answers: correctAnswers,
        answer_count: 6,
      },
    },
  };
  return output;
}

function generateListeningActivity(clef) {
  /*
    Inputs:
    Outputs: {
      page_type: "random_activity",
      info: {
        activity_type: "interval",
        mc: {
          instructions: String,
          options: Array,
          time_signature: String,
          cleftype: String,
          correct_answer: Array,
        }
      }
    }
  */

  const res = generateListeningNotes(clef);
  // console.log('-------');
  // console.log('res: ', res);
  const output = {
    page_type: 'random_activity',
    info: {
      activity_type: 'Listening-Multiple-Choice',
      mc: {
        instructions: 'Listen to the notes and select the stave that correctly displays the notes.',
        options: res[1],
        time_signature: '4/4',
        cleftype: clef,
        correct_answer: res[0],
      },
    },
  };

  return output;
}

function generateIntervalsActivity() {
/*
    Inputs:
    Outputs: {
            page_type: "random_activity",
            info: {
                activity_type: "interval",
                sr: {
                    instructions: "Listen to each pair of notes played. If they form the desired interval, click yes. If not, click no.",
                    intervals: [[note1, note2]],
                    answers:[
                        <String>
                    ],
                    answer_count: 6,

                }
            }
        }

    For now, we'll only do ascending intervals
*/
  // returns  [semitones, name] of the interval
  const interval = generateInterval();
  // returns [ [notes], [correctness]]
  const intervals = generateIntervals(interval[0]);
  // console.log('-----------');
  // console.log('interval: ', interval);
  // console.log('intervals: ', intervals);

  // eslint-disable-next-line max-len
  const instructions = 'Listen to each pair of notes played. If they form a '.concat(interval[1], ', click yes. If not, click no. Remember -- the first interval played is always correct. Listen to it as many times as you like! You need to get at least 80% to pass');
  const output = {
    page_type: 'random_activity',
    info: {
      activity_type: 'Listening-Intervals',
      i: {
        instructions,
        intervals: intervals[0],
        answers: intervals[1],
        answer_count: 6,

      },
    },
  };
  return output;
}

function generateSingingActivity(clef) {
/*
    Inputs:
    Outputs: {
      page_type: "random_activity",
      info: {
          activity_type: "singing",
          p: {
            instructions: String,
            cleftype: String,
            correct_answers: [String]
          }
      }
    }
*/

  const notes = generateSingingInterval(clef);
  const output = {
    page_type: 'random_activity',
    info: {
      activity_type: 'Pitch-Matching',
      p: {
        instructions: 'Listen to the given interval, and sing it back!',
        cleftype: clef,
        correct_answers: notes,
      },
    },
  };
  return output;
}

/* end helper functions */
export function generateRandomActivity(types, clef) {
  // get activity type
  const type = pickActivityType(types);

  // // get activity as json
  let activity;
  if (type === 'rhythm') {
    activity = generateRhythmActivity();
  } else if (type === 'sightreading') {
    activity = generateSightreadingActivity(clef);
  } else if (type === 'listening') {
    activity = generateListeningActivity(clef);
  } else if (type === 'singing') {
    activity = generateSingingActivity(clef);
  } else {
    activity = generateIntervalsActivity(clef);
  }
  // return activity;

  return activity;
}
