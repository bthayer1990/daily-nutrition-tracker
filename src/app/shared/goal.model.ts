export enum NutritionType {
  Calories = "Calories",
  Protein = "Protein"
}

export enum GoalType {
  MaxAllowed,
  MinRequired
}

export class Goal {
  userEmail: string = "";
  nutritionType: NutritionType = NutritionType.Calories;
  type: GoalType = GoalType.MaxAllowed;
  value: number = 0;

  constructor(userEmail: string, nutritionType: NutritionType, type: GoalType) {
    this.userEmail = userEmail;
    this.nutritionType = nutritionType;
    this.type = type;
  }
}

export class DailyEntry {
  date: string = "";
  currentValue: number = 0;
}
