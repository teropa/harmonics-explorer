import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';


@Component({
  selector: 'hs-mute-control',
  template: `
    <button md-button *ngIf="!playing" (click)="start.next()">
      <md-icon>volume_up</md-icon> Unmute
    </button>
    <button md-button *ngIf="playing" (click)="stop.next()">
      <md-icon>volume_off</md-icon> Mute
    </button>
  `,
  styles: [`
    [md-button] {
      min-width: 8em;
    }
    [md-button] md-icon {
      vertical-align: middle;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MuteControlComponent {
  @Input() playing: boolean;
  @Output() start = new EventEmitter<any>();
  @Output() stop = new EventEmitter<any>();
}