/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Timer from 'react-compound-timer';
import { TAP_VOLUME, METRONOME_VOLUME } from '../lib/constants';
// import NextButton from './Exercises/NextButton';
import VexNotes from './Vex';
import bassAudio from '../../sounds/bassDrum.mp3';
import floorAudio from '../../sounds/floorTom.mp3';
import hiHatAudio from '../../sounds/hiHat.mp3';
// eslint-disable-next-line no-unused-vars

class Rhythm extends Component {
  constructor() {
    super();
    this.state = {
      notes: null,
      vexNotes: null,
      bps: null,
      durationArray: null,
      correctTimes: null,
      playing: false,
      userAttempting: false,
      metronomeAudio: new Audio('https://aptitune.s3.amazonaws.com/metronomeClick.wav'),
      // floorAudio: new Audio('https://aptitune.s3.amazonaws.com/click2.wav'),
      floorAudio: new Audio(floorAudio),
      bassAudio: new Audio(bassAudio),
      hiHatAudio: new Audio(hiHatAudio),
      curMeasure: 0,
      clickTimes: [],
      baselineTime: null,
      date: new Date(),
      errorArray: null,
      success: null,
      correctnessArray: [],
      listeningArray: [],
      lightBlueArray: [],
      keyPresses: [],
      accuracyArray: null,
      rerender: false,
      foundIndexes: [],
      rightAdjust: '12vw',
      countDownNumber: null,
      timeDelay: 0,
      attempts: 0,
      sentCompleted: false,
      checks1: [],
      checks2: [],
    };
  }

  componentDidMount = () => {
    this.initializeRhythmExercise(this.props.notes, this.props.keys);
    console.log('props: ', this.props);
  }

  initializeRhythmExercise = (noteArray, keyArray) => {
    console.log('initialize');
    let notes = noteArray;
    if (notes === null || notes === undefined) {
      notes = this.props.notes;
    }

    // format notes for vexflow
    const vexNotes = this.formatForVex(notes, keyArray);
    this.setState({ vexNotes });

    // prep for exercise start
    const bps = this.props.bpm / 60;
    console.log(bps, 'bps');
    this.setState({ bps });

    const durationArray = this.createDurationArray(notes, bps, vexNotes);
    this.setState({ durationArray });
  }

  determineKeyPress = (note) => {
    return note.keys[0].charAt(0);
  }

  createDurationArray = (noteArray, beatsPerSecond, vexNotesArray) => {
    let notes = noteArray;
    if (notes === null || notes === undefined) {
      notes = this.props.notes;
    }

    let bps = beatsPerSecond;
    if (bps === null || bps === undefined) {
      bps = this.state.bps;
    }
    const correctTimes = [];
    const durationArray = [];
    const keyArray = [];
    const beatValue = 1;
    const timeDelay = 0;

    for (let i = 0; i < notes.length; i += 1) {
      const duration = this.calculateDuration(notes[i], beatValue, bps);
      // eslint-disable-next-line no-unused-vars
      const keyPress = this.determineKeyPress(vexNotesArray[i]);
      if (durationArray.length < notes.length && i < notes.length - 1) {
        durationArray.push(duration);
        keyArray.push(keyPress);
      } else if (durationArray.length < notes.length && i === notes.length - 1) {
        durationArray.push(duration);
        keyArray.push(keyPress);
      }
    }

    // calculate correct times separately
    let j = 0;
    let found = false;
    let cumulativeTime = 0;
    while (j < notes.length && !found) {
      if (!this.isRest(notes[j])) {
        found = true;
      } else {
        cumulativeTime += Math.round(this.calculateDuration(notes[j], beatValue, bps) * 1000);
        j += 1;
      }
    }

    for (let i = 0; i < durationArray.length; i += 1) {
      correctTimes.push({ cumulativeTime, key: keyArray[i] });
      cumulativeTime += Math.round(durationArray[i] * 1000);
    }
    this.setState({ correctTimes, timeDelay });
    console.log('final duration array: ', durationArray);
    console.log('final correct times array: ', correctTimes);
    return durationArray;
  }

  isRest = (note) => {
    if (note.includes('r')) {
      return true;
    } else {
      return false;
    }
  }

  calculateDuration = (noteCode, beatValue, bps) => {
    const noteDuration = this.getNoteDurationAsNumber(noteCode);
    const duration = noteDuration / (beatValue * bps);
    console.log('duration: ', duration);
    return duration;
  }

