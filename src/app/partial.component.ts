import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'hs-partial',
  template: `
    <div class="control">
      <div class="control-label">
        <ng-content></ng-content>
      </div>
      <hs-gain-input [gain]="gain"
                     (gainChange)="gainChange.next($event)">
      </hs-gain-input>
    </div>
    <hs-curve [data]="curveData" [strong]=strong>
    </hs-curve>
  `,
  styles: [`
    :host {
      display: flex;
      overflow: hidden;
    }
    .control {
      flex: 1;

      display: flex;
      align-items: center;
    }
    .control .control-label {
      flex-basis: 30%;
    }
    .control hs-gain-input {
      flex-basis: 70%;
    }
    hs-curve {
      flex: 3;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartialComponent {
  @Input() strong = false;
  @Input() gain: number;
  @Input() curveData: Iterable<number>;
  @Output() gainChange = new EventEmitter();
}
