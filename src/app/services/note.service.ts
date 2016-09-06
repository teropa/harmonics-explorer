/*
 * Service for mapping sound frequencies to notes on the chromatic scale
 */
import { Injectable } from '@angular/core';

// Reference note
const A4_FREQUENCY = 440;
// Chromatic scale
const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

@Injectable()
export class NoteService {

  // Get the note (+octave) on the chromatic scale that matches a freuency 
  getNote(frequency: number) {
    // How far (in notes) are we from the reference note?
    const distanceToA4 = Math.floor(
        12 * Math.log10(frequency / A4_FREQUENCY) / Math.log10(2)
    );
    // How far (in octaves, in either direction) are we from the reference note=
    const distanceOctaves = Math.floor(Math.abs(distanceToA4) / 12);
    // Disregarding octave, how far (in notes) are we from the reference note?
    const distanceNotesInOctave = distanceToA4 - distanceOctaves * 12;
    
    // The octave of this frequency.
    // The reference note is A4, so we calculate the distance from 4.
    let octave = 4 + distanceOctaves;
    // The note within the octave for this frequency.
    // The reference note is A4, so we start from that.
    let noteIndex = OCTAVE.indexOf('A') + distanceNotesInOctave;

    // Adjust octaves until note is between [0..11]. May initially be outside that
    // range because the reference note A is not the first one in the octave.
    while (noteIndex < 0) {
      octave--;
      noteIndex += OCTAVE.length;
    }
    while (noteIndex > OCTAVE.length - 1) {
      octave++;
      noteIndex -= OCTAVE.length;
    }

    // Return the note as a string representation, note + octave, "C4"
    return `${OCTAVE[noteIndex]}${octave}`;
  }

  // Are lower frequencies than this allowed?
  isLowestAllowedFrequency(frequency: number) {
    return this.getNote(frequency) === 'C0';
  }

  // Are higher frequencies than this allowed?
  isHighestAllowedFrequency(frequency: number) {
    return this.getNote(frequency) === 'B7';
  }

  // Get the next lower frequency step.
  getLowerFrequency(frequency: number) {
    return frequency * Math.pow(2, -1/12);
  }

  // Get the next higher frequency step.
  getHigherFrequency(frequency: number) {
    return frequency * Math.pow(2, 1/12);
  }

}
