export enum NutritionType {
  Calories = "Calories",
  Protein = "Protein"
}

export class Goal {
  userEmail: string = "";
  nutritionType: NutritionType = NutritionType.Calories;
  minValue: number = 0;
  maxValue: number = 0;

  constructor(userEmail: string, nutritionType: NutritionType) {
    this.userEmail = userEmail;
    this.nutritionType = nutritionType;
  }
}

export class DailyEntry {
  date: Date = new Date();
  currentValue: number = 0;
}
