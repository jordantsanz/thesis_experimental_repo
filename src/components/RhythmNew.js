/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Timer from 'tiny-timer';
import VexNotes from './Vex';
import metronomeSound from '../../sounds/metronomeSound.wav';
import bassDrum from '../../sounds/bassDrum.mp3';
import floorAudio from '../../sounds/floorTom.mp3';
import hiHatAudio from '../../sounds/hiHat.mp3';

class RhythmNew extends Component {
  constructor() {
    super();
    this.state = {

      currNote: -1, // current blue
      validHit: false, // was valid hit or not
      lastCurNoteCheckpoint: 0, // previous checkpoint

      vexNotes: null, // notes to render
      colorsArray: [], // array of colors to render in notes
      errorArray: [], // array of total time error for each note
      accuracyArray: [], // array of total key press corrects for each note

      userAttempting: false, // user is attempting exercise
      timer: null, // timer for checkpoints
      listening: false, // user is listening to exercise
      success: false, // user completed exercise

      checkpoints: new Map(), // checkpoint callbacks
      curNoteTimeHits: null, // all current note times cumulative

      // audios
      metronomeAudio: new Audio(metronomeSound),
      floorAudio: new Audio(floorAudio),
      bassAudio: new Audio(bassDrum),
      hiHatAudio: new Audio(hiHatAudio),

      baselineTime: '',
      activityOver: false,

      checkpointsCounted: 0,
      countDownNumber: null,
      maxKey: -1,
    };
  }

