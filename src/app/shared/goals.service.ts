import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryFn } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { map, Observable, take } from 'rxjs';
import { Goal } from './goal.model';

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

    );
  }
}
