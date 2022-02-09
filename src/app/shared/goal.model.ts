export enum NutritionType {
  Calories,
  Protein
}

export class Goal {
  id: string = "";
  userEmail: string = "";
  nutritionType: NutritionType = NutritionType.Calories;
  minValue: number = 0;
  maxValue: number = 0;
}

export class DailyEntry {
  id: string = "";
  date: Date = new Date();
  currentValue: number = 0;
}
