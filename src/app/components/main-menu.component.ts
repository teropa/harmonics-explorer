/*
 * Main/top menu component.
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Preset } from '../services/presets.service';

@Component({
  selector: 'hs-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
  // This is a dumb, stateless component with immutable inputs. We can use
  // OnPush change detection.
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