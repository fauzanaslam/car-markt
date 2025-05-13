import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  router = inject(Router);
  currentUser$ = user(this.auth);
  idToken = '';

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user;
    } catch (error) {
      console.error('login error: ', error);
      throw error;
    }
  }

  async signup(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user;
    } catch (error) {
      console.error('signup error: ', error);
      throw error;
    }
  }

  async getToken() {
    let token: string | null = null;
    const user = this.auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    } else if (this.idToken) {
      token = this.idToken;
    }
    return token;
  }

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error('google sign in error: ', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['auth/login']);
    } catch (error) {
      console.error('logout error: ', error);
      throw error;
    }
  }
}
