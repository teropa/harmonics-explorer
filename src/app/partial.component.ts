import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { Partial } from './partial';

@Component({
  selector: 'hs-partial',
  template: `
    <div>
      {{ partial.frequency }}Hz
      <input #amplitudeInput
             type="range"
             [value]="partial.amplitude"
             (input)="emitChange()"
             min="0"
             max="1"
             step="0.1">
      <hs-curve [data]="partial.data">
      </hs-curve>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartialComponent {
  @Input() partial: Partial;
  @Output() amplitudeChange = new EventEmitter();
  @ViewChild('amplitudeInput') amplitudeInput: ElementRef;

  emitChange() {
    this.amplitudeChange.emit(parseFloat(this.amplitudeInput.nativeElement.value));
  }
}
