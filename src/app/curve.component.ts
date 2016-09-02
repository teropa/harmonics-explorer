import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { List } from 'immutable';

@Component({
  selector: 'hs-curve',
  template: `
    <canvas #cnvs
            [width]=width
            [height]=height
            [style.width.px]=width
            [style.height.px]=height>
    </canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurveComponent implements AfterViewInit, OnChanges {
  @Input() data: List<number>;
  private ctx: CanvasRenderingContext2D;
  private width = 500;
  private height = 50;

  @ViewChild('cnvs') set canvas(canvasRef: ElementRef) {
    this.ctx = canvasRef.nativeElement.getContext('2d');
  }

  ngAfterViewInit() {
    this.draw();
  }
  ngOnChanges() {
    this.draw();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!this.data) {
      return;
    }

    this.ctx.strokeStyle = '#e5e5e5';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);
    this.ctx.lineTo(this.width, this.height / 2);
    this.ctx.stroke();

    this.ctx.strokeStyle = 'blue';
    this.ctx.beginPath();
    const step = this.width / this.data.size;
    this.data.forEach((value, index) => {
      const x = step * index;
      const y = this.height - (value + 1) / 2 * this.height;
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.stroke();


    this.ctx.rect(0, 0, 100, 100); 
  }

}