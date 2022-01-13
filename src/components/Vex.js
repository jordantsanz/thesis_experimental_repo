/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable new-cap */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Vex from 'vexflow';
// eslint-disable-next-line no-unused-vars

class VexNotes extends Component {
  constructor() {
    super();
    this.state = {
      beatValue: null,
      bpm: null,
      jsonNotes: [],
      notes: [],
      measures: [],
      VF: null,
      staveNotes: null,
      ties: [],
      notesReadFromProps: false,
      error: false,
      maxWidth: 1000,
      rowHeight: 300,
    };
  }

  componentDidMount = () => {
    this.renderVexFlow();
    // this.rerenderNotes();
    document.addEventListener('keypress', (event) => {
      if (event.code === 'KeyM') {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const noteArr = this.state.jsonNotes;
        noteArr.push({ clef: this.props.clef, keys: ['c/4'], duration: 'q' });
        this.setState({ jsonNotes: noteArr });
        setTimeout(2000);
        this.renderVexFlow(noteArr);
      } else if (event.code === 'KeyD') {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const noteArr = this.state.jsonNotes;
        noteArr.pop();
        this.setState({ jsonNotes: noteArr });
        setTimeout(2000);
        this.renderVexFlow(noteArr);
      }
    });
  }

  renderVexFlow = (json) => {
    console.log('rerendering vexflow in vex');
    // remove everything all pre-existing taves
    console.log('this props are ', this.props);
    const node = document.getElementById(this.props.divId);
    node.querySelectorAll('*').forEach((n) => n.remove());

    // get notes as json
    const jsonNotes = this.getJsonNotes(json);

    // process json notes
    const arr = this.processJsonNotes(jsonNotes);
    let measures = arr[0];
    const ties = arr[1];
    console.log('ties', ties);
    measures = this.setNoteColors(measures, ties);

    if (this.props.mode === 'sightreading') {
      this.props.setMeasureInfo(measures, this.props.keySignature);
    }

    if (this.checkTicks(measures)) {
      // renders notes and staves
      this.renderNotes(measures, ties);
      // adds event listeners to notes
      this.addListeners(measures);
    } else {
      console.log('TICKCHECK FAILED');
      this.setState({ error: true });
    }
  }

  setNoteColors = (measures, ties) => {
    console.log('setting note colors', this.props.correctnessArray);

    if (this.props.mode === 'rhythm' && this.props.correctnessArray !== undefined && this.props.correctnessArray !== null) {
      console.log('in if');
      let noteCount = 0;
      // loop through each measure
      let tieColor = null;
      for (let j = 0; j < measures.length; j += 1) {
        const measure = measures[j];
        // loop through each note in the measure
        for (let i = 0; i < measure.length; i += 1) {
          const note = measure[i];
          const hasTie = this.hasTie(note, ties);
          if (tieColor !== null) {
            note.setStyle({ fillStyle: tieColor, strokeStyle: tieColor });
            if (!hasTie) {
              tieColor = null;
            }
          } else if (!this.isRest(note)) {
            if (this.props.correctnessArray.length > noteCount) {
              if (this.props.correctnessArray[noteCount] === 1) {
                console.log('setting note');
                note.setStyle({ fillStyle: 'green', strokeStyle: 'green' });
                if (hasTie) {
                  console.log('hasTie');
                  tieColor = 'green';
                } else {
                  tieColor = null;
                }
              } else if (this.props.correctnessArray[noteCount] === 0) {
                note.setStyle({ fillStyle: 'red', strokeStyle: 'red' });
                if (hasTie) {
                  console.log('hasTie');
                  tieColor = 'red';
                } else {
                  tieColor = null;
                }
              }
              noteCount += 1;
            }
          }
        }
      }
    }
    return measures;
  }

  hasTie = (note, ties) => {
    const noteID = note.attrs.id;
    /*
      for each staveNote ---> compare their id to the firstnote
      // the next noteå is automatically assumed to be the next one
    */
    for (let i = 0; i < ties.length; i += 1) {
      const tie = ties[i];
      const tieID = tie.first_note.attrs.id;
      if (tieID === noteID) {
        return true;
      }
    }
    return false;
  }

  isRest = (note) => {
    if (note.customTypes.length > 0 && note.customTypes[0] === 'r') {
      console.log('note', note.duration, 'is a rest');
      return true;
    } else {
      console.log('note', note.duration, 'is not a rest');
      return false;
    }
  }

