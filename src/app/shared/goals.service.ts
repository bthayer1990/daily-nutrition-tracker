import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryFn } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable, switchMap, take } from 'rxjs';
import { Goal, AmountSetting, NutritionType } from './goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private readonly GOALS_COLLECTION_NAME: string = "goals";
  private readonly DAILY_RECORDS_COLLECTION_NAME: string = "dailyRecords";

  constructor(private store: AngularFirestore) { }

  getUserGoals(user: firebase.User): Observable<Goal[]> {
    const queryFn: QueryFn<DocumentData> = ref => ref.where('userEmail', '==', user.email);

    return this.store.collection<Goal>(this.GOALS_COLLECTION_NAME, queryFn).valueChanges().pipe(
      take(1),
      switchMap(async (goals: Goal[]) => {
        if (goals && goals.length) {
          return goals;
        } else {
          return await this.makeDefaultGoals(user);
        }
      })
    );
  }

  async makeDefaultGoals(user: firebase.User): Promise<Goal[]> {
    const calorieGoal = new Goal(this.store.createId(), user.email!, NutritionType.Calories, AmountSetting.MaxAllowed)
    const proteinGoal = new Goal(this.store.createId(), user.email!, NutritionType.Protein, AmountSetting.MinNeeded)

    await this.store.collection<Goal>(this.GOALS_COLLECTION_NAME).doc(calorieGoal.id).set(JSON.parse(JSON.stringify(calorieGoal)));
    await this.store.collection<Goal>(this.GOALS_COLLECTION_NAME).doc(proteinGoal.id).set(JSON.parse(JSON.stringify(proteinGoal)));

    return [calorieGoal, proteinGoal];
  }

  updateGoalTarget(goal: Goal): Promise<void> {
    return this.store.collection(this.GOALS_COLLECTION_NAME).doc(goal.id).set({ targetAmount: goal.targetAmount}, { merge: true });
  }
}
