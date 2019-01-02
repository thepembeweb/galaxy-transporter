import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { Traffic } from '../models';

@Injectable({ providedIn: 'root' })
export class TrafficService {
  private itemsCollection: AngularFirestoreCollection<Traffic>;
  private collectionName: string = 'traffic';

  constructor(public db: AngularFirestore) {
    this.itemsCollection = this.db.collection(this.collectionName, ref =>
      ref.orderBy('planetOrigin', 'asc')
    );
  }

  public create(traffic: Traffic) {
    return this.db.collection(this.collectionName).add({
      routeId: traffic.routeId,
      planetOrigin: traffic.planetOrigin,
      planetDestination: traffic.planetDestination,
      trafficDelay: traffic.trafficDelay
    });
  }

  public delete(trafficKey) {
    return this.db
      .collection(this.collectionName)
      .doc(trafficKey)
      .delete();
  }

  public get(trafficKey) {
    return this.db
      .collection(this.collectionName)
      .doc(trafficKey)
      .snapshotChanges();
  }

  public getAll(): Observable<Traffic[]> {
    return this.itemsCollection.snapshotChanges().pipe(
      map(changes =>
        changes.map(a => {
          const data = a.payload.doc.data() as Traffic;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    );
  }

  public update(trafficKey, value) {
    value.nameToSearch = value.name.toLowerCase();
    return this.db
      .collection(this.collectionName)
      .doc(trafficKey)
      .set(value);
  }
}
