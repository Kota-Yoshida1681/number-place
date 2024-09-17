import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { InputNum, Square, SquareComponent } from './square/square.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SquareComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {  }

  mode: Mode = "create";
  forcus: number = -1;
  inputs: Square[][] = Array.from<unknown, Square[]>({length: 9}, () => Array.from<unknown, Square>({length: 9}, () => ({given: null, answer: null, memo: ''})));


  changeMode(mode: Mode) {
    this.mode = mode;
  }

  clickSquare(number: number): void {
    if (number === this.forcus) {
      this.forcus = -1;
    }
    else {
      this.forcus = number;
    }

    console.log(this.forcus);
  }

  inputNum(event: KeyboardEvent): void {
    if (this.forcus < 0) return;
    if (this.mode === 'memo') return;

    const num = Number(event.key) as InputNum;
    if (Number.isNaN(num)) return;

    const row = Math.floor(this.forcus / 9);
    const  line = this.forcus % 9;

    if (this.mode === 'create') {
      this.inputs[row][line].given = num;
    }
    else {
      this.inputs[row][line].answer = num;
    }
    console.log(this.inputs);
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('keypress', (event: KeyboardEvent) => this.inputNum(event));
    }
  };

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('keypress', (event: KeyboardEvent) => this.inputNum(event));
    }
  }
}

export type Mode = "create" | "answer" | "memo";