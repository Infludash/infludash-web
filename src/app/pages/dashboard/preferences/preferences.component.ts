import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent implements OnInit {
  standardCategoriesForm: FormGroup = new FormGroup({});
  standardTagsForm: FormGroup = new FormGroup({});
  boilerplateDescription: FormGroup = new FormGroup({});
  @ViewChild('categories') standardCategoriesInput: ElementRef<HTMLInputElement> | undefined;
  allCategories: any[] = [];
  categoryCtrl: FormControl = new FormControl();

  // chip list
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: string[] = [];
  categories: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  preferences: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.getPreferences();
    this.standardCategoriesForm = this.formBuilder.group({
      categories: ['', Validators.required],
    });
    this.boilerplateDescription = this.formBuilder.group({
      description: ['', Validators.required],
    });
    this.standardTagsForm = this.formBuilder.group({
      tags: ['', Validators.required],
    });

    this.getVideoCategories();
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
  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.categories.push(value);
    }
    // Clear the input value
    event.input.value = '';
  }

  removeCategory(category: string): void {
    const index = this.categories.indexOf(category);
    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);
    if (this.standardCategoriesInput) {
      this.standardCategoriesInput.nativeElement.value = '';
      this.categoryCtrl.setValue(null);
    }
  }

  async getVideoCategories(): Promise<void> {
    const videoCategories = await this.apiService.apiRequest(
      'get',
      'socials/youtube/videoCategories/BE',
      ApiType.base,
      true
    );

    for (const category of videoCategories.items) {
      this.allCategories.push({ id: category.id, title: category.snippet.title });
    }
  }

  async saveStandardCategories(event: any): Promise<void> {
    const resp = await this.apiService.apiRequest(
      'post',
      'preferences/youtube/categories',
      ApiType.base,
      true,
      { email: localStorage.getItem('email'), categories: this.categories }
    );

    this.toast.addToast('Standard categories are saved successfully');
    this.ngOnInit();
  }
  async saveStandardTags(event: any): Promise<void> {
    const resp = await this.apiService.apiRequest(
      'post',
      'preferences/youtube/tags',
      ApiType.base,
      true,
      { email: localStorage.getItem('email'), tags: this.tags }
    );

    this.toast.addToast('Standard set of tags are saved successfully');
    this.ngOnInit();
  }
  async saveBoilerplateDescription(event: any): Promise<void> {
    const resp = await this.apiService.apiRequest(
      'post',
      'preferences/youtube/description',
      ApiType.base,
      true,
      {
        email: localStorage.getItem('email'),
        description: this.boilerplateDescription.get('description')?.value,
      }
    );

    this.toast.addToast('Boilerplate for description saved successfully');
    this.ngOnInit();
  }

  async getPreferences(): Promise<any> {
    const preferences = await this.apiService.apiRequest(
      'post',
      'preferences/youtube',
      ApiType.base,
      true,
      { email: localStorage.getItem('email') }
    );

    this.preferences = preferences[0];
  }
}
