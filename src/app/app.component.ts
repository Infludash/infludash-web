import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ModeService } from './services/mode/mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'infludash-web';

  constructor(public modeService: ModeService) {
    if (this.modeService.getMode() === '') {
      this.modeService.setMode('light');
    }
    this.modeService.setModeToBody();
  }
}
