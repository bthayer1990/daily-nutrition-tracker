import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryFn } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable, switchMap, take } from 'rxjs';
import { Goal, GoalType, NutritionType } from './goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private readonly GOALS_COLLECTION_NAME: string = "goals";
  private readonly DAILY_ENTRIES_COLLECTION_NAME: string = "dailyEntries";

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
    const calorieDocRef = await this.store.collection<Goal>(this.GOALS_COLLECTION_NAME).add(JSON.parse(JSON.stringify(new Goal(user.email!, NutritionType.Calories, GoalType.MaxAllowed))));
    const proteinDocRef = await this.store.collection<Goal>(this.GOALS_COLLECTION_NAME).add(JSON.parse(JSON.stringify(new Goal(user.email!, NutritionType.Protein, GoalType.MinRequired))));
    const calorieDoc = await calorieDocRef.get();
    const proteinDoc = await proteinDocRef.get();

    return [calorieDoc.data()!, proteinDoc.data()!];
  }
}
