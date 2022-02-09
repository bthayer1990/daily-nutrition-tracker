import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireAnalyticsModule, ScreenTrackingService,UserTrackingService } from '@angular/fire/compat/analytics';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GoalConfigurationComponent } from './goal-configuration/goal-configuration.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirePerformanceModule, PerformanceMonitoringService } from '@angular/fire/compat/performance';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GoalConfigurationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAnalyticsModule,
    AngularFirePerformanceModule,
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    PerformanceMonitoringService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