  getTimeSignatureDenominator = () => {
    const arr = this.props.timeSignature.split('/');
    const denom = parseInt(arr[1], 10);
    return 4 / denom;
  }

  getNoteDurationAsNumber = (duration) => {
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
            correctnessArray={this.state.userAttempting ? this.state.correctnessArray : this.state.listeningArray}
            rerender={this.state.rerender}
            rerenderComplete={() => { this.setState({ rerender: false }); }}
            setMeasureCount={this.setMeasureCount}
            highlightMeasure={this.state.curMeasure}
            lightBlueArray={this.state.lightBlueArray}
          />
        </div>
      );
    }
  }

  setMeasureCount = (count) => {
    const adjust = count * 6;
    let adjustAmount = adjust.toString();
    adjustAmount = adjustAmount.concat('vw');
    this.setState({ rightAdjust: adjustAmount });
  }

  renderArray = (arr) => {
    if (arr !== null) {
      return (
        <ul>
          {arr.map((element) => {
            return (
              <li>{element}</li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <div>loading...</div>
      );
    }
  }

  getBeatsPerMeasure = () => {
    const arr = this.props.timeSignature.split('/');
    return parseInt(arr[0], 10);
  }

  calculateBaselineTimes = (intervalTime, bpm) => {
    /*
    We're calculating this before the first click should happen --> otherwise the timing of the first click can't be assessed
    */

    const d = new Date();
    const baselineTime = d.getTime() + (intervalTime * (bpm + 1));
    this.setState({ baselineTime });
  }

  playMetronome = (playAnswer) => {
    if (!playAnswer) {
      window.addEventListener('keydown', this.handleKeyDown);
    }
    this.setState({ clickTimes: [], baselineTime: null, playing: true });
    const intervalTime = 1000 / this.state.bps;
    const bpm = this.getBeatsPerMeasure();
    const introTime = Math.round(intervalTime * bpm);

    console.log(introTime, 'introTime');
    const totalTime = this.getTotalTime() * 1000 + introTime;

    this.calculateBaselineTimes(intervalTime, bpm);

    let timeElapsed = 0;
    if (this.state.countDownNumber === null) {
      this.setState({ countDownNumber: bpm });
    }

    let countDownNumber = bpm + 1;
    let tickCount = 0;

    /* Set interval */
    const interval = setInterval(() => {
      if (countDownNumber > 0) {
        countDownNumber -= 1;
        this.setState({ countDownNumber });
      }
      // if (this.state.baselineTime !== null) {
      //   const date = new Date();
      //   console.log('click at ', date.getTime() - this.state.baselineTime);
      // } else {
      //   console.log('click ');
      // }
      this.state.metronomeAudio.volume = METRONOME_VOLUME;
      this.state.metronomeAudio.pause();
      this.state.metronomeAudio.play();
      if (countDownNumber === 0) {
        tickCount += 1;
        this.setState({ curMeasure: Math.floor(tickCount / 4) });
      }

      if (timeElapsed === introTime && playAnswer) {
        setTimeout(() => {
          this.playAnswerClicks(0);
        }, this.state.timeDelay * 1000);
      }
      timeElapsed += intervalTime;
      if (timeElapsed >= totalTime) {
        setTimeout(() => {
          this.setState({ playing: false });
          this.checkAnswers(this.state.clickTimes, this.state.keyPresses, true, playAnswer);
          this.setState({ countDownNumber: null, playing: false });
          if (!playAnswer) {
            window.removeEventListener('keydown', this.handleKeyDown);
          }
        }, 1000);

        if (!playAnswer) {
          this.setState((prevState) => {
            return (
              { attempts: prevState.attempts + 1 }
            );
          });
        }
        clearInterval(interval);
      }
    }, intervalTime);
  }

  checkAnswers = (cTimes, kPresses, final, playAnswer) => {
    let clickTimes = cTimes;
    let keyPresses = kPresses;
    if (clickTimes === null) {
      clickTimes = this.state.clickTimes;
    }

    if (keyPresses === null) {
      keyPresses = this.state.keyPresses;
    }

    if (clickTimes === null && this.state.correctTimes.length === 0) {
      this.setState({ success: true });
    }
    if (clickTimes !== null) {
      const errorArray = [];
      const accuracyArray = [];
      let success = true;
      const correctnessArray = [];
      const foundIndexes = [];
      // if (clickTimes.length === 1) {
      //   correctnessArray.push(1);
      //   this.setState({ correctnessArray });
      // } else {
      // simple checking algorithm -- checks each note in order
      for (let i = 0; i < clickTimes.length; i += 1) {
        const userTime = clickTimes[i];
        const correctTime = this.state.correctTimes[i]?.cumulativeTime;
        if (correctTime === undefined) {
          break;
        }
        const error = Math.abs(correctTime - userTime);
        errorArray.push(error);
        if (error > 350 || (keyPresses[i] !== '' && keyPresses[i] !== undefined && keyPresses[i] !== this.state.correctTimes[i].key)) {
          success = false;
          correctnessArray.push(0);
          if (keyPresses[i] !== this.state.correctTimes[i].key) {
            accuracyArray.push(0);
          } else {
            accuracyArray.push(1);
          }
        } else {
          correctnessArray.push(1);
          accuracyArray.push(1);
        }
      }
      // const { length } = correctnessArray;
      // if (!final) {
      //   setTimeout(() => {
      //     // no attempt in time
      //     if (correctnessArray.length === length) {
      //       const error = 300;
      //       errorArray.push(error);
      //       correctnessArray.push(0);
      //       clickTimes.push(300);
      //       this.setState({ errorArray, correctnessArray, clickTimes });
      //     }
      //   }, 300);
      // }

      if (final && correctnessArray.length < this.state.durationArray.length) {
        correctnessArray.push(0);
        this.setState({ correctnessArray, rerender: true });
      }

      if (final && !success && this.state.userAttempting) {
        this.props.registerCompletion(errorArray, correctnessArray);
        this.setState({
          sentCompleted: true, correctnessArray, errorArray, success, foundIndexes, accuracyArray, userAttempting: false,
        });
        this.props.stopRecording();
      } else if (final && success && !this.state.sentCompleted && this.state.userAttempting) {
        this.props.registerCompletion(errorArray, correctnessArray);
        this.props.stopRecording();
        this.setState({
          sentCompleted: true, correctnessArray, errorArray, success, foundIndexes, accuracyArray, userAttempting: false,
        });
      } else if (!this.state.userAttempting) {
        this.setState({
          success: false, errorArray, correctnessArray, listeningArray: [], foundIndexes, accuracyArray,
        });
      } else {
        this.setState({
          success, errorArray, correctnessArray, foundIndexes, rerender: true, accuracyArray,
        });
      }

      // }
    } else if (final && !playAnswer) {
      this.props.registerCompletion(this.state.errorArray, this.state.correctnessArray);
      this.setState({ sentCompleted: true });
      this.props.stopRecording();
    }
  }

  getUpperBound = (i, foundIndexes) => {
    for (let j = i; j < foundIndexes.length; j += 1) {
      if (foundIndexes[j] !== null) {
        return j;
      }
    }
    return null;
  }

  getLowerBound = (i, foundIndexes) => {
    for (let j = i; j >= 0; j -= 1) {
      if (foundIndexes[j] !== null) {
        return j;
      }
    }
    return 0;
  }

  handleKeyDown = (event) => {
    event.preventDefault();
    let { clickTimes, keyPresses } = this.state;
    const d = new Date();
    if (clickTimes === null) {
      clickTimes = [];
    }
    if (keyPresses === null) {
      keyPresses = [];
    }

    // spacebar click
    if (event.code === 'Space' && this.state.userAttempting) {
      this.lightSpaceBar();
      this.state.bassAudio.volume = TAP_VOLUME + 0.2;
      this.state.bassAudio.currenttime = 0;
      this.state.bassAudio.play();
      const timeClicked = d.getTime();
      clickTimes.push(timeClicked);
      keyPresses.push('f');
      clickTimes = this.processUserInput(clickTimes);
      this.checkAnswers(clickTimes, keyPresses);
      this.setState({ clickTimes, keyPresses });
    }

    // f-key click
    if (event.code === 'KeyF' && this.state.userAttempting) {
      this.lightFKey();
      this.state.floorAudio.volume = TAP_VOLUME;
      this.state.floorAudio.currenttime = 0;
      this.state.floorAudio.play();
      const timeClicked = d.getTime();
      clickTimes.push(timeClicked);
      keyPresses.push('a');
      clickTimes = this.processUserInput(clickTimes);
      this.checkAnswers(clickTimes, keyPresses);
      this.setState({ clickTimes, keyPresses });
    }

    if (event.code === 'KeyJ' && this.state.userAttempting) {
      this.lightJKey();
      this.state.hiHatAudio.volume = TAP_VOLUME;
      this.state.hiHatAudio.currenttime = 0;
      this.state.hiHatAudio.play();
      const timeClicked = d.getTime();
      clickTimes.push(timeClicked);
      keyPresses.push('c');
      clickTimes = this.processUserInput(clickTimes);
      this.checkAnswers(clickTimes, keyPresses);
      this.setState({ clickTimes, keyPresses });
    }

    // j-key click
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

  processClick = () => {
    let { clickTimes } = this.state;
    const d = new Date();
    if (clickTimes === null) {
      clickTimes = [];
    }
    this.state.tapAudio.pause();
    this.state.tapAudio.play();
    const timeClicked = d.getTime();
    clickTimes.push(timeClicked);
  }

  processUserInput = (clickTimes) => {
    if (this.state.baselineTime !== null && clickTimes !== null) {
      const processedClickTimes = [];
      // eslint-disable-next-line array-callback-return
      clickTimes.map((click) => {
        let time = click;
        if (click > 1000000) {
          time -= this.state.baselineTime;
        }
        processedClickTimes.push(time);
      });
      return processedClickTimes;
    } else {
      return clickTimes;
    }
  }

  playAnswerClicks = (i) => {
    if (i < this.state.durationArray.length) {
      const interval = this.state.durationArray[i] * 1000;

      this.state.bassAudio.pause();
      this.state.hiHatAudio.pause();

      if (this.state.correctTimes[i].key === 'a') {
        this.state.floorAudio.pause();
        this.state.floorAudio.play();
        this.lightFKey();
      } else if (this.state.correctTimes[i].key === 'f') {
        this.state.bassAudio.play();
        this.lightSpaceBar();
      } else if (this.state.correctTimes[i].key === 'c') {
        this.state.hiHatAudio.play();
        this.lightJKey();
      }

      const fakeCArray = [];
      for (let j = 0; j < i; j += 1) {
        fakeCArray.push(1);
      }
      fakeCArray.push(1);
      setTimeout(() => {
        this.playAnswerClicks(i + 1);
        this.setState((prevState) => {
          return (
            {
              listeningArray: fakeCArray,
              rerender: true,
            }
          );
        });
      }, interval);
    }
  }

  getTotalTime = () => {
    let totalTime = this.state.timeDelay / 1000;
    for (let i = 0; i < this.state.durationArray.length; i += 1) {
      totalTime += this.state.durationArray[i];
    }
    // const tTime = this.state.correctTimes[this.state.correctTimes.length - 1] / 1000 + 2;
    return totalTime;
  }

  playAnswer = () => {
    this.buildCumulativeChecks();
    this.setState({ playing: true, listeningArray: [], rerender: true });
    this.playMetronome(true);
  }

  buildCumulativeChecks = () => {
    const checks1 = this.getCumulativeChecks();
    const checks2 = this.getCumulativeChecks2();
    this.setState({ checks1, checks2 });
  }

  attemptExercise = () => {
    this.buildCumulativeChecks();
    this.props.startRecording();
    this.setState({
      userAttempting: true, clickTimes: [], keyPresses: [], rerender: true, correctnessArray: [], curMeasure: 0,
    });
    this.playMetronome(false);
    this.props.makeNewAttempt();
  }

  renderPlayButton = () => {
    if (this.state.playing) {
      return (
        <div>Playing...</div>
      );
    } else if (this.state.userAttempting) {
      return (
        <div />
      );
    } else {
      return (
        <button type="button" onClick={this.playAnswer}>play answer</button>
      );
    }
  }

  checkIfInput = (index, time) => {
    const {
      correctnessArray, clickTimes, keyPresses,
    } = this.state;
    if (this.state.correctnessArray.length < index) {
      correctnessArray.push(0);
      keyPresses.push('f/4');
      clickTimes.push(0);
      this.setState({
        correctnessArray, rerender: true, clickTimes,
      });
    }
  }

  checkIfInput2 = (index, time) => {
    const {
      lightBlueArray,
    } = this.state;
    // if (this.state.correctnessArray.length === index) {
    lightBlueArray.push(0);
    // keyPresses.push('f/4');
    // clickTimes.push(0);
    this.setState({
      rerender: true, lightBlueArray,
    });
    // }
  }

  getCumulativeChecks = () => {
    console.log('cumulative checks');
    const intervalTime = 1000 / this.state.bps;
    const bpm = this.getBeatsPerMeasure();
    const introTime = intervalTime * bpm;

    const cumulativeArray = [300 + introTime];
    const checkpointsArray = [];
    if (this.state.durationArray === null) {
      return [];
    }
    for (let i = 1; i < this.state.durationArray.length; i += 1) {
      cumulativeArray.push(cumulativeArray[i - 1] + (this.state.durationArray[i - 1] * 1000));
      // cumulativeArray.push(introTime + this.state.correctTimes[i].cumulativeTime);
    }

    for (let j = 0; j < cumulativeArray.length; j += 1) {
      const checkpoint = {
        time: cumulativeArray[j],
        callback: () => { this.checkIfInput(j, cumulativeArray[j]); },
      };
      checkpointsArray.push(checkpoint);
    }
    return checkpointsArray;
  }

  getCumulativeChecks2 = () => {
    console.log('cum checks 2 called');

    const intervalTime = 1000 / this.state.bps;
    const bpm = this.getBeatsPerMeasure();
    const introTime = Math.round(intervalTime * bpm);
    console.log('intro time: ', introTime);

    console.log(introTime);
    // const cumulativeArray = [introTime];
    const cumulativeArray = [introTime];
    const checkpointsArray = [];
    if (this.state.durationArray === null) {
      return [];
    }
    for (let i = 1; i < this.state.durationArray.length; i += 1) {
      // cumulativeArray.push(cumulativeArray[i - 1] + (this.state.durationArray[i - 1] * 1000));
      cumulativeArray.push(introTime + this.state.correctTimes[i].cumulativeTime);
    }

    for (let j = 0; j < cumulativeArray.length; j += 1) {
      const checkpoint = {
        time: cumulativeArray[j],
        callback: () => { this.checkIfInput2(j, cumulativeArray[j]); },
      };
      checkpointsArray.push(checkpoint);
    }
    console.log('checkpoint array: ', checkpointsArray);
    return checkpointsArray;
  }

  renderGoButton = () => {
    if (this.state.playing) {
      return (
        <div />
      );
    } else if (this.state.userAttempting) {
      return (
        <div>Press the space bar to the beat...</div>
      );
    } else {
      return (
        <button type="button" onClick={this.attemptExercise}>try it</button>
      );
    }
  }

  renderSuccessMessage = () => {
    if (this.state.success === null) {
      return (
        <div />
      );
    } else if (this.state.success) {
      return (
        <div>Success!</div>
      );
    } else {
      return (
        <div>Failure :(</div>
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

  renderButtonsOrSpaceBar = () => {
    if (this.state.sentCompleted) {
      return (
        <div />
      );
    } else if (this.state.playing && !(this.state.success && this.state.correctnessArray.length === this.state.durationArray.length)) {
      return (
        <div className="rhythm-key-buttons">
          <div className="rhythm-f" id="rhythm-f">
            F
          </div>
          <div className="rhythm-spacebar" id="rhythm-spacebar">
            Spacebar
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

  goToNext = () => {
    this.props.goToNext(this.state.attempts, 'Rhythm-Sensing');
  }

  renderTimer = () => {
    if (this.state.userAttempting) {
      return (
        <div className="timers">
          <Timer direction="forward"
            checkpoints={this.state.checks1}
          >
            <Timer.Milliseconds />
          </Timer>
          {/* <Timer direction="forward"
            checkpoints={this.state.checks2}
          >
            <Timer.Milliseconds />
          </Timer> */}
        </div>
      );
    } else {
      return <div />;
    }
  }

  render() {
    let boxShadow = '';
    if (this.state.success && this.state.correctnessArray.length === this.state.durationArray.length) {
      boxShadow = '0 0 50px 30px #9ef509';
    }
    return (
      <div>
        <div className="rhythmPage">
          <div className="timer-hidden">
            {this.renderTimer()}
          </div>
          <div className="countdown-holder">{this.renderCountDown()}</div>
          <div className="rhythm-vex-container" style={{ boxShadow }}>{this.renderVexNotes()}</div>
          {this.renderButtonsOrSpaceBar()}
        </div>
      </div>
    );
  }
}

export default (Rhythm);
