import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { take } from 'rxjs';
import { DateService } from '../shared/date.service';
import { Goal, AmountSetting, DailyRecord } from '../shared/goal.model';
import { GoalsService } from '../shared/goals.service';
import { UpdateStatus } from '../shared/update-status.enum';

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

  constructor(public auth: AngularFireAuth, private goalsSvc: GoalsService, private dateSvc: DateService) { }

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
      this.userGoals = goals.sort((a, b) => (a.nutritionType > b.nutritionType) ? 1 : -1);
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

  async addToCurrentAmount(goal: Goal, newAmountField: any) {
    try {
      this.updateStatus = UpdateStatus.LOADING;

      const record = this.getRecordForToday(goal);
      record.currentAmount += parseInt(newAmountField.value);
      await this.goalsSvc.updateGoalDailyRecords(goal);

      this.updateStatus = UpdateStatus.SUCCESS;
      newAmountField.value = "";
    } catch(error) {
      console.error(error);
      this.updateStatus = UpdateStatus.ERROR;
    }
  }

  async updateCurrentAmount(goal: Goal, newAmountField: any) {
    try {
      this.updateStatus = UpdateStatus.LOADING;

      const record = this.getRecordForToday(goal);
      record.currentAmount = parseInt(newAmountField.value);
      await this.goalsSvc.updateGoalDailyRecords(goal);

      this.updateStatus = UpdateStatus.SUCCESS;
      newAmountField.value = "";
    } catch(error) {
      console.error(error);
      this.updateStatus = UpdateStatus.ERROR;
    }
  }
}
