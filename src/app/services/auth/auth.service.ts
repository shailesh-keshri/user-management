// src/app/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<any> {
    return from(signOut(this.auth));
  }

  register(email: string, password: string, displayName: string, roles: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        return from(setDoc(userRef, {
          email,
          displayName,
          roles,
        })).pipe(
          map(() => ({ uid: userCredential.user.uid, roles })) // Directly return the roles from the provided value
        );
      })
    );
  }

  getUserRole(uid: string): Observable<string> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userRef)).pipe(
      switchMap((userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return from([userData?.['roles'] || '']);
        } else {
          throw new Error('User does not exist');
        }
      })
    );
  }

  getLoggedInUser(): Observable<any> {
    return new Observable(observer => {
      onAuthStateChanged(this.auth, user => {
        if (user) {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          getDoc(userRef).then(userDoc => {
            if (userDoc.exists()) {
              observer.next({ ...user, ...userDoc.data() });
            } else {
              observer.next(null);
            }
          });
        } else {
          observer.next(null);
        }
      });
    });
  }
}
