import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Planet, Route, Traffic } from '../../models';
import {
  FileService,
  PlanetService,
  RouteService,
  TrafficService
} from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isDatabasePopulated = false;
  settingsImage: any = '../../../assets/images/settings.png';
  title = 'Galaxy Transporter';
  populateDatabaseLabel = 'Populate Database';
  launchTranporter = 'Launch Tranporter';
  showLoading = true;

  routes: Route[] = [];
  planets: Planet[] = [];
  traffic: Traffic[] = [];

  constructor(
    private fileService: FileService,
    private planetService: PlanetService,
    private routeService: RouteService,
    private trafficService: TrafficService
  ) {
    this.routes = [];
    this.planets = [];
    this.traffic = [];
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    forkJoin([
      this.getPlanetData().pipe(take(1)),
      this.getRouteData().pipe(take(1)),
      this.getTrafficData().pipe(take(1))
    ]).subscribe(result => {
      this.planets = result[0];
      this.routes = result[1];
      this.traffic = result[2];
      this.showLoading = false;
      this.updateDatabasePopulatedStatus();
    });
  }

  getPlanetData() {
    return this.planetService.getAll();
  }

  getRouteData() {
    return this.routeService.getAll();
  }

  getTrafficData() {
    return this.trafficService.getAll();
  }

  populateDatabase() {
    this.showLoading = true;

    const planetsPromise = this.fileService.getPlanetData();
    const routesPromise = this.fileService.getRouteData();
    const trafficPromise = this.fileService.getTrafficData();

    Promise.all([planetsPromise, routesPromise, trafficPromise])
      .then(result => {
        const planetResult = result[0];
        const routeResult = result[1];
        const trafficResult = result[2];

        this.populatePlanets(planetResult);
        this.populateRoutes(routeResult);
        this.populateTraffic(trafficResult);
      })
      .then(() => this.getData());
  }

  updateDatabasePopulatedStatus() {
    this.isDatabasePopulated =
      this.planets &&
      this.planets.length > 0 &&
      this.routes &&
      this.routes.length > 0 &&
      this.traffic &&
      this.traffic.length > 0;
  }

  populatePlanets(data) {
    Object.keys(data).forEach(key => {
      const planetData = Planet.createFromJSON(JSON.stringify(data[key]));
      this.planetService.create(planetData);
    });
  }

  populateRoutes(data) {
    Object.keys(data).forEach(key => {
      const routeData = Route.createFromJSON(JSON.stringify(data[key]));
      this.routeService.create(routeData);
    });
  }

  populateTraffic(data) {
    Object.keys(data).forEach(key => {
      const trafficData = Traffic.createFromJSON(JSON.stringify(data[key]));
      this.trafficService.create(trafficData);
    });
  }
}
