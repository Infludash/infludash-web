import { Component, OnInit } from '@angular/core';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from '../components/add-channel-dialog/add-channel-dialog.component';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { SocialType } from 'src/app/helpers/SocialType';
import { ModeService } from 'src/app/services/mode/mode.service';
import { SocialService } from 'src/app/services/api/social.service';
import { DeleteChannelDialogComponent } from '../components/delete-channel-dialog/delete-channel-dialog.component';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  templateUrl: './social-channels.component.html',
  styleUrls: ['./social-channels.component.scss'],
})
export class SocialChannelsComponent implements OnInit {
  constructor(
    private library: FaIconLibrary,
    private dialog: MatDialog,
    private apiService: ApiService,
    public mode: ModeService,
    private social: SocialService,
    private toastService: ToastService
  ) {
    library.addIcons(faYoutube);
    this.SocialType = SocialType;
  }
  public SocialType;
  public channels: any;

  async ngOnInit(): Promise<void> {
    this.channels = await this.getAllChannels();
    console.log(this.channels);
  }

  openDeleteChannelDialog(channel: any): void {
    const dialogRef = this.dialog.open(DeleteChannelDialogComponent, {
      data: { channel },
    });

    dialogRef.afterClosed().subscribe((result) => {
      let n: ReturnType<typeof setTimeout>;
      n = setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    });
  }

  openAddChannelDialog(): void {
    const dialogRef = this.dialog.open(AddChannelDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      let n: ReturnType<typeof setTimeout>;
      n = setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    });
  }

  async getAllChannels(): Promise<any> {
    const socials = await this.apiService.apiRequest('post', 'socials', ApiType.base, true, {
      userEmail: localStorage.getItem('email'),
    });
    return socials;
  }

  async getMyYtChannel(): Promise<any> {
    const channel = await this.apiService.apiRequest(
      'post',
      'socials/youtube/channel',
      ApiType.base,
      true,
      {
        access_token: await this.social.checkAndGetAccessToken(),
      }
    );
    return channel;
  }
}
