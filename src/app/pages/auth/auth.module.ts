import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { EmailConfirmComponent } from './email-confirm/email-confirm.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, LogoutComponent, EmailConfirmComponent, ForgotPasswordComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, ReactiveFormsModule],
})
export class AuthModule {}
