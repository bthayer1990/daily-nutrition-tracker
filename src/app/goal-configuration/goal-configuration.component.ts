import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { take } from 'rxjs';
import { Goal, AmountSetting } from '../shared/goal.model';
import { GoalsService } from '../shared/goals.service';
import { UpdateStatus } from '../shared/update-status.enum';

@Component({
  selector: 'app-goal-configuration',
  templateUrl: './goal-configuration.component.html',
  styleUrls: ['./goal-configuration.component.scss']
})
export class GoalConfigurationComponent implements OnInit {
  user: firebase.User | null = null;
  userGoals: Goal[] = [];
  updateStatus: UpdateStatus = UpdateStatus.NONE;
  UpdateStatus = UpdateStatus;
  AmountSetting = AmountSetting;

  constructor(public auth: AngularFireAuth, private goalsSvc: GoalsService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.auth.user.pipe(
      take(1)
    ).subscribe(async (authUser: firebase.User | null) => {
      if (!authUser) {
        this.router.navigateByUrl(`/login`);
      }

      this.user = authUser;
      this.setUserGoals();
    });
  }

  async setUserGoals(): Promise<void> {
    this.goalsSvc.getUserGoals(this.user!).subscribe((goals: Goal[]) => {
      this.userGoals = goals.sort((a, b) => (a.nutritionType > b.nutritionType) ? 1 : -1);
    });
  }

  async updateGoals(): Promise<void> {
    try {
      this.updateStatus = UpdateStatus.LOADING;

      for (const goal of this.userGoals) {
        await this.goalsSvc.updateGoalTarget(goal);
      }

      this.updateStatus = UpdateStatus.SUCCESS;
    } catch (error) {
      console.error(error);
      this.updateStatus = UpdateStatus.ERROR;
    }
  }
}
