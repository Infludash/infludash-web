import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}
  private toastStack = document.getElementById('toast-stack');
  public toasts: any = [];
  addToast(message: string): void {
    const duration = 5000;
    // create toast
    const toast = { id: Math.floor(Math.random() * (100 - 0) + 0), duration, message };
    // add toast to stack
    this.toasts.push(toast);
    // remove toast after duration
    window.setTimeout(() => {
      this.toasts.splice(this.toasts.indexOf(toast), 1);
    }, duration);
  }
}
