import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpinnerService } from './services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user$: any;
  user:any;
  public isLoading!: Observable<boolean>;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private spinner: SpinnerService

  ) {
    this.isLoading = this.spinner.spinner$;
  }

  ngOnInit() {
    this.spinner.show();
    this.authService.getLoggedInUser().subscribe({
      next: (response) => {
        this.user = response;
        const roles = this.user?.roles;
        if (this.user) {
          this.router.navigateByUrl('/'+roles);
        } else {
          this.router.navigate(['/home']);
        }
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error occurred:', err);
        this.router.navigate(['/home']);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home']);
      this.spinner.hide();
    });
  }
}
