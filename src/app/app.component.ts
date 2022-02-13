import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mobileMenuActive: boolean = false;

  constructor(public auth: AngularFireAuth) {}

  logout() {
    this.auth.signOut();
  }
}
