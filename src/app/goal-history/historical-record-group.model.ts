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

    summary += "<ul class=\"mt-0\">";

    for (const record of this.recordsForDay) {
      const textClass = record.goalMet ? 'has-text-success' : '';
      summary += `<li class=\"${textClass}\"><strong class=\"${textClass}\">${record.goal.nutritionType}: ${record.goal.dailyRecord.currentAmount}</strong></li>`;
    }

    summary += "</ul>";

    return summary;
  }
}
