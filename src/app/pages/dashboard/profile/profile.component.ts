import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({});
  user: any;
  constructor(
    private api: ApiService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private token: TokenService
  ) {}

  async ngOnInit(): Promise<void> {
    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password1: ['', Validators.required],
      new_password2: ['', Validators.required],
    });
    this.user = await this.getProfile();
  }

  async getProfile(): Promise<void> {
    const response = await this.api.apiRequest('get', 'user', ApiType.auth, true);
    return response;
  }

  async updateProfile(): Promise<void> {
    try {
      this.user = await this.api.apiRequest('patch', 'user', ApiType.auth, true, this.user);
      localStorage.setItem('email', this.user.email);
      localStorage.setItem('username', `${this.user.first_name} ${this.user.last_name}`);
      this.toast.addToast('User updated successfully!');
    } catch (error) {
      console.log(error);
      if (error.error.username) {
        this.toast.addToast(error.error.username[0]);
      } else {
        this.toast.addToast('Something went wrong! Please try again.');
      }
    }
  }

  async deleteProfile(): Promise<void> {
    try {
      const resp = await this.api.apiRequest(
        'delete',
        `user/${localStorage.getItem('email')}`,
        ApiType.base,
        true
      );
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async downloadData(): Promise<void> {
    try {
      const data: string = await this.api.apiRequest(
        'get',
        `user/${localStorage.getItem('email')}`,
        ApiType.base,
        true
      );
      this.download('data.json', JSON.stringify(data));
    } catch (error) {}
  }

  async changePassword(): Promise<void> {
    if (
      this.changePasswordForm.get('old_password')?.valid &&
      this.changePasswordForm.get('new_password1')?.valid &&
      this.changePasswordForm.get('new_password2')?.valid
    ) {
      try {
        const response = await this.api.apiRequest(
          'post',
          'password/change',
          ApiType.auth,
          true,
          this.changePasswordForm.value
        );
        this.toast.addToast('Password changed successfully!');
        this.ngOnInit();
      } catch (error) {
        if (error.error.old_password) {
          this.toast.addToast(error.error.old_password[0]);
        }
        if (error.error.new_password1) {
          this.toast.addToast(error.error.new_password1[0]);
        }
        if (error.error.new_password2) {
          this.toast.addToast(error.error.new_password2[0]);
        } else {
          this.toast.addToast('Something went wrong! Please try again.');
        }
      }
    } else {
      this.toast.addToast('Please fill in all required fields');
    }
  }

  download(filename: string, text: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
