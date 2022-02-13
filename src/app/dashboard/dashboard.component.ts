import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { take } from 'rxjs';
import { DateService } from './date.service';
import { Goal, AmountSetting, DailyRecord } from '../shared/goal.model';
import { GoalsService } from '../shared/goals.service';
import { UpdateStatus } from '../shared/update-status.enum';
import { Operation } from './operation.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: firebase.User | null = null;
  userGoals: Goal[] = [];
  updateStatus: UpdateStatus = UpdateStatus.NONE;
  UpdateStatus = UpdateStatus;
  AmountSetting = AmountSetting;
  Operation = Operation;
  goalsConfigured: boolean = false;

  constructor(public auth: AngularFireAuth, private goalsSvc: GoalsService, private dateSvc: DateService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.auth.user.pipe(
      take(1)
    ).subscribe(async (authUser: firebase.User | null) => {
      this.user = authUser;
      this.setUserGoals();
    });
  }

  async setUserGoals(): Promise<void> {
    this.goalsSvc.getUserGoals(this.user!).subscribe(async (goals: Goal[]) => {
      await this.setDailyRecordForGoals(goals);
      this.userGoals = goals.sort((a, b) => (a.nutritionType > b.nutritionType) ? 1 : -1);
      this.goalsConfigured = goals.every(goal => goal.targetAmount > 0);
    });
  }

  async setDailyRecordForGoals(goals: Goal[]): Promise<void> {
    for (const goal of goals) {
      const dailyRecordIsForToday = goal.dailyRecord.date === this.dateSvc.getFormattedCurrentDate();
      if (!dailyRecordIsForToday) {
        await this.goalsSvc.addHistoricalRecordForPreviousDay(goal);
        goal.dailyRecord = new DailyRecord(this.dateSvc.getFormattedCurrentDate());
      }
    }
  }

  async modifyCurrentAmount(goal: Goal, newAmountField: any, operation: Operation) {
    try {
      if (newAmountField.value) {
        this.updateStatus = UpdateStatus.LOADING;

        if (operation === Operation.Add) {
          goal.dailyRecord.currentAmount += parseInt(newAmountField.value);
        } else {
          goal.dailyRecord.currentAmount = parseInt(newAmountField.value);
        }

        await this.goalsSvc.updateGoalDailyRecord(goal);

        this.updateStatus = UpdateStatus.SUCCESS;
        newAmountField.value = "";
      }
    } catch(error) {
      console.error(error);
      this.updateStatus = UpdateStatus.ERROR;
    }
  }

  neededAmountReached(goal: Goal): boolean {
    return (goal.amountSetting === AmountSetting.MinNeeded) && (goal.dailyRecord.currentAmount >= goal.targetAmount);
  }

  allowedAmountExceeded(goal: Goal): boolean {
    return (goal.amountSetting === AmountSetting.MaxAllowed) && (goal.dailyRecord.currentAmount >= goal.targetAmount);
  }
}