  componentDidMount = () => {
    this.buildCheckpoints();
    this.initializeRhythmExercise();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  initializeRhythmExercise = () => {
    const vexNotes = this.formatForVex(this.props.notes, this.props.keys);
    // console.log('vexnotes, ', vexNotes);
    this.setState({ vexNotes });
  }

  calculateBaselineTimes = (bpm) => {
    /*
    We're calculating this before the first click should happen --> otherwise the timing of the first click can't be assessed
    */
    const d = new Date();
    console.log(bpm, 'interval times bpm');
    const baselineTime = d.getTime() + ((bpm));
    console.log('baseline time: ', baselineTime);
    console.log('bpm time: ', bpm);
    this.setState({ baselineTime });
  }

  formatForVex = (noteArray, keyArray) => {
    let notes = noteArray;
    if (notes === null || notes === undefined) {
      notes = this.props.notes;
    }
    const vexNotes = [];
    for (let i = 0; i < notes.length; i += 1) {
      const vexNote = { clef: 'percussion', keys: [`${keyArray[i] === '' ? 'a' : keyArray[i]}`], duration: notes[i] };
      vexNotes.push(vexNote);
    }
    return vexNotes;
  }

  processUserInput = (click) => {
    if (this.state.baselineTime !== null) {
      // eslint-disable-next-line array-callback-return
      let time = click;
      if (click > 1000000) {
        time -= this.state.baselineTime;
        console.log(time, this.state.baselineTime);
        return time;
      }
      return click;
    }
    return click;
  }

  handleAttemptToPressNote = (key, timeClicked) => {
    const processedTime = this.processUserInput(timeClicked);
    if (this.state.currNote === -1) {
      return;
    }
    const beatsPerSecond = this.props.bpm / 60;
    const millisecondsPerBeat = this.calculateMetronomeHitInterval(beatsPerSecond);
    const correctKey = this.props.keys[this.state.currNote];
    const correctTime = this.state.curNoteTimeHits[this.state.currNote] - millisecondsPerBeat;
    const { colorsArray, errorArray, accuracyArray } = this.state;

    const error = Math.abs(correctTime - processedTime);
    const pressedCorrectKey = correctKey === key;

    if (colorsArray[this.state.currNote] !== 'red') {
      errorArray.push(error);
      accuracyArray.push(0);
    }

    // if not a valid hit
    if (colorsArray[this.state.currNote] === 'red') {
      console.log('already hit this note, too early on next');
      colorsArray.push('red');
    } else if (colorsArray[this.state.currNote] === 'green') {
      console.log('already hit this note, too early on next');
      colorsArray.push('red');
    } else if (!this.state.validHit) {
      console.log('not valid hit');
      colorsArray[this.state.currNote] = 'red';
    } else if (error > 375) {
      console.log('error too high');
      colorsArray[this.state.currNote] = 'red';
    } else if (!pressedCorrectKey) {
      console.log('did not press correct key;0');
      colorsArray[this.state.currNote] = 'red';
    } else {
      console.log('correct hit');
      colorsArray[this.state.currNote] = 'green';
      accuracyArray[this.state.currNote] = 1;
    }

    console.log(colorsArray, errorArray, accuracyArray);
    this.setState({
      colorsArray, accuracyArray, errorArray, rerender: true,
    });
  }

  handleKeyDown = (event) => {
    if (!this.state.userAttempting) {
      return;
    }
    console.log('key down! ', event.code);
    event.preventDefault();
    const d = new Date();

    // spacebar click
    if (event.code === 'KeyB' && this.state.userAttempting) {
      this.lightSpaceBar();
      this.state.bassAudio.volume = 0.5 + 0.2;
      this.state.bassAudio.currenttime = 0;
      this.state.bassAudio.play();
      this.handleAttemptToPressNote('f/4', d.getTime());
    }

    // f-key click
    if (event.code === 'KeyF' && this.state.userAttempting) {
      this.lightFKey();
      this.state.floorAudio.volume = 0.5;
      this.state.floorAudio.currenttime = 0;
      this.state.floorAudio.play();
      this.handleAttemptToPressNote('a/4', d.getTime());
    }

    if (event.code === 'KeyJ' && this.state.userAttempting) {
      this.lightJKey();
      this.state.hiHatAudio.volume = 0.5;
      this.state.hiHatAudio.currenttime = 0;
      this.state.hiHatAudio.play();
      this.handleAttemptToPressNote('c/5', d.getTime());
    }
  }

  buildCheckpoints = () => {
    // time in between each metronome hit
    const timer = new Timer({ interval: 100, stopwatch: true });
    timer.on('tick', (ms) => {
      if (this.state.checkpoints.has(Math.round(ms / 100) * 100)) {
        const checkpoint = this.state.checkpoints.get(Math.round(ms / 100) * 100);
        this.handleCheckpoint(checkpoint.info.isMetronome, checkpoint.info.isCurNote, checkpoint.info.isValidNote, checkpoint.time);
      }
    });
    this.setState({ timer });

    const beatsPerSecond = this.props.bpm / 60;
    const millisecondsPerBeat = this.calculateMetronomeHitInterval(beatsPerSecond);
    const introTime = millisecondsPerBeat;

    // build times that each metronome is hit
    const metronomeHitTimes = [0, introTime * 1, introTime * 2, introTime * 3];
    for (let i = 0; i < 48; i += 1) {
      metronomeHitTimes.push((i * millisecondsPerBeat) + introTime * 4);
    }

    // BUILD BLUE CHECKPOINTS (Increment current note)
    // to do this: start at 0, each note after is the cumulative time + duration of last note
    const curNoteTimeHits = [introTime * 4];
    // go through each note
    for (let i = 1; i < this.props.notes.length; i += 1) {
      // get note before
      const previousNote = this.props.notes[i - 1];
      const noteDurationInMilliseconds = Math.round(this.convertNoteCodeToMilliseconds(previousNote, beatsPerSecond));
      curNoteTimeHits.push(Math.round(curNoteTimeHits[i - 1] + noteDurationInMilliseconds));
    }

    // console.log('curnotetimehits', curNoteTimeHits);
    this.setState({ curNoteTimeHits });

    // console.log('cur note hit times: ', curNoteTimeHits);

    const validNoteTimeHits = [];
    for (let i = 0; i < this.props.notes.length; i += 1) {
      const currentNote = this.props.notes[i];
      const noteDurationInMilliseconds = Math.round(this.convertNoteCodeToMilliseconds(currentNote, beatsPerSecond));
      // give grace period of half of that note's full duration
      const halvedNoteDuration = noteDurationInMilliseconds * (1 / 2);
      validNoteTimeHits.push(Math.round(halvedNoteDuration + curNoteTimeHits[i]));
    }

    // console.log('valid note time hits: ', validNoteTimeHits);
    // combine three arrays into one checkpoint array
    // curnotetimehits.length === validNoteTimeHits.length, and is max out of three arrays
    // const checkpointsArray = [];
    const checkpointsDict = new Map();
    let metronomeIndex = 4;
    let curNoteIndex = 0;
    let validNoteIndex = 0;

    // go through all values
    while (metronomeIndex < metronomeHitTimes.length || curNoteIndex < curNoteTimeHits.length || validNoteIndex < validNoteTimeHits.length) {
      // get values from array
      for (let i = 0; i < 4; i += 1) {
        checkpointsDict.set(metronomeHitTimes[i], {
          time: metronomeHitTimes[i],
          info: {
            isMetronome: true,
            isCurNote: false,
            isValidHit: false,
          },
        });
      }

      const metronomeVal = metronomeIndex === metronomeHitTimes.length ? Infinity : metronomeHitTimes[metronomeIndex];
      const curNoteVal = curNoteIndex === curNoteTimeHits.length ? Infinity : curNoteTimeHits[curNoteIndex];
      const validNoteVal = validNoteIndex === validNoteTimeHits.length ? Infinity : validNoteTimeHits[validNoteIndex];

      // metronome val is minimum value
      if (metronomeVal <= curNoteVal && metronomeVal <= validNoteVal) {
        if (checkpointsDict.has(metronomeVal)) {
          checkpointsDict.get(metronomeVal).info.isMetronome = true;
        } else {
          const checkpointEntry = {
            time: metronomeVal,
            info: {
              isMetronome: true,
              isCurNote: false,
              isValidNote: false,
            },
          };
          checkpointsDict.set(metronomeVal, checkpointEntry);
        }
        metronomeIndex += 1;

        // cur note value is smallest number
      } else if (curNoteVal <= metronomeVal && curNoteVal <= validNoteVal) {
        // if (checkpointsDict !== undefined && lastCheckpointEntry.time === curNoteVal) {
        if (checkpointsDict.has(curNoteVal)) {
          checkpointsDict.get(curNoteVal).info.isCurNote = true;
        } else {
          const checkpointEntry = {
            time: curNoteVal,
            info: {
              isMetronome: false,
              isCurNote: true,
              isValidNote: false,
            },
          };
          checkpointsDict.set(curNoteVal, checkpointEntry);
        }
        curNoteIndex += 1;

        // valid note val is smallest number
      } else if (validNoteVal <= curNoteVal && validNoteVal <= metronomeVal) {
        if (checkpointsDict.has(validNoteVal)) {
          checkpointsDict.get(validNoteVal).info.isValidNote = true;
        } else {
          const checkpointEntry = {
            time: validNoteVal,
            info: {
              isMetronome: false,
              isCurNote: false,
              isValidNote: true,
            },
          };
          checkpointsDict.set(validNoteVal, checkpointEntry);
        }
        validNoteIndex += 1;
      }
    }
    const keys = Array.from(checkpointsDict.keys());
    let maxKey = -1;
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i] > maxKey) {
        maxKey = keys[i];
      }
    }
    console.log('max key: ', maxKey);
    this.setState({ checkpoints: checkpointsDict, maxKey });
  }

  calculateMetronomeHitInterval = (beatsPerSecond) => {
    const millisecondsPerBeat = 1000 / beatsPerSecond;
    return millisecondsPerBeat;
  }

  playMetronomeSound = () => {
    this.state.metronomeAudio.volume = 0.3;
    // this.state.metronomeAudio.pause();
    this.state.metronomeAudio.play();
  }

  convertNoteCodeToMilliseconds = (duration, beatsPerSecond) => {
    let noteValue = 0;
    if (duration === '8') {
      noteValue = 0.5;
    } else if (duration === 'q') {
      noteValue = 1;
    } else if (duration === 'h') {
      noteValue = 2;
    } else if (duration === 'w') {
      noteValue = 4;
    }
    const durationInSeconds = noteValue / beatsPerSecond;
    return durationInSeconds * 1000;
  }

  handleCheckpoint = (isMetronome, isCurNote, isValidNote, time) => {
    console.log('time: ', time, 'maxKey: ', this.state.maxKey);
    if (time === this.state.maxKey) {
      console.log('time is max key');
      if (this.state.userAttempting) {
        console.log('user is attempting');
        this.props.registerCompletion(this.state.errorArray, this.state.colorsArray);
        this.props.stopRecording();
        this.setState({ success: true, userAttempting: false });
      } else {
        this.setState({
          userAttempting: false, listening: false, colorsArray: [], accuracyArray: [], errorArray: [],
        });
      }
    }
    if (isMetronome) {
      // console.log('is play metronome sound');
      this.state.metronomeAudio.volume = 0.3;
      // this.state.metronomeAudio.pause();
      this.state.metronomeAudio.play();
      console.log('start countdown');
      this.startCountdown(4);
    }
    // current note checkpoint
    if (isCurNote) {
      const { colorsArray, errorArray, accuracyArray } = this.state;
      if (colorsArray.length > 0 && colorsArray[colorsArray.length - 1] === 'blue') {
        colorsArray[this.state.currNote] = this.state.listening ? 'green' : 'red';
        errorArray[this.state.currNote] = 400;
        accuracyArray[this.state.currNote] = 0;
      }
      console.log('curnote: ', this.state.currNote);
      if (colorsArray[this.state.currNote + 1] === 'red') {
        console.log('already answered too early');
      } else {
        colorsArray[this.state.currNote + 1] = this.state.listening ? 'green' : 'blue';
      }

      if (this.state.listening) {
        const key = this.props.keys[colorsArray.length - 1];
        // console.log('key: ', key);
        this.highlightAndPlaySound(key);
      }
      this.setState((prevState) => {
        return (
          {
            currNote: prevState.currNote + 1,
            lastCurNoteCheckpoint: time,
            validHit: true,
            colorsArray,
            rerender: true,
          }
        );
      });
    }
    // handle valid note checkpoint
    if (isValidNote) {
      this.setState({ validHit: false });
      const { colorsArray, errorArray, accuracyArray } = this.state;
      if (colorsArray[this.state.currNote] === 'blue') {
        if (!this.state.listening) {
          colorsArray[this.state.currNote] = 'red';
          errorArray[this.state.currNote] = 400;
          accuracyArray[this.state.currNote] = 0;
        }
        this.setState({ colorsArray, rerender: true });
      }
    }

    this.setState((prevState) => {
      return (
        { checkpointsCounted: prevState.checkpointsCounted + 1 }
      );
    });
  }

  highlightAndPlaySound = (key) => {
    switch (key) {
      case 'a/4':
        this.state.floorAudio.play();
        this.lightFKey();
        break;
      case 'f/4':
        this.state.bassAudio.play();
        this.lightSpaceBar();
        break;
      case 'c/5':
        this.state.hiHatAudio.play();
        this.lightJKey();
        break;
      default:
        break;
    }
  }

  lightSpaceBar = () => {
    const spacebar = document.getElementById('rhythm-spacebar');
    spacebar.style.backgroundColor = '#FFC300';
    setTimeout(() => {
      spacebar.style.backgroundColor = '#FF9400';
    }, 100);
  }

  lightFKey = () => {
    const fKey = document.getElementById('rhythm-f');
    fKey.style.backgroundColor = '#FFC300';
    setTimeout(() => {
      fKey.style.backgroundColor = '#FF9400';
    }, 100);
  }

  lightJKey = () => {
    const jKey = document.getElementById('rhythm-j');
    jKey.style.backgroundColor = '#FFC300';
    setTimeout(() => {
      jKey.style.backgroundColor = '#FF9400';
    }, 100);
  }

  playAnswer = () => {
    this.setState({ playing: true, listening: true, rerender: true });
    this.state.timer.stop();
    this.state.timer.start(100000);

    const beatsPerSecond = this.props.bpm / 60;
    const millisecondsPerBeat = this.calculateMetronomeHitInterval(beatsPerSecond);
    this.calculateBaselineTimes(millisecondsPerBeat);
  }

  startCountdown = (bpm) => {
    if (this.state.countDownNumber === null) {
      console.log('set to bpm');
      this.setState({ countDownNumber: bpm });
    }
    if (this.state.countDownNumber === 0) {
      return;
    }

    if (this.state.countDownNumber > 0) {
      this.setState((prevState) => {
        return (
          { countDownNumber: prevState.countDownNumber - 1 }
        );
      });
    }
  }

  attemptExercise = () => {
    // this.props.startRecording();
    this.setState({
      userAttempting: true, listening: false, clickTimes: [], keyPresses: [], rerender: true, correctnessArray: [], curMeasure: 0, colorsArray: [],
    });
    this.props.makeNewAttempt();
    this.state.timer.stop();
    this.state.timer.start(100000);
    const beatsPerSecond = this.props.bpm / 60;
    const millisecondsPerBeat = this.calculateMetronomeHitInterval(beatsPerSecond);
    this.calculateBaselineTimes(millisecondsPerBeat);
  }

  renderButtonsOrSpaceBar = () => {
    if (this.state.sentCompleted) {
      console.log('sent completed: ');
      return (
        <div />
      );
    } else if ((this.state.listening || this.state.userAttempting) && !(this.state.success)) {
      console.log('listening: ', this.state.listening, 'attempting: ', this.state.userAttempting, 'success: ', !this.state.success);
      return (
        <div className="rhythm-key-buttons">
          <div className="rhythm-f" id="rhythm-f">
            F
          </div>
          <div className="rhythm-spacebar" id="rhythm-spacebar">
            B
          </div>
          <div className="rhythm-j" id="rhythm-j">
            J
          </div>
        </div>
      );
    } else if (!this.state.success) {
      return (
        <div className="rhythm-buttons" id="rhythm-buttons">
          <button type="submit" className="rhythm-attempt-button" onClick={this.playAnswer}>Listen</button>
          <button type="submit" className="rhythm-play-answer-button" onClick={this.attemptExercise}>Start Attempt</button>
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }

  renderVexNotes = () => {
    // eslint-disable-next-line no-unused-vars
    const colorArray = ['blue', 'green', 'red', 'purple'];
    const rand = parseInt(4 * Math.random(), 10);
    const color = colorArray[rand];
    if (this.state.vexNotes === null) {
      return (
        <div />
      );
    } else {
      // style={{ position: 'relative', right: this.state.rightAdjust }}
      return (
        <div>
          <VexNotes
            notes={this.state.vexNotes}
            timeSignature={this.props.timeSignature}
            clef="percussion"
            keySignature="C"
            divId={`rhythm-stave-${this.props.currentPage}`}
            mode="rhythm"
            color={color}
            rerender={this.state.rerender}
            rerenderComplete={() => { this.setState({ rerender: false }); }}
            highlightMeasure={this.state.curMeasure}
            lightBlueArray={this.state.lightBlueArray}
            colorsArray={this.state.colorsArray}
          />
        </div>
      );
    }
  }

  renderCountDown = () => {
    if (this.state.countDownNumber === null) {
      return (<div />);
    } else if (this.state.countDownNumber === 0) {
      return (
        <div className="countdown-text">GO!</div>
      );
    } else {
      return (<div className="countdown-text">{this.state.countDownNumber}</div>);
    }
  }

  render() {
    return (
      <div>
        <div className="countdown-holder">{this.renderCountDown()}</div>
        {
    this.state.vexNotes !== [] ? <div className="rhythm-vex-container">{this.renderVexNotes()}</div> : null
}
        {this.renderButtonsOrSpaceBar()}
      </div>
    );
  }
}
export default RhythmNew;
