import { Component, OnInit } from '@angular/core';
import { ModeService } from 'src/app/services/mode/mode.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { SocialType } from 'src/app/helpers/SocialType';

@Component({
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  constructor(public mode: ModeService, public apiService: ApiService) {}

  socialType: string[] = SocialType;
  allChannels: any[] = [];
  socialSelected = false;
  selectedDate = 'Select a date in the calendar';

  async ngOnInit(): Promise<void> {
    this.allChannels = await this.getAllChannels();
  }

  async getAllChannels(): Promise<any> {
    const socials = await this.apiService.apiRequest('post', 'socials', ApiType.base, true, {
      userEmail: localStorage.getItem('email'),
    });
    return socials;
  }

  toggleSelected(event: Event): void {
    if (this.socialSelected === true) {
      this.socialSelected = false;
    } else {
      this.socialSelected = true;
    }
    document.querySelector('.social-select-pop')?.classList.toggle('selected');
  }

  getSelectedDate(date: any): void {
    console.log(date);

    this.getSelectedDate = date;
  }
}
