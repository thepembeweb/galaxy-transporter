import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlanetListComponent } from './components/planet-list/planet-list.component';
import { RouteListComponent } from './components/route-list/route-list.component';
import { TrafficListComponent } from './components/traffic-list/traffic-list.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'planets', component: PlanetListComponent },
  { path: 'routes', component: RouteListComponent },
  { path: 'traffic', component: TrafficListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
