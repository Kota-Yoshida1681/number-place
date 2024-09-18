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

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('keyup', (event: KeyboardEvent) => this.inputNum(event));
    }
  };

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('keyup', (event: KeyboardEvent) => this.inputNum(event));
    }
  };

  static calcSameFrameIndice(index: number): number[] {
    return [0, 1, 2].map(i => i + Math.floor(index / 3)*3).filter(i => i !== index);
  };

  static validate(src: InputNum[][], index: number): boolean {
    const row = Math.floor(index / 9);
    const line = index % 9;
    const number = src[row][line];
    if (number === null) {
      return true;
    }

    // 同列を検証
    if (src[row].some((value, index) => index!==line&&value===number)) {
      return false;
    };

    // 同行を検証
    if (src.map(row => row[line]).some((value, index) => index!==row&&value===number)) {
      return false;
    }

    // 残りの同枠を検証
    for (const row_ of AppComponent.calcSameFrameIndice(row)) {
      for (const line_ of AppComponent.calcSameFrameIndice(line)) {
        if (src[row_][line_]===number) {
          return false;
        }
      }
    }

    return true;
  }; 

  static solveNumberPlace(grid: InputNum[][]): boolean {
    const findUnassignedIndex = (grid: InputNum[][]): number => {
      for (let row=0; row<9; row+=1) {
        for (let line=0; line<9; line+=1) {
          if (grid[row][line]===null) {
            return row*9+line;
          }
        }
      }
      return -1;
    };
    const solve = (): boolean => {
      const index = findUnassignedIndex(grid);
      if (index < 0) return true;

      const row = Math.floor(index / 9);
      const line = index % 9;

      for (let num=1; num<=9; num+=1) {
        grid[row][line] = num as InputNum;
        if (!AppComponent.validate(grid, index)) {
          grid[row][line] = null;
          continue;
        };

        if (solve()) {
          return true;
        }

        grid[row][line] = null;
      }

      return false;
    };

    return solve();
  };

  mode: Mode = "create";
  forcusIndex: number = -1;
  forcusNumber: InputNum = null;
  inputs: Square[][] = Array.from<unknown, Square[]>({length: 9}, () => Array.from<unknown, Square>({length: 9}, () => ({given: null, answer: null, memo: ''})));
  private outputs: InputNum[][] = Array.from<unknown, InputNum[]>({length: 9}, () => Array.from<unknown, InputNum>({length: 9}, () => null));
  valids: boolean[] = Array.from<unknown, boolean>({length: 81}, () => true);
  get all_valid(): boolean {
    return this.valids.every(v => v);
  };

  changeMode(mode: Mode) {
    this.mode = mode;
  }

  clickSquare(number: number): void {
    if (number === this.forcusIndex) {
      this.forcusIndex = -1;
      this.forcusNumber = null;
    }
    else {
      this.forcusIndex = number;

      const row = Math.floor(this.forcusIndex / 9);
      const  line = this.forcusIndex % 9;
      this.forcusNumber = this.outputs[row][line];
    }
  }

  inputNum(event: KeyboardEvent): void {
    if (this.forcusIndex < 0) return;
    if (this.mode === 'memo') return;

    const row = Math.floor(this.forcusIndex / 9);
    const line = this.forcusIndex % 9;

    if (event.key === 'Backspace') {
      if (this.mode === 'create') {
        this.inputs[row][line].given = null;
        this.outputs[row][line] = null;
        this.forcusNumber = null;
      }
      else if (this.inputs[row][line].given === null) {
        this.inputs[row][line].answer = null;
        this.outputs[row][line] = null;
        this.forcusNumber = null;
      }
    }
    else {
      const num = Number(event.key);
      if (Number.isNaN(num) || num === 0) return;

      if (this.mode === 'create') {
        this.inputs[row][line].given = num as InputNum;
        this.inputs[row][line].answer = null;
        this.inputs[row][line].memo = '';
        this.outputs[row][line] = num as InputNum;
        this.forcusNumber = num as InputNum;
      }
      else if (this.inputs[row][line].given === null) {
        this.inputs[row][line].answer = num as InputNum;
        this.outputs[row][line] = num as InputNum;
        this.forcusNumber = num as InputNum;
      }
    }

    // 検証
    for (let i=0; i<9; i+=1) {
      this.valids[row*9+i] = AppComponent.validate(this.outputs, row*9+i);
      this.valids[i*9+line] = AppComponent.validate(this.outputs, i*9+line);
    }
    for (const row_ of AppComponent.calcSameFrameIndice(row)) {
      for (const line_ of AppComponent.calcSameFrameIndice(line)) {
        this.valids[row_*9+line_] = AppComponent.validate(this.outputs, row_*9+line_);
      }
    }
  };

  createSample(): void {
    const sample: InputNum[][] = [
      [null, null, null, null,    4, null, null, null, null],
      [   3, null, null, null, null,    9, null,    5, null],
      [   7, null,    8, null,    1, null, null, null, null],
      [null, null,    5, null,    2,    8,    6, null, null],
      [null, null, null, null, null,    3,    8,    1, null],
      [null,    6,    1, null, null, null, null,    4, null],
      [null, null,    9,    8, null, null, null, null, null],
      [null, null, null, null, null,    7, null, null,    2],
      [   6,    4, null, null, null, null, null, null, null],
    ];
    for (let row=0; row<9; row+=1) {
      for (let line=0; line<9; line+=1) {
        this.inputs[row][line].given = sample[row][line];
        this.inputs[row][line].answer = null;
        this.inputs[row][line].memo = '';
        this.outputs[row][line] = sample[row][line];
      }
    }
  };

  resetAnser(): void {
    for (let row=0; row<9; row+=1) {
      for (let line=0; line<9; line+=1) {
        if (this.inputs[row][line].answer) {
          this.inputs[row][line].answer = null;
          this.outputs[row][line] = null;
        }
      }
    }
  };

  autoAnswer(): void {
    const target = this.inputs.map(row => row.map(data => data.given));

    const result = AppComponent.solveNumberPlace(target);

    if (result) {
      for (let row=0; row<9; row+=1) {
        for (let line=0; line<9; line+=1) {
          const data = this.inputs[row][line];
          if (!data.given) {
            data.answer = target[row][line];
            this.outputs[row][line] = target[row][line];
          }
        }
      }
    }
    else {
      alert('答えが見つかりませんでした');
    }
  };
}

export type Mode = "create" | "answer" | "memo";