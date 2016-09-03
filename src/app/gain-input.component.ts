import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'hs-gain-input',
  template: `
    <input #input
          type="range"
          [value]="gain"
          (input)="emitChange()"
          min="0"
          max="1"
          step="0.01">
    {{ roundGain(gain) }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GainInputComponent {
  @Input() gain: number;
  @Output() gainChange = new EventEmitter<number>();
  @ViewChild('input') input: ElementRef;

  emitChange() {
    this.gainChange.next(parseFloat(this.input.nativeElement.value));
  }

  roundGain() {
    return Number(this.gain).toFixed(2);
  }

}