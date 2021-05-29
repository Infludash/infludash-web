import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ModeService {
  constructor(private router: Router) {}

  getMode(): string {
    return localStorage.getItem('mode') ?? '';
  }

  setMode(mode: string): void {
    localStorage.setItem('mode', mode);
    this.setModeToBody();
  }

  toggleMode(): void {
    if (this.getMode() === 'light') {
      this.setMode('dark');
    } else if (this.getMode() === 'dark') {
      this.setMode('light');
    }
    this.setModeToBody();
  }

  setModeToBody(): void {
    if (window.location.href.indexOf('app') > -1) {
      if (this.getMode() === 'light') {
        document.querySelector('body')?.classList.add('light');
        document.querySelector('body')?.classList.remove('dark');
      }
      if (this.getMode() === 'dark') {
        document.querySelector('body')?.classList.add('dark');
        document.querySelector('body')?.classList.remove('light');
      }
    }
  }
}
