// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return from(this.auth.currentUser ? Promise.resolve(this.auth.currentUser) : Promise.reject('No user')).pipe(
      switchMap(user => {
        if (user) {
          return this.authService.getUserRole(user.uid).pipe(
            map(role => {
              const allowedRoles = route.data['roles'] as Array<string>;
              if (allowedRoles.includes(role)) {
                return true;
              } else {
                this.router.navigate(['/unauthorized']);
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      }),
      take(1)
    );
  }
}