 getJsonNotes = (json) => {
   // only read from props if jsonNotes is empty
   let jsonNotes = this.state.jsonNotes;
   if (json !== null && json !== undefined) {
     jsonNotes = json;
   } else if (jsonNotes.length <= 1) {
     jsonNotes = this.readNotesFromProps();
   }
   return jsonNotes;
 }

  readNotesFromProps = () => {
    console.log('readNotesFromProps called');
    // const staveNotes = [];
    const jsonNotes = [];
    // const ties = [];
    let i = 0;
    while (i < this.props.notes.length) {
      jsonNotes.push(this.props.notes[i]);
      i += 1;
    }
    this.setState({ jsonNotes });
    console.log('reading notes from props returning', jsonNotes);
    return jsonNotes;
  }

  /* processJsonNotes
  Input: Notes as a json (same format as read in from props)
  Outputs:
    1. Array of measures where each measure is a collection of staveNotes with 'ticks' adding up exactly to the desired amount
    2. Ties array
  */
  processJsonNotes = (json) => {
    let jsonNotes = json;
    if (jsonNotes === undefined || jsonNotes === null || jsonNotes.length < this.state.jsonNotes.length) {
      jsonNotes = this.state.jsonNotes;
    }

    let staveNotes = [];
    let ties = [];
    const measures = [];
    let measureNotes = [];
    const arr = this.parseTimeSignature();
    const bpm = arr[0];
    const beatValue = arr[1];
    const timePerMeasure = bpm * beatValue;
    console.log('timePerMeasure', timePerMeasure);
    let beatCount = 0;
    let staveNote = null;
    let previous = null;

    for (let i = 0; i < jsonNotes.length; i += 1) {
      const note = jsonNotes[i];
      const duration = note.duration;
      beatCount += this.getNoteDurationAsNumber(duration, beatValue);
      console.log('note', i, ' - measure', measures.length, '- beatCount: ', beatCount);
      if (beatCount < timePerMeasure) {
        console.log('measure incomplete');
        // measure incomplete
        staveNote = new Vex.Flow.StaveNote({ clef: this.props.clef, keys: note.keys, duration });
        measureNotes.push(staveNote);
        if (note.tie !== undefined) {
          ties = this.addTie(ties, previous, staveNote);
        }
        this.addDots(staveNote, duration);
        previous = staveNote;
        staveNotes.push(staveNote);
      } else if (beatCount === timePerMeasure) {
        // measure complete
        console.log('measure complete');
        staveNote = new Vex.Flow.StaveNote({ clef: this.props.clef, keys: note.keys, duration });
        measureNotes.push(staveNote);
        measures.push(measureNotes);
        beatCount = 0;
        measureNotes = [];
        if (note.tie !== undefined) {
          ties = this.addTie(ties, previous, staveNote);
        }
        this.addDots(staveNote, duration);
        previous = staveNote;
        staveNotes.push(staveNote);
      } else if (beatCount > timePerMeasure) {
        console.log('too many beats in measure');
        const lastNoteDuration = this.getNoteDurationAsNumber(duration, beatValue);
        console.log('lastNoteDuration', lastNoteDuration);
        const difference = timePerMeasure - (beatCount - lastNoteDuration); // time left in first measure
        console.log('beatCount: ', beatCount, 'difference: ', difference);

        // split up note into two measures

        // note in previous measure
        console.log('calling createStaveNote');
        [measureNotes, ties, staveNote, staveNotes] = this.createStaveNote(note.keys, difference, ties, measureNotes, staveNotes, false);
        measures.push(measureNotes);
        previous = staveNote;
        const firstNote = staveNote;

        // note in next measure
        measureNotes = [];
        beatCount -= timePerMeasure;
        console.log('beatCount going into second half of note', beatCount);
        [measureNotes, ties, staveNote, staveNotes] = this.createStaveNote(note.keys, beatCount, ties, measureNotes, staveNotes, false);

        // tie them together
        // eslint-disable-next-line react/no-access-state-in-setstate
        console.log('adding tie with', firstNote, staveNote);
        ties.push(
          new Vex.Flow.StaveTie({
            first_note: firstNote,
            last_note: staveNote,
            first_indices: [0],
            last_indices: [0],
          }),
        );
        previous = staveNote;
        staveNotes.push(firstNote);
        staveNotes.push(staveNote);
      }
      console.log('previous: ', previous);
    }

    if (measureNotes.length !== 0) {
      console.log('cleaning up stragglers: ', measureNotes);
      console.log('beatCount before adding trailing rests', beatCount);
      while (beatCount < timePerMeasure) {
        let duration = this.getNoteCode(timePerMeasure - beatCount, 'rest');
        if (duration === null) {
          duration = this.getClosestNoteCode(timePerMeasure - beatCount, 'rest');
        }
        console.log('adding rest w value', timePerMeasure - beatCount);
        const rest = new Vex.Flow.StaveNote({ clef: this.props.clef, keys: [this.getKeyOfRest()], duration });
        this.addDots(rest, duration);
        beatCount += this.getNoteDurationAsNumber(duration, beatValue);
        console.log('final beatCount: ', beatCount);
        measureNotes.push(rest);
      }
      console.log('last measure:', measureNotes);
      measures.push(measureNotes);
      measureNotes = [];
    }

    this.setState({ measures });
    console.log('staveNotes.length', staveNotes.length);
    return [measures, ties];
  }

  renderNotes = (notesArray, tiesArray) => {
    let measures = notesArray;
    if (notesArray === null || notesArray === undefined) {
      measures = this.state.notes;
    }

    console.log('tiesArray:', tiesArray);
    let ties = tiesArray;
    if (ties === null || ties === undefined || ties.length < this.state.ties.length) {
      ties = this.state.ties;
    }

    const arr = this.parseTimeSignature();
    const bpm = arr[0];
    const beatCount = arr[2];

    console.log('renderNotes called again with notes', measures);
    const firstMeasureWidth = this.getFirstMeasureWidth(measures[0], this.props.keySignature);
    const VF = Vex.Flow;
    const div = document.getElementById(this.props.divId);
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // This determines the largest size of the window that will render --> if you set this to too small, things will get cut off
    const sizeArr = this.getWindowDimensions(notesArray);
    const x = sizeArr[0];
    const y = sizeArr[1];
    renderer.resize(x, y);

    const context = renderer.getContext();

    // Create a stave at position 10, 40 of width 400 on the canvas.
    const stave = new VF.Stave(10, 100, firstMeasureWidth);

    // // Add a clef and time signature.
    stave.addClef(this.props.clef).addTimeSignature(this.props.timeSignature).addKeySignature(this.props.keySignature);
    stave.setContext(context).draw();

    const maxLineWidth = x;
    let xLocation = stave.x;
    let yLocation = stave.y;
    let newLine = true;
    let measureNotes = [];
    let i = 0;
    console.log('rendering notes: ', measures);
    for (i; i < measures.length; i += 1) {
      measureNotes = measures[i];
      const measureWidth = this.getMeasureWidth(measureNotes);
      console.log('rendering measure', i, 'with xLocation:', xLocation, 'and yLocation', yLocation);

      if (newLine && i === 0) {
        console.log('rendering stave', i);
        const voice = new VF.Voice({ num_beats: bpm, beat_value: beatCount });
        console.log('voice:', voice.totalTicks);
        // .setMode(Vex.Flow.Voice.Mode.SOFT)
        voice.addTickables(measureNotes);

        Vex.Flow.Accidental.applyAccidentals([voice], this.props.keySignature);
        // eslint-disable-next-line no-unused-vars
        const formatter = new VF.Formatter().joinVoices([voice]).format([voice], measureWidth - 80);

        // Render voice
        voice.draw(context, stave);
        // VF.Formatter.FormatAndDraw(context, stave, measureNotes);
        newLine = false;
        xLocation += firstMeasureWidth;
        if (xLocation >= maxLineWidth) {
          xLocation = 10;
          yLocation += 80;
          newLine = true;
        }
      } else {
        let staveMeasure = new VF.Stave(xLocation, yLocation, measureWidth);

        if (newLine) {
          staveMeasure = new VF.Stave(xLocation, yLocation, firstMeasureWidth);
          console.log('adding clef');
          staveMeasure.addClef(this.props.clef).addKeySignature(this.props.keySignature);
          newLine = false;
        }
        const voice = new VF.Voice({ num_beats: bpm, beat_value: beatCount });
        console.log('voice:', voice.totalTicks);
        // .setMode(Vex.Flow.Voice.Mode.SOFT)
        voice.addTickables(measureNotes);

        Vex.Flow.Accidental.applyAccidentals([voice], this.props.keySignature);
        staveMeasure.setContext(context).draw();
        // eslint-disable-next-line no-unused-vars
        const formatter = new VF.Formatter().joinVoices([voice]).format([voice], measureWidth);

        console.log('rendering stave', i);
        // Render voice
        voice.draw(context, staveMeasure);
        xLocation += measureWidth;
        if (xLocation >= maxLineWidth) {
          xLocation = 10;
          yLocation += 80;
          newLine = true;
        }
      }
    }
    console.log('ties:', ties);
    ties.forEach((t) => {
      console.log('first note', t.first_note);
      t.setContext(context).draw();
    });
  }

  getWindowDimensions = (measures) => {
    if (this.props.mode === 'sightreading') {
      return [1300, this.state.rowHeight];
    }
    let width = 0;
    for (let i = 0; i < measures.length; i += 1) {
      if (i === 0) {
        width += this.getFirstMeasureWidth(measures[i], this.props.keySignature);
      } else {
        width += this.getMeasureWidth(measures[i]);
      }
    }

    if (width < this.state.maxWidth) {
      this.props.setMeasureCount(measures.length);
      return [width, this.state.rowHeight];
    } else {
      const rowCount = Math.ceil(this.state.maxWidth / width) + 1;
      console.log('rowCount', rowCount);
      this.props.setMeasureCount(3);
      const dimensions = [this.state.maxWidth, rowCount * this.state.rowHeight];
      console.log('getWindowDimensions returning', dimensions);
      return dimensions;
    }
  }

  /* takes keys, duration --> and splits it into as many notes as need be */
  createStaveNote = (keys, dur, tieArray, mNotes, sNotes, rest) => {
    console.log('createStaveNote called with dur', dur);
    const measureNotes = mNotes;
    const staveNotes = sNotes;
    let totalDuration = 0;
    let type = 'note';
    let previous = null;
    let ties = tieArray;
    if (rest) {
      type = 'rest';
    }
    let i = 0;
    let staveNote = null;

    while (totalDuration < dur) {
      let noteDuration = this.getNoteCode(dur - totalDuration, type);
      if (noteDuration === null) {
        noteDuration = this.getClosestNoteCode(dur, type);
      }
      console.log('noteDuration:', noteDuration);
      totalDuration += this.getNoteDurationAsNumber(noteDuration);
      staveNote = new Vex.Flow.StaveNote({ clef: this.props.clef, keys, duration: noteDuration });
      this.addDots(staveNote, noteDuration);

      if (previous !== null) {
        // add a tie
        ties = this.addTie(ties, previous, staveNote);
      }
      previous = staveNote;
      measureNotes.push(staveNote);
      staveNotes.push(staveNote);
      i += 1;
    }

    console.log('createStaveNote -- totalDuration', totalDuration, 'given total duration', dur, ',', i, 'staveNotes created');
    return [measureNotes, ties, staveNote, staveNotes];
  }

  addTie = (tiesArray, prev, current) => {
    console.log('adding tie with', prev, current);
    const ties = tiesArray;
    if (prev !== null && current !== null && current !== prev) {
      const tie = new Vex.Flow.StaveTie({
        first_note: prev,
        last_note: current,
        first_indices: [0],
        last_indices: [0],
      });
      ties.push(tie);
    }
    return ties;
  }

  getMeasureWidth = (measureNotes) => {
    let width = 160;
    width += measureNotes.length * 20;
    return width;
  }

  getFirstMeasureWidth = (measureNotes, keySignature) => {
    const width = this.getMeasureWidth(measureNotes) + this.getKeySignatureWidth(keySignature);
    return width;
  }

