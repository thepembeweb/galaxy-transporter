import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  planetsImage: any = '../../../assets/images/planet.png';
  planetsLabel = 'Planets';
  routesImage: any = '../../../assets/images/map.png';
  routesLabel = 'Routes';
  trafficImage: any = '../../../assets/images/grid.png';
  trafficLabel = 'Traffic';
  title = 'My Dashboard';

  constructor() {}

  ngOnInit() {}
}
