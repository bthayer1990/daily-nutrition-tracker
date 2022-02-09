export enum NutritionType {
  Calories,
  Protein
}

export class Goal {
  userEmail: string = "";
  nutritionType: NutritionType = NutritionType.Calories;
  minValue: number = 0;
  maxValue: number = 0;
}

export class DailyEntry {
  date: Date = new Date();
  currentValue: number = 0;
}
