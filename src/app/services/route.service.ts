import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { Route } from '../models';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private itemsCollection: AngularFirestoreCollection<Route>;
  private collectionName = 'routes';

  constructor(public db: AngularFirestore) {
    this.itemsCollection = this.db.collection(this.collectionName, ref =>
      ref.orderBy('planetOrigin', 'asc')
    );
  }

  public create(route: Route) {
    return this.db.collection(this.collectionName).add({
      routeId: route.routeId,
      planetOrigin: route.planetOrigin,
      planetDestination: route.planetDestination,
      distance: route.distance
    });
  }

  public delete(routeKey) {
    return this.db
      .collection(this.collectionName)
      .doc(routeKey)
      .delete();
  }

  public get(routeKey) {
    return this.db
      .collection(this.collectionName)
      .doc(routeKey)
      .snapshotChanges();
  }

  public getAll(): Observable<Route[]> {
    return this.itemsCollection.snapshotChanges().pipe(
      map(changes =>
        changes.map(a => {
          const data = a.payload.doc.data() as Route;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    );
  }

  public update(routeKey, value) {
    value.nameToSearch = value.name.toLowerCase();
    return this.db
      .collection(this.collectionName)
      .doc(routeKey)
      .set(value);
  }
}
