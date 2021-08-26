import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { ModeService } from 'src/app/services/mode/mode.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from 'src/app/services/toast/toast.service';

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
    private snackBar: MatSnackBar,
    private toast: ToastService
  ) {
    this.library.addIcons(faYoutube);
    this.library.addIcons(faFacebook);
    this.library.addIcons(faInstagram);
  }

  private socialUser: SocialUser | undefined;

  private googleLoginOptions = {
    scope:
      'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
  };

  private fbLoginOptions = {
    scope:
      'pages_show_list, instagram_basic, instagram_content_publish, pages_read_engagement, pages_manage_posts, public_profile',
    return_scopes: true,
    enable_profile_selector: true,
  };

  ngOnInit(): void {}

  signInWithGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID, this.googleLoginOptions)
      .then((result) => {
        this.socialUser = result;
        console.log(this.socialUser);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  signInWithFacebook(): void {
    this.authService
      .signIn(FacebookLoginProvider.PROVIDER_ID, this.fbLoginOptions)
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
        switch (this.socialUser.provider) {
          case 'GOOGLE':
            const ytresp = await this.apiService.apiRequest(
              'post',
              'socials/youtube/link',
              ApiType.base,
              true,
              {
                socialUser: this.socialUser,
                userEmail: localStorage.getItem('email'),
                regionCode: 'BE',
              }
            );
            const ytpref = await this.apiService.apiRequest(
              'post',
              'preferences/youtube/description',
              ApiType.base,
              true,
              { email: localStorage.getItem('email'), description: null }
            );
            break;
          case 'FACEBOOK':
            const fbresp = await this.apiService.apiRequest(
              'post',
              'socials/facebook/link',
              ApiType.base,
              true,
              {
                socialUser: this.socialUser,
                userEmail: localStorage.getItem('email'),
                regionCode: 'BE',
              }
            );
            break;
          default:
            break;
        }
        this.toast.addToast('Channel created successfully!');
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
