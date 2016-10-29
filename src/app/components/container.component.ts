/*
 * Main application component. Renders the top-level layout and its individual
 * subcomponents.
 * 
 * This is also the only "smart component" in this application. We only subscribe
 * to @ngrx/store here, and also only dispatch actions to @ngrx/store here.
 * Other components are stateless and know nothing about the store.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { List } from 'immutable';
import { AppState } from '../app-state';
import { Partial } from '../partial';
import { Preset } from '../services/presets.service';

@Component({
  selector: 'hs-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {
  @Input() partials: List<Partial>;
  @Input() totalCurve: List<number>;
  @Input() masterGain: number;
  @Input() playing: boolean;
  @Output() amplitudeChange = new EventEmitter<{partial: number, amplitude: number}>();
  @Output() masterGainChange = new EventEmitter<number>();
  @Output() fundamentalFrequencyChange = new EventEmitter<number>();
  @Output() start = new EventEmitter();
  @Output() stop = new EventEmitter();
  @Output() presetSwitch = new EventEmitter<Preset>();
  
  // ngFor tracking function for partials. We have a constant number so we can
  // just track by index.
  trackPartial(index: number) { 
    return index;
  }

  roundFrequency(frequency: number) {
    return Number(frequency).toFixed(2);
  }

}