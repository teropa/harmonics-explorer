/*
 * Start/stop (mute/unmute) buttons
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'hs-mute-control',
  // We're using material icons from https://design.google.com/icons/
  // They come from the imported CSS in index.html.
  templateUrl: './mute-control.component.html',
  styleUrls: ['./mute-control.component.css'],
  // This is a dumb, stateless component with immutable inputs. We can use
  // OnPush change detection.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MuteControlComponent {
  @Input() playing: boolean;
  @Output() start = new EventEmitter<any>();
  @Output() stop = new EventEmitter<any>();
}