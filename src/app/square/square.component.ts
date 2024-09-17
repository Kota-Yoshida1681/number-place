import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Mode } from '../app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss'
})
export class SquareComponent implements OnChanges {
  @Input() context!: Square;
  @Input() mode!: Mode;
  @Input() forcused!: boolean;
  @Input() highlighted!: boolean;
  @Input() validation!: boolean;

  display: 'number' | 'memo' = 'number';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      if (!this.context.given && !this.context.answer && this.mode==='memo') {
        this.display = 'memo';
      }
      else {
        this.display = 'number';
      }
    }
  }
}

export interface Square {
  given: InputNum;
  answer: InputNum;
  memo: string;
};
export type InputNum = 1|2|3|4|5|6|7|8|9|null;