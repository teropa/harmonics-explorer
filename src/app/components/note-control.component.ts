import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'hs-note-control',
  template: `
    <button md-icon-button *ngIf="canDecrease()" (click)="decrease()">
      <md-icon>arrow_downward</md-icon>
    </button>
    <span class="label">{{ getFrequencyNote() }}</span>
    <button md-icon-button *ngIf="canIncrease()" (click)="increase()">
      <md-icon>arrow_upward</md-icon>
    </button>
  `,
  styles: [`
    :host {
      color: white;
    }
    button {
      margin: 7px 5px;
    }
    .label {
      display: inline-block;
      width: 2em;
      text-align: center;
    }
  `],
  // This is a dumb, stateless component with immutable inputs. We can use
  // OnPush change detection.
  changeDetection: ChangeDetectionStrategy.OnPush
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
    return !this.notes.isLowestAllowedFrequency(this.frequency);
  }

  canIncrease() {
    return !this.notes.isHighestAllowedFrequency(this.frequency);
  }

  increase() {
    this.frequencyChange.next(this.notes.getHigherFrequency(this.frequency));
  }

  decrease() {
    this.frequencyChange.next(this.notes.getLowerFrequency(this.frequency));
  }

}