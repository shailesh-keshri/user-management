import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/popup/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.loginForm = new FormGroup({

      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)]),
      roles: new FormControl('', [Validators.required])
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      const {email, password, roles } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (res)=>{
          console.log('Login Success: ',res.user);
          this.snackbarService.showMessage('Login Successful');
          this.authService.getUserRole(res.user.uid).subscribe({
            next: (role) => {
              console.log(role);
              if (role.toLowerCase() === 'admin') {
                console.log('if true');
                this.router.navigateByUrl('/admin');
              } else if (role.toLowerCase() === 'supervisor') {
                this.router.navigate(['/supervisor']);
              } else if (role.toLowerCase() === 'worker') {
                this.router.navigate(['/worker']);
              }
            },
            error: error =>{
              console.error('Error Occurred in Fetchng user role ', error);
            }
          })
        },
        error: (err) => {
          console.log('Login Failed: ',err);
        }
      })
    } 
  }
}
