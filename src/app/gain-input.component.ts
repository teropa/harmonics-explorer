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
  template: `
    <md-slider [formControl]="gainControl"
               [min]="0"
               [max]="1"
               [step]="0.01">
    </md-slider>
    {{ roundGain(gain) }}
  `,
  styles: [`
    md-slider { width: 80%; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GainInputComponent implements OnChanges {
  @Input() gain: number;
  gainControl = new FormControl(this.gain);
  @Output() gainChange = this.gainControl.valueChanges;

  ngOnChanges() {
    this.gainControl.setValue(this.gain, {emitEvent: false});
  }

  emitChange() {
    //this.gainChange.next(parseFloat(this.input.nativeElement.value));
  }

  roundGain() {
    return Number(this.gain).toFixed(3);
  }

}