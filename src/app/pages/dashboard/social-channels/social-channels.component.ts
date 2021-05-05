import { Component, OnInit } from '@angular/core';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from '../components/add-channel-dialog/add-channel-dialog.component';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { SocialType } from 'src/app/helpers/SocialType';

@Component({
  templateUrl: './social-channels.component.html',
  styleUrls: ['./social-channels.component.scss'],
})
export class SocialChannelsComponent implements OnInit {
  constructor(
    private library: FaIconLibrary,
    private dialog: MatDialog,
    private apiService: ApiService
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

  openChannelDialog(): void {
    const dialogRef = this.dialog.open(AddChannelDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async getAllChannels(): Promise<any> {
    const socials = await this.apiService.apiRequest('post', 'socials', ApiType.base, true, {
      userEmail: localStorage.getItem('email'),
    });
    return socials;
  }
}
