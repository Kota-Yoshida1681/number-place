import { Component, Input } from '@angular/core';
import { Mode } from '../app.component';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss'
})
export class SquareComponent {
  @Input() number!: Square;
  @Input() mode!: Mode;
}

export interface Square {
  given: InputNum;
  answer: InputNum;
  memo: string;
};
type InputNum = 1|2|3|4|5|6|7|8|9|null;