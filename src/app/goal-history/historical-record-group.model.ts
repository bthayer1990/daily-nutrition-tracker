import { HistoricalRecord } from "../shared/goal.model";

export class HistoricalRecordGroup {
  date: Date = new Date();
  displayDate: string = "";
  recordsForDay: HistoricalRecord[] = [];

  constructor(date: Date, displayDate: string, record: HistoricalRecord) {
    this.date = date;
    this.displayDate = displayDate;
    this.recordsForDay = [record];
  }

  getResultsSummary(): string {
    let summary: string = "";

    for (const record of this.recordsForDay) {
      summary += `Nutrition Type: ${record.goal.nutritionType} Target: ${record.goal.targetAmount} Actual: ${record.goal.dailyRecord.currentAmount} Met: ${record.goalMet ? 'Yes': 'No'}<br>`;
    }

    return summary;
  }
}
