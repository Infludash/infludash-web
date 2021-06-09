import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CookieDialogComponent } from './components/cookie-dialog/cookie-dialog.component';
import { CookieService } from './services/cookie/cookie.service';
import { ModeService } from './services/mode/mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'infludash-web';

  constructor(
    public modeService: ModeService,
    public dialog: MatDialog,
    public cookieService: CookieService
  ) {
    if (cookieService.getCookie('AcceptedCookies') !== 'True') {
      const dialogRef = this.dialog.open(CookieDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        // save cookie that user accepted cookies
        document.cookie = 'AcceptedCookies=True';
      });
    }
    if (this.modeService.getMode() === '') {
      this.modeService.setMode('light');
    }
    this.modeService.setModeToBody();
  }
}
