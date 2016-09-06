import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Preset } from '../services/presets.service';

@Component({
  selector: 'hs-main-menu',
  template: `
    <header>
      <hs-mute-control [playing]="playing"
                       (start)="start.next()"
                       (stop)="stop.next()">
      </hs-mute-control>
      <button md-button (click)="switchToSine()">
        Base sine
      </button>
      <button md-button (click)="switchToSquare()">
        Square
      </button>
      <button md-button (click)="switchToSawTooth()">
        Sawtooth
      </button>
      <hs-note-control [frequency]="fundamentalFrequency"
                       (frequencyChange)="fundamentalFrequencyChange.next($event)">
      </hs-note-control>
    </header>
  `,
  styles: [`
    header {
      position: fixed;
      top: 0;
      width: 100%;
      height: 50px;
      background-color: #333;
      color: white;
    }
    header button {
      margin: 7px 5px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent {
  @Input() playing: boolean;
  @Output() start = new EventEmitter<any>();
  @Output() stop = new EventEmitter<any>();
  @Output() switchToPreset = new EventEmitter<Preset>();

  @Input() fundamentalFrequency: number;
  @Output() fundamentalFrequencyChange = new EventEmitter<number>();

  switchToSine() {
    this.switchToPreset.next(Preset.Sine);
  }

  switchToSawTooth() {
    this.switchToPreset.next(Preset.SawTooth);
  }

  switchToSquare() {
    this.switchToPreset.next(Preset.Square);
  }

}