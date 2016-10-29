/*
 * Renders a slider input for signal gain (or amplitude).
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'hs-gain-input',
  templateUrl: './gain-input.component.html',
  styleUrls: ['./gain-input.component.css'],
  // This is a dumb, stateless component with immutable inputs. We can use
  // OnPush change detection.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GainInputComponent implements OnChanges {
  @Input() gain: number;
  gainControl = new FormControl(this.gain);

  // We can simply use the form control's value changes as our gain change emitter.
  @Output() gainChange = this.gainControl.valueChanges;

  // When a new gain is set, update the value in the FormControl.
  ngOnChanges() {
    // Suppress event so that an output event is not caused by this change.
    // If we did not do this, another, redundant input change would soon come in
    // which cancels the slider component's animated transition.
    this.gainControl.setValue(this.gain, {emitEvent: false});
  }

  roundGain() {
    return Number(this.gain).toFixed(3);
  }

}