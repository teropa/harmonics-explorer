import { Injectable } from '@angular/core';

const A4_FREQUENCY = 440;
const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

@Injectable()
export class NoteService {

  getNote(frequency: number) {
    const centDistanceToA4 = 1200 * Math.log10(frequency / A4_FREQUENCY) / Math.log10(2); 
    const noteDistanceToA4 = Math.floor(centDistanceToA4 / 100);
    const distanceOctaves = Math.floor(Math.abs(noteDistanceToA4) / 12);
    const distanceNotesInOctave = noteDistanceToA4 - distanceOctaves * 12;
    
    let octave = 4 + distanceOctaves;
    let noteIndex = OCTAVE.indexOf('A') + distanceNotesInOctave;
    while (noteIndex < 0) {
      octave--;
      noteIndex += OCTAVE.length;
    }
    while (noteIndex > OCTAVE.length - 1) {
      octave++;
      noteIndex -= OCTAVE.length;
    }

    return `${OCTAVE[noteIndex]}${octave}`;
  }

  isSmallestAllowedFrequency(frequency: number) {
    return this.getNote(frequency) === 'C0';
  }

  isLargestAllowedFrequency(frequency: number) {
    return this.getNote(frequency) === 'B7';
  }

  getSmallerFrequency(frequency: number) {
    return frequency * Math.pow(2, -1/12);
  }

  getLargerFrequency(frequency: number) {
    return frequency * Math.pow(2, 1/12);
  }

}
