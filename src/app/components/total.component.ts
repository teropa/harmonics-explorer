/*
 * Renders the total resulting curve of the harmonic series
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { List } from 'immutable';
import { Partial } from '../partial';
import { combineCurves, calculateSineCurve } from '../curves';

// How many samples to visualize in each curve.
const SAMPLE_COUNT = 650;
// The "sample rate frequency" used for visualization. Controls how much
// of the waves are shown.
const SAMPLE_RATE = 44100; 

@Component({
  selector: 'hs-total',
  templateUrl: './partial.component.html',
  styleUrls: ['./partial.component.css'],
  // This is a dumb, stateless component with immutable inputs. We can use
  // OnPush change detection.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalComponent implements OnChanges {
  @Input() gain: number;
  @Input() partials: List<Partial>;
  @Output() gainChange = new EventEmitter();
  data: List<number>;
  strong = true;

  ngOnChanges() {
    const all = <List<List<number>>>this.partials
      .map(p => calculateSineCurve(p.frequency, p.amplitude, SAMPLE_COUNT, SAMPLE_RATE));
    this.data = <List<number>>combineCurves(all, this.gain);
  }

}
