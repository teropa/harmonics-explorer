/**
 * Renders a partial (or total) curve on an HTML5 canvas.
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
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
  // This is a dumb, stateless component with immutable inputs. We can use
  // OnPush change detection.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurveComponent implements OnInit, OnChanges {
  @Input() strong = false; // Render a "stronger" curve, used for the total curve.
  @Input() data: List<number>; // The data to render.

  // Our canvas and its context.
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // The dimensions of our canvas.
  private width = 500;
  private height = 50;

  constructor(private elRef: ElementRef) { }

  // Grab a reference to the canvas and its context from the view.
  @ViewChild('cnvs') set canvasRef(canvasRef: ElementRef) {
    this.canvas = canvasRef.nativeElement;
    this.ctx = canvasRef.nativeElement.getContext('2d');
  }

  // Set initial dimensions on init.
  ngOnInit() {
    this.onResize();
  }

  // Draw the curve again whenever changes occur
  // (i.e. a new "data" List has arrived)
  ngOnChanges() {
    this.draw();
  }

  // When the window is resized, recalculate our canvas dimensions and redraw.
  @HostListener('window:resize')
  onResize() {
    // The canvas will fill the width and height of the host element.
    // See what they are and set them for the canvas.
    this.width = this.elRef.nativeElement.offsetWidth;
    this.height = this.elRef.nativeElement.offsetHeight;
    // We're manually setting these instead of using property bindings in
    // the view, because we need these to be set before we invoke "draw".
    // HTML5 canvas is always cleared when its width/height is set, so
    // the order in which this happens is significant.
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

    // Draw the centerline
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);
    this.ctx.lineTo(this.width, this.height / 2);
    this.ctx.stroke();

    // Draw the curve
    this.ctx.strokeStyle = '#9c27b0';
    this.ctx.beginPath();
    const step = this.width / this.data.size; // Each data point in pixels
    const effectiveHeight = this.height - this.ctx.lineWidth * 2; // Reduce height so line is not cut off at top and bottom edges.
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