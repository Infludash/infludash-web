import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { ModeService } from 'src/app/services/mode/mode.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-delete-channel-dialog',
  templateUrl: './delete-channel-dialog.component.html',
  styleUrls: ['./delete-channel-dialog.component.scss'],
})
export class DeleteChannelDialogComponent implements OnInit {
  constructor(
    public mode: ModeService,
    private toast: ToastService,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { channel: any }
  ) {}

  ngOnInit(): void {}

  async deleteChannel(channel: any): Promise<void> {
    try {
      const resp = await this.api.apiRequest(
        'delete',
        'socials/youtube/channel/' + channel.socialId,
        ApiType.base,
        true
      );
      this.toast.addToast('Channel deleted successfully!');
    } catch (error) {
      console.log(error);
    }
  }
}
