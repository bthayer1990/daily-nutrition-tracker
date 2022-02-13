export enum NutritionType {
  Calories = "Calories",
  Protein = "Protein"
}

export enum AmountSetting {
  MaxAllowed = "Max Allowed",
  MinNeeded = "Min Needed"
}

export class Goal {
  id: string = "";
  userEmail: string = "";
  nutritionType: NutritionType = NutritionType.Calories;
  amountSetting: AmountSetting = AmountSetting.MaxAllowed;
  targetAmount: number = 0;
  dailyRecord: DailyRecord = new DailyRecord("");

  constructor(id: string, userEmail: string, nutritionType: NutritionType, amountSetting: AmountSetting) {
    this.id = id,
    this.userEmail = userEmail;
    this.nutritionType = nutritionType;
    this.amountSetting = amountSetting;
  }
}

export class DailyRecord {
  date: string = "";
  currentAmount: number = 0;

  constructor(date: string) {
    this.date = date;
  }
}

export class HistoricalRecord {
  id: string = "";
  goal: Goal = new Goal("", "", NutritionType.Calories, AmountSetting.MaxAllowed);

  constructor(id: string, goal: Goal) {
    this.id = id;
    this.goal = goal;
  }
}
