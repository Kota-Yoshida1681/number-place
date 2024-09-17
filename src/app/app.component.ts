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
  forcusIndex: number = -1;
  forcusNumber: InputNum = null;
  inputs: Square[][] = Array.from<unknown, Square[]>({length: 9}, () => Array.from<unknown, Square>({length: 9}, () => ({given: null, answer: null, memo: ''})));
  outputs: InputNum[][] = Array.from<unknown, InputNum[]>({length: 9}, () => Array.from<unknown, InputNum>({length: 9}, () => null));
  validations: boolean[] = Array.from<unknown, boolean>({length: 81}, () => true);

  static calcSameFrameIndice(index: number): number[] {
    return [0, 1, 2].map(i => i + Math.floor(index / 3)*3).filter(i => i !== index);
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
      this.updateValidation(row*9+i);
      this.updateValidation(i*9+line);
    }
    for (const row_ of AppComponent.calcSameFrameIndice(row)) {
      for (const line_ of AppComponent.calcSameFrameIndice(line)) {
        this.updateValidation(row_*9+line_);
      }
    }
  };

  updateValidation(index: number): void {
    const row = Math.floor(index / 9);
    const line = index % 9;
    const number = this.outputs[row][line];
    if (number === null) {
      this.validations[index] = true;
      return;
    }

    // 同列を検証
    if (this.outputs[row].some((value, index) => index!==line&&value===number)) {
      this.validations[index] = false;
      return;
    };

    // 同行を検証
    if (this.outputs.map(row => row[line]).some((value, index) => index!==row&&value===number)) {
      this.validations[index] = false;
      return;
    }

    // 残りの同枠を検証
    for (const row_ of AppComponent.calcSameFrameIndice(row)) {
      for (const line_ of AppComponent.calcSameFrameIndice(line)) {
        if (this.outputs[row_][line_]===number) {
          this.validations[index] = false;
          return;
        }
      }
    }

    this.validations[index] = true;
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('keyup', (event: KeyboardEvent) => this.inputNum(event));
    }
  };

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('keyup', (event: KeyboardEvent) => this.inputNum(event));
    }
  }
}

export type Mode = "create" | "answer" | "memo";