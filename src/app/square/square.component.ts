import { Component, Input } from '@angular/core';
import { Mode } from '../app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss'
})
export class SquareComponent {
  @Input() context!: Square;
  @Input() mode!: Mode;
  @Input() forcused!: boolean;

}

export interface Square {
  given: InputNum;
  answer: InputNum;
  memo: string;
};
type InputNum = 1|2|3|4|5|6|7|8|9|null;