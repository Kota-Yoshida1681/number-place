import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Square, SquareComponent } from './square/square.component';

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
  forcus: number = 0;
  inputs: Square[] = Array.from<unknown, Square>({length: 81}, () => ({given: null, answer: null, memo: ''}));


  changeMode(mode: Mode) {
    this.mode = mode;
  }

  clickSquare(number: number): void {
    if (number === this.forcus) {
      this.forcus = 0;
    }
    else {
      this.forcus = number;
    }

    console.log(this.forcus);
  }

  inputNum(event: KeyboardEvent): void {
    const num = Number(event.key);
    if (Number.isNaN(num)) return;

    console.log(num);
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('keypress', this.inputNum);
    }
  };

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('keypress', this.inputNum);
    }
  }
}

export type Mode = "create" | "answer" | "memo";