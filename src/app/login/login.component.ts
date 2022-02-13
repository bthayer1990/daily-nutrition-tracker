import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }

  async login() {
    const userCred = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    if (userCred.user) {
      this.router.navigateByUrl(`/dashboard`);
    }
  }
}
