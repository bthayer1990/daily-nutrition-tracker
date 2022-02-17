import { Component, HostListener } from '@angular/core';
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

  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.mobileMenuActive = false;
  }

  toggleMobileMenu($event: any): void {
    $event.stopPropagation(); // stops the HostListener event from being triggered
    this.mobileMenuActive = !this.mobileMenuActive;
  }
}
