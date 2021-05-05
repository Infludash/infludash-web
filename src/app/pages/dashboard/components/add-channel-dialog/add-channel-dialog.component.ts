import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { ModeService } from 'src/app/services/mode/mode.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss'],
})
export class AddChannelDialogComponent implements OnInit {
  constructor(
    public modeService: ModeService,
    private library: FaIconLibrary,
    private authService: SocialAuthService,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.library.addIcons(faYoutube);
    this.library.addIcons(faFacebook);
    this.library.addIcons(faInstagram);
  }

  private socialUser: SocialUser | undefined;

  ngOnInit(): void {}

  signInWithGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((result) => {
        this.socialUser = result;
        console.log(this.socialUser);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async linkChannel(): Promise<void> {
    if (this.socialUser === undefined) {
      this.openSnackBar('Something went wrong. Please try again.', 'Ok');
    } else {
      try {
        const resp = await this.apiService.apiRequest(
          'post',
          'socials/youtube/link',
          ApiType.base,
          true,
          { socialUser: this.socialUser, userEmail: localStorage.getItem('email') }
        );
        window.location.reload();
      } catch (error) {
        console.log(error);
        this.openSnackBar('Something went wrong. Please try again.', 'Ok');
      }
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 5000 });
  }
}
