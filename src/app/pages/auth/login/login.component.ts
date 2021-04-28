import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiType } from 'src/app/services/api/ApiType';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['../auth.scss', './login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  email = '';
  password = '';
  errorResponse: unknown[] = [];
  loading = false;
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private token: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.loading = true;
    if (this.loginForm.get('email')?.valid && this.loginForm.get('password')?.valid) {
      this.api
        .postRequest('login', this.loginForm.value, ApiType.auth)
        .then((response: any) => {
          this.token.saveToken(response.access_token);
          this.token.saveRefreshToken(response.refresh_token);
          this.router.navigate(['/app/dashboard']);
        })
        .catch((err: HttpErrorResponse) => {
          this.loading = false;
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
          if (err.error.password1) {
            for (const error of err.error.password1) {
              this.errorResponse.push(error);
            }
          }
        });
    } else {
      this.loading = false;
      this.errorResponse = ['Please fill in all fields'];
    }
  }
}
