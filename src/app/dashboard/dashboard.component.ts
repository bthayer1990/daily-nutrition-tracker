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
      this.goalsConfigured = goals.every(goal => goal.targetAmount > 0);
    });
  }

  getRecordForToday(goal: Goal): DailyRecord {
    let recordForToday = goal.dailyRecords.find(record => record.date === this.dateSvc.getFormattedCurrentDate());
    if (!recordForToday) {
      recordForToday = new DailyRecord(this.dateSvc.getFormattedCurrentDate());
      goal.dailyRecords.push(recordForToday);
    }
    return recordForToday;
  }

  async modifyCurrentAmount(goal: Goal, newAmountField: any, operation: Operation) {
    try {
      if (newAmountField.value) {
        this.updateStatus = UpdateStatus.LOADING;

        const record = this.getRecordForToday(goal);

        if (operation === Operation.Add) {
          record.currentAmount += parseInt(newAmountField.value);
        } else {
          record.currentAmount = parseInt(newAmountField.value);
        }

        await this.goalsSvc.updateGoalDailyRecords(goal);

        this.updateStatus = UpdateStatus.SUCCESS;
        newAmountField.value = "";
      }
    } catch(error) {
      console.error(error);
      this.updateStatus = UpdateStatus.ERROR;
    }
  }

  neededAmountReached(goal: Goal): boolean {
    return (goal.amountSetting === AmountSetting.MinNeeded) && (this.getRecordForToday(goal).currentAmount >= goal.targetAmount);
  }

  allowedAmountExceeded(goal: Goal): boolean {
    return (goal.amountSetting === AmountSetting.MaxAllowed) && (this.getRecordForToday(goal).currentAmount >= goal.targetAmount);
  }
}
