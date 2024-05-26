// src/app/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, Observable, switchMap } from 'rxjs';

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

  register(email: string, password: string, name: string, roles: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
        return from(setDoc(userRef, {
          email,
          name,
          roles,
          createdAt: new Date()
        }));
      })
    );
  }

  getUserRole(userId: string): Observable<string> {
    const userRef = doc(this.firestore, `users/${userId}`);
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
}
