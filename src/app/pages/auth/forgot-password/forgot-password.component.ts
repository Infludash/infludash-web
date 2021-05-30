import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  passwordResetForm: FormGroup = new FormGroup({});
  errorResponse: unknown[] = [];
  emailSent = false;
  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.passwordResetForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  passwordReset(): void {
    if (this.passwordResetForm.get('email')?.valid) {
      this.api
        .apiRequest('post', 'password/reset', ApiType.auth, false, this.passwordResetForm.value)
        .then((response: any) => {
          if (response.detail === 'Password reset e-mail has been sent.') {
            this.emailSent = true;
          }
        })
        .catch((err: HttpErrorResponse) => {
          if (err.error.non_field_errors) {
            this.errorResponse = [];
            for (const error of err.error.non_field_errors) {
              this.errorResponse.push(error);
            }
          }
          if (err.error.email) {
            for (const error of err.error.email) {
              this.errorResponse.push(error);
            }
          }
        });
    }
  }
}
