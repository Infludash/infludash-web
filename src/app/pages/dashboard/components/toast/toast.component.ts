import { Component, Input, OnInit } from '@angular/core';
import { ModeService } from 'src/app/services/mode/mode.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @Input() duration: number | undefined;

  currentDuration = 0;
  currentPercent = 0;

  constructor(public mode: ModeService, public toast: ToastService) {}

  ngOnInit(): void {
    window.setInterval(() => {
      if (this.duration) {
        this.currentDuration += 1;
        this.currentPercent = (this.currentDuration / this.duration) * 500;
      }
    }, 1);
  }
}
