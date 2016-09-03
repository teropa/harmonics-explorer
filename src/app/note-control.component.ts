import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteService } from './note.service';

@Component({
  selector: 'hs-note-control',
  template: `
    <button *ngIf="canDecrease()" (click)="decrease()">-</button>
    {{ getFrequencyNote() }}
    <button *ngIf="canIncrease()" (click)="increase()">+</button>
  `
})
export class NoteControlComponent {
  @Input() frequency: number;
  @Output() frequencyChange = new EventEmitter<number>();

  constructor(private notes: NoteService) {
  }

  getFrequencyNote() {
    return this.notes.getNote(this.frequency);
  }

  canDecrease() {
    return !this.notes.isSmallestAllowedFrequency(this.frequency);
  }

  canIncrease() {
    return !this.notes.isLargestAllowedFrequency(this.frequency);
  }

  increase() {
    this.frequencyChange.next(this.notes.getLargerFrequency(this.frequency));
  }

  decrease() {
    this.frequencyChange.next(this.notes.getSmallerFrequency(this.frequency));
  }

}