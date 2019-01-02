import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Planet } from '../models';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlanetService {
  private itemsCollection: AngularFirestoreCollection<Planet>;
  private collectionName: string = 'planets';

  constructor(public db: AngularFirestore) {
    this.itemsCollection = this.db.collection(this.collectionName, ref =>
      ref.orderBy('planetName', 'asc')
    );
  }

  public create(planet: Planet) {
    return this.db.collection(this.collectionName).add({
      planetNode: planet.planetNode,
      planetName: planet.planetName
    });
  }

  public delete(planetKey) {
    return this.db
      .collection(this.collectionName)
      .doc(planetKey)
      .delete();
  }

  public get(planetKey) {
    return this.db
      .collection(this.collectionName)
      .doc(planetKey)
      .snapshotChanges();
  }

  public getAll(): Observable<Planet[]> {
    return this.itemsCollection.snapshotChanges().pipe(
      map(changes =>
        changes.map(a => {
          const data = a.payload.doc.data() as Planet;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    );
  }

  public update(planetKey, value) {
    value.nameToSearch = value.name.toLowerCase();
    return this.db
      .collection(this.collectionName)
      .doc(planetKey)
      .set(value);
  }
}
