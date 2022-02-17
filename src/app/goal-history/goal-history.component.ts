import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { take } from 'rxjs';
import { HistoricalRecord } from '../shared/goal.model';
import { GoalsService } from '../shared/goals.service';
import { HistoricalRecordGroup } from './historical-record-group.model';

@Component({
  selector: 'app-goal-history',
  templateUrl: './goal-history.component.html',
  styleUrls: ['./goal-history.component.scss']
})
export class GoalHistoryComponent implements OnInit {
  user: firebase.User | null = null;
  historicalRecordGroups: HistoricalRecordGroup[] = [];
  setupComplete: boolean = false;

  constructor(public auth: AngularFireAuth, private goalsSvc: GoalsService) { }

  async ngOnInit(): Promise<void> {
    this.auth.user.pipe(
      take(1)
    ).subscribe(async (authUser: firebase.User | null) => {
      this.user = authUser;
      this.setHistoricalRecordGroups();
    });
  }

  async setHistoricalRecordGroups(): Promise<void> {
    this.goalsSvc.getUserHistoricalRecords(this.user!).subscribe((records: HistoricalRecord[]) => {
      if (records && records.length > 0) {
        this.groupRecords(records);
        this.sortGroups();
        this.historicalRecordGroups = this.historicalRecordGroups.slice(0, 30);
      }
      this.setupComplete = true;
    });
  }

  groupRecords(records: HistoricalRecord[]): void {
    records.forEach((record: HistoricalRecord) => {
      const existingGroup = this.historicalRecordGroups.find((group: HistoricalRecordGroup) => group.displayDate === record.goal.dailyRecord.date);
      if (existingGroup) {
        existingGroup.recordsForDay.push(record);
      } else {
        const dailyRecord = record.goal.dailyRecord;
        const recordGroup = new HistoricalRecordGroup(new Date(dailyRecord.date), dailyRecord.date, record);
        this.historicalRecordGroups.push(recordGroup);
      }
    });
  }

  sortGroups(): void {
    this.historicalRecordGroups.sort((a, b) => (a.date < b.date) ? 1 : -1);
    this.historicalRecordGroups.forEach((group: HistoricalRecordGroup) => {
      group.recordsForDay.sort((a, b) => (a.goal.nutritionType > b.goal.nutritionType) ? 1 : -1);
    });
  }
}
