import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/popup/snackbar.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

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
    private snackbarService: SnackbarService,
    private spinner: SpinnerService
  ) {
    this.loginForm = new FormGroup({

      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)]),
      roles: new FormControl('admin', [Validators.required])
    });
  }

  onLogin() {
    this.loginForm.markAllAsTouched();
    this.spinner.show();
    if (this.loginForm.valid) {
      this.doLogin(this.loginForm.value);
    } 
  }

  private doLogin(value:any){
    const {email, password, roles } = value;
    this.authService.login(email, password).subscribe({
      next: (res)=>{
        console.log('Login Success: ');
        this.snackbarService.showMessage('Login Successful');
        this.spinner.hide();
        this.authService.getUserRole(res.user.uid).subscribe({
          next: (role) => {
            if (role) {
              this.router.navigateByUrl('/'+role);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: error =>{
            console.error('Error Occurred in Fetchng user role ', error);
          }
        })
      },
      error: (err) => {
        this.snackbarService.showMessage('Login Failed');
        console.error('Login Failed: ',err);
        this.spinner.hide();
      }
    })
  }
}
