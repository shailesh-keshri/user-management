import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/popup/snackbar.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{

  public signUpForm: FormGroup | any;

  constructor(
    private authService:AuthService,
    private spinner: SpinnerService,
    private snackbarService: SnackbarService,
    private router:Router,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    
  }

  createForm(){
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      displayName: new FormControl('', [Validators.required]),
      roles: new FormControl('admin', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onRegister() {
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.valid) {
      this.doRegistrations(this.signUpForm.value); 
    }
  }

  private doRegistrations(value: any) {
    this.spinner.show();
    const { email, password, displayName, roles } = value; // Use displayName instead of name
    this.authService.register(email, password, displayName, roles).subscribe({
      next: (res) => {
        console.log('SignUp Success: ');
        this.snackbarService.showMessage('Registration Successful');
        this.spinner.hide();

        if (roles) {
          this.router.navigate(['/'+roles]);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        if (err.code === 'auth/email-already-in-use') {
          this.snackbarService.showMessage('Email is already in use');
        } else {
          console.error('Signup Failed: ', err);
          this.snackbarService.showMessage('Signup Failed. Please try again.');
        }
        this.spinner.hide();
      }
    });
  }
}
