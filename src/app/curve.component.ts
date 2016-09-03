import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { List } from 'immutable';

@Component({
  selector: 'hs-curve',
  template: `
    <canvas #cnvs>
    </canvas>
  `,
  styles: [`
    :host {
      display: block;
      overflow: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurveComponent implements OnInit, OnChanges {
  @Input() strong = false;
  @Input() data: List<number>;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width = 500;
  private height = 50;

  constructor(private elRef: ElementRef, private ngZone: NgZone) { }

  @ViewChild('cnvs') set canvasRef(canvasRef: ElementRef) {
    this.canvas = canvasRef.nativeElement;
    this.ctx = canvasRef.nativeElement.getContext('2d');
  }

  ngOnInit() {
    this.onResize();
  }

  ngOnChanges() {
    this.draw();
  }

  @HostListener('window:resize') onResize() {
    this.width = this.elRef.nativeElement.offsetWidth;
    this.height = this.elRef.nativeElement.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.draw();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!this.data) {
      return;
    }
 
    this.ctx.strokeStyle = '#e5e5e5';
    if (this.strong) {
      this.ctx.lineWidth = 3;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);
    this.ctx.lineTo(this.width, this.height / 2);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#9c27b0';
    this.ctx.beginPath();
    const step = this.width / this.data.size;
    const effectiveHeight = this.height - this.ctx.lineWidth * 2;
    this.data.forEach((value, index) => {
      const x = step * index;
      const y = effectiveHeight + this.ctx.lineWidth - (value + 1) / 2 * effectiveHeight;
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.stroke();
  }

}