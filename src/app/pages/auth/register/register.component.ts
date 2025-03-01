import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['../auth.scss', './register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  errorResponse: unknown[] = [];
  loading = false;
  privacyAccept = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private token: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }

  register(): void {
    this.loading = true;
    if (
      this.registerForm.get('first_name')?.valid &&
      this.registerForm.get('last_name')?.valid &&
      this.registerForm.get('email')?.valid &&
      this.registerForm.get('password1')?.valid &&
      this.registerForm.get('password2')?.valid &&
      this.privacyAccept === true
    ) {
      this.api
        .apiRequest('post', 'registration', ApiType.auth, false, this.registerForm.value)
        .then((response: any) => {
          console.log(response);
          if (response.detail === 'Verification e-mail sent.') {
            localStorage.setItem('justRegistered', this.registerForm.get('email')?.value);
            this.router.navigate(['/email-confirm']);
          }
        })
        .catch((err: HttpErrorResponse) => {
          this.loading = false;
          console.log(err.error);

          this.errorResponse = [];
          if (err.error.non_field_errors) {
            for (const error of err.error.non_field_errors) {
              this.errorResponse.push(error);
            }
          }
          if (err.error.email) {
            for (const error of err.error.email) {
              this.errorResponse.push(error);
            }
          }
          if (err.error.password1) {
            for (const error of err.error.password1) {
              this.errorResponse.push(error);
            }
          }
          if (err.error.password2) {
            for (const error of err.error.password2) {
              this.errorResponse.push(error);
            }
          }
        });
    } else {
      if (this.privacyAccept === false) {
        this.errorResponse.push('You must accept our privacy policy');
      }
      this.loading = false;
      this.errorResponse.push('Please fill in all required fields');
    }
  }
}