  getKeySignatureWidth = (keySignature) => {
    const manager = new Vex.Flow.KeyManager(keySignature);
    manager.setKey(keySignature);
    const arr = [];
    arr.push(manager.getAccidental('a'));
    arr.push(manager.getAccidental('b'));
    arr.push(manager.getAccidental('c'));
    arr.push(manager.getAccidental('d'));
    arr.push(manager.getAccidental('e'));
    arr.push(manager.getAccidental('f'));
    arr.push(manager.getAccidental('g'));
    let accidentalCount = 0;
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i].accidental !== undefined) {
        accidentalCount += 1;
      }
    }
    return accidentalCount * 16 + 64;
  }

  addDots = (staveNote, duration) => {
    console.log('staveNote.duration: ', duration);
    for (let i = 0; i <= duration.length; i += 1) {
      const char = duration.charAt(i);
      if (char === 'd') {
        console.log('adding dot');
        staveNote.addDotToAll();
      }
    }
  }

  setChildNodesColor = (node, depth, color) => {
    // console.log('recursing with depth ', depth, 'node', node);
    if (node !== null && node.hasChildNodes() && depth < 10) {
      node.childNodes.forEach((n) => {
        this.setChildNodesColor(n, depth + 1, color);
      });
    }
    if (!node.hasChildNodes()) {
      node.setAttribute('stroke', color);
      node.setAttribute('fill', color);
    }
    return true;
  }

  // https://github.com/0xfe/vexflow/blob/master/tests/stavenote_tests.js#L337
  addListeners = (notesArr) => {
    console.log('adding listeners to ', notesArr.length);
    let notes = notesArr;
    if (notes === undefined || notes === null || notes.length < this.state.notes.length) {
      notes = this.state.notes;
    }
    console.log('adding listeners for notes:', notes);
    for (let j = 0; j < notes.length; j += 1) {
      const measure = notes[j];
      for (let i = 0; i < measure.length; i += 1) {
        const note = measure[i];
        const id = 'vf-'.concat(note.attrs.id);
        const element = document.getElementById(id);

        // element.addEventListener('mouseover', () => {
        //   this.setChildNodesColor(element, 0, 'blue');
        // });

        // element.addEventListener('mouseleave', () => {
        //   const color = 'black';
        //   // if (this.props.color !== undefined) {
        //   //   color = this.props.color;
        //   // }
        //   this.setChildNodesColor(element, 0, color);
        // });

        element.addEventListener('click', () => {
          const staveNote = this.getStaveNoteByID(note.attrs.id, notes);
          console.log('staveNote.duration', staveNote.duration);
        });
      }
    }
  }

  getStaveNoteByID = (id, notesArr) => {
    let notes = notesArr;
    if (notes === undefined || notes === null || notes.length < this.state.notes.length) {
      notes = this.state.notes;
    }

    for (let j = 0; j < notes.length; j += 1) {
      const measure = notes[j];
      for (let i = 0; i < measure.length; i += 1) {
        const note = measure[i];
        if (note.attrs.id === id) {
          return note;
        }
      }
    }
    return null;
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
    console.log('value for', duration, ': ', value);
    return value;
  }

  getNoteCode = (n, type) => {
    console.log('getNoteCode called with n', n);
    let code = null;
    if (n === 0.25) {
      code = '16';
    } else if (n === 0.5) {
      code = '8';
    } else if (n === 0.75) {
      code = '8d';
    } else if (n === 0.875) {
      code = '8dd';
    } else if (n === 0.9375) {
      code = '8ddd';
    } else if (n === 1) {
      code = 'q';
    } else if (n === 1.5) {
      code = 'qd';
    } else if (n === 1.75) {
      code = 'qdd';
    } else if (n === 1.875) {
      code = 'qddd';
    } else if (n === 2) {
      code = 'h';
    } else if (n === 3) {
      code = 'hd';
    } else if (n === 3.5) {
      code = 'hdd';
    } else if (n === 3.75) {
      code = 'hddd';
    } else if (n === 4) {
      code = 'w';
    } else if (n === 8) {
      code = '1/2';
    }

    if (type === 'rest' && code !== null) {
      code = code.concat('r');
    }
    console.log('returning code:', code);
    return code;
  }

  getClosestNoteCode = (n, type) => {
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
    console.log('getClosestNote returning code:', code);
    return code;
  }

  parseTimeSignature = () => {
    console.log('parseTimeSignature called');
    const arr = this.props.timeSignature.split('/');
    const beats = parseInt(arr[0], 10);

    const beatWorth = 4 / parseInt(arr[1], 10);
    console.log('beatValue', beatWorth, 'bpm', beats);
    this.setState({ bpm: beats, beatValue: beatWorth });
    return [beats, beatWorth, parseInt(arr[1], 10)];
  }

  getKeyOfRest = () => {
    // looks at clef and determines rest note accordingly
    return 'b/4';
  }

  checkTicks = (measures) => {
    const tickArray = [];
    for (let i = 0; i < measures.length; i += 1) {
      let ticks = 0;
      const measure = measures[i];
      for (let j = 0; j < measure.length; j += 1) {
        const staveNote = measure[j];
        let value = staveNote.ticks.numerator;
        const denom = staveNote.ticks.denominator;
        if (denom > 0) {
          value /= denom;
        }
        ticks += value;
      }
      tickArray.push(ticks);
      console.log('ticks measure', i, ':', ticks);
    }
    for (let x = 0; x < tickArray.length; x += 1) {
      const tick = tickArray[x];
      for (let y = 0; y < tickArray.length; y += 1) {
        if (tick !== tickArray[y]) {
          return false;
        }
      }
    }
    return true;
  }

  render() {
    if (this.props.rerender) {
      this.renderVexFlow();
      this.props.rerenderComplete();
    }
    if (this.state.error) {
      return (
        <div>
          Invalid input -- try something else
        </div>
      );
    } else {
      return (
        <div>
          <div id={this.props.divId} className="stave" />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.auth.authentication,
  };
}

export default connect(mapStateToProps, { })(VexNotes);
