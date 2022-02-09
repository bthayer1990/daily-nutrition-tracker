import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { take } from 'rxjs';
import { Goal } from '../shared/goal.model';
import { GoalsService } from '../shared/goals.service';

@Component({
  selector: 'app-goal-configuration',
  templateUrl: './goal-configuration.component.html',
  styleUrls: ['./goal-configuration.component.scss']
})
export class GoalConfigurationComponent implements OnInit {
  user: firebase.User | null = null;
  userGoals: Goal[] = [];

  constructor(public auth: AngularFireAuth, private goalsSvc: GoalsService) { }

  async ngOnInit(): Promise<void> {
    this.auth.user.pipe(
      take(1)
    ).subscribe(async (authUser: firebase.User | null) => {
      this.user = authUser;

      if (!this.user) {
        const userCred = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        this.user = userCred.user;
      }

      this.setUserGoals();
    });
  }

  async setUserGoals(): Promise<void> {
    this.goalsSvc.getUserGoals(this.user!).subscribe((goals: Goal[]) => {
      this.userGoals = goals.sort();
    });
  }

}
