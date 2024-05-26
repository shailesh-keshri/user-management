import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/popup/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{

  public signUpForm: FormGroup | any;

  constructor(
    private authService:AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    
  }

  createForm(){
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      roles: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onRegister() {
    if (this.signUpForm.valid) {
      const { email, password, name, roles } = this.signUpForm.value;
      this.authService.register(email, password, name, roles).subscribe({
        next: (res) => {
          console.log('SignUp Success: ',res);
          this.snackbarService.showMessage('Registration Successful');
          console.log(email, password, roles)
           // Check the role of the registered user and navigate accordingly
          if (roles === 'admin') {
            this.router.navigate(['/admin']);
          } else if (roles === 'supervisor') {
            this.router.navigate(['/supervisor']);
          } else if (roles === 'worker') {
            this.router.navigate(['/worker']);
          }
        },
        error: (err) => {
          if (err.code === 'auth/email-already-in-use') {
            this.snackbarService.showMessage('Email is already in use');
          } else {
            console.error('Signup Failed: ', err);
            this.snackbarService.showMessage('Signup Failed. Please try again.');
          }
        }
      })
        
        
    }
  }
}
