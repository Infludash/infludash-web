import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModeService } from 'src/app/services/mode/mode.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { SocialType } from 'src/app/helpers/SocialType';
import { Observable, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ToastService } from 'src/app/services/toast/toast.service';

export interface Page {
  name: string;
  accessToken: string;
  id: string;
}

@Component({
  providers: [DatePipe],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  @ViewChild('videoUpload') videoUpload: any;
  @ViewChild('thumbnailUpload') thumbnailUpload: any;

  uploadYTVidForm: FormGroup = new FormGroup({});
  postFbForm: FormGroup = new FormGroup({});
  socialType: string[] = SocialType;
  allChannels: any[] = [];
  socialSelected = false;
  selectedDate: string | null = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
  dateSubscription = new Observable();
  toggledType: string | undefined = '';

  // chip list
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  videoCategories: { id: string; title: string }[] = [];
  videoFiles: Subject<FileList>;

  calendarEvents: CalendarEvent[] = [];

  today: Date = new Date();
  selectedFbPages: any[] = [];
  preferences: any = {};

  constructor(
    public mode: ModeService,
    public apiService: ApiService,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private toast: ToastService
  ) {
    this.videoFiles = new Subject<FileList>();
  }

  async ngOnInit(): Promise<void> {
    this.preferences = await this.getPreferences();
    this.uploadYTVidForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [this.preferences.description, Validators.required],
      tags: ['', Validators.required],
      categoryId: ['', Validators.required],
      privacyStatus: ['', Validators.required],
    });
    this.postFbForm = this.formBuilder.group({
      message: ['', Validators.required],
    });

    this.allChannels = await this.getAllChannels();
    this.getVideoCategories();
    this.calendarEvents = await this.getCalendarEvents();
    this.socialSelected = false;
  }

  async getAllChannels(): Promise<any> {
    const socials = await this.apiService.apiRequest('post', 'socials', ApiType.base, true, {
      userEmail: localStorage.getItem('email'),
    });
    return socials;
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const dbEvents = await this.apiService.apiRequest('post', 'posts', ApiType.base, true, {
      userEmail: localStorage.getItem('email'),
    });
    const calendarEvents: CalendarEvent[] = [];
    for (const event of dbEvents) {
      if (event.type === 3) {
        calendarEvents.push({
          start: startOfDay(new Date(event.scheduled)),
          title: event.title,
          color: { primary: '#FF0000', secondary: '#282828' },
        });
      } else if (event.type === 0) {
        calendarEvents.push({
          start: startOfDay(new Date(event.scheduled)),
          title: event.title,
          color: { primary: '#4267B2', secondary: '#898F9C' },
        });
      }
    }

    return calendarEvents;
  }

  async getVideoCategories(): Promise<void> {
    const videoCategories = await this.apiService.apiRequest(
      'get',
      'socials/youtube/videoCategories/BE',
      ApiType.base,
      true
    );

    for (const category of videoCategories.items) {
      this.videoCategories.push({ id: category.id, title: category.snippet.title });
    }
  }

  toggleSelected(event: Event): void {
    const target = event.target as HTMLElement;

    if (target.closest('.social-select-pop')?.classList.contains('disabled') === false) {
      this.toggledType = target.attributes.getNamedItem('type')?.value;
      if (this.socialSelected === true) {
        this.socialSelected = false;
      } else {
        this.socialSelected = true;
      }
      target.closest('.social-select-pop')?.classList.toggle('selected');
    }

    const notSelected = document.querySelectorAll(
      `.social-select-pop:not([type=${this.toggledType}])`
    );
    for (let i = 0; i < notSelected.length; i++) {
      const element = notSelected[i];
      element.classList.toggle('disabled');
    }

    if (target.getAttribute('type') === 'facebook' && this.socialSelected === true) {
      this.getUserPages();
    }
  }

  getSelectedDate(date: any): void {
    this.selectedDate = this.datepipe.transform(date, 'dd/MM/yyyy');
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    // Clear the input value
    event.input.value = '';
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  async uploadYTVideo(event: any): Promise<void> {
    console.log(this.thumbnailUpload.getFiles());

    this.uploadYTVidForm.get('tags')?.setValue(this.tags);
    this.uploadYTVidForm.get('thumbnail')?.setValue(this.thumbnailUpload.getFiles()[0]);
    console.log('submitted');

    console.log(this.uploadYTVidForm.value);
    try {
      const selectedSocial = document.querySelector('[type="youtube"]') as HTMLElement;
      const selectedSocialId = selectedSocial.getAttribute('id');

      let scheduledDate: Date;
      let scheduledMinutes: number;
      scheduledDate = new Date(this.selectedDate ?? '');
      const dateDiff = scheduledDate.getTime() - new Date().getTime();
      console.log(dateDiff);
      scheduledMinutes = Math.floor(dateDiff / 60000); // # minutes
      console.log(scheduledMinutes);

      const social = await this.apiService.apiRequest(
        'get',
        `socials/youtube/${localStorage.getItem('email')}`,
        ApiType.base,
        true
      );
      const formData = this.videoUpload.getFiles()[0] as File;
      const step1 = await this.apiService.apiRequest(
        'post',
        'socials/youtube/upload/prepare-video',
        ApiType.base,
        true,
        {
          access_token: social.accessToken,
          videoData: this.uploadYTVidForm.value,
        }
      );
      console.log(step1);
      const step2 = await this.apiService.apiRequest(
        'file-post',
        `socials/youtube/upload/video`,
        ApiType.base,
        true,
        formData,
        true,
        [
          { key: 'Location', value: String(step1.url) },
          { key: 'Id', value: String(selectedSocialId) },
          { key: 'ScheduledFor', value: String(scheduledMinutes) },
        ]
      );
      console.log(step2);
      this.toast.addToast('YouTube post scheduled successfully');
      this.ngOnInit();
    } catch (error) {
      console.log(error);
    }
  }

  async getUserPages(): Promise<void> {
    const id = document.querySelector('.social-select-pop.selected')?.getAttribute('id');
    const pages = await this.apiService.apiRequest(
      'get',
      `socials/facebook/${id}/pages`,
      ApiType.base,
      true
    );
    this.selectedFbPages = pages.data;
  }

  async postFbPosts(): Promise<void> {
    try {
      const selectedFbCheck = document.querySelectorAll('#pageChecks .mat-checkbox-checked');
      const selectedSocial = document.querySelector('[type="facebook"]') as HTMLElement;
      const selectedSocialId = selectedSocial.getAttribute('id');
      for (let i = 0; i < selectedFbCheck.length; i++) {
        const page = selectedFbCheck[i];
        let scheduledDate: Date;
        let scheduledMinutes: number;
        scheduledDate = new Date(this.selectedDate ?? '');
        const dateDiff = scheduledDate.getTime() - new Date().getTime();
        console.log(dateDiff);
        scheduledMinutes = Math.floor(dateDiff / 60000); // # minutes
        console.log(scheduledMinutes);

        this.apiService.apiRequest('post', 'socials/facebook/post', ApiType.base, true, {
          pageId: page.getAttribute('name'),
          message: this.postFbForm.get('message')?.value,
          accessToken: page.getAttribute('at'),
          scheduledFor: scheduledMinutes,
          socialId: selectedSocialId,
        });
        this.toast.addToast('Facebook post scheduled successfully');
        this.ngOnInit();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getPreferences(): Promise<any> {
    const preferences = await this.apiService.apiRequest(
      'post',
      'preferences/youtube',
      ApiType.base,
      true,
      { email: localStorage.getItem('email') }
    );

    return preferences[0];
  }
}
