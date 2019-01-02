import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services';
import { Route } from '../../models';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss']
})
export class RouteListComponent implements OnInit {
  routes: Route[];
  routeImage: any = '../../../assets/images/galaxy.jpg';
  title = 'Routes';

  constructor(public routeService: RouteService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.routeService.getAll().subscribe(routes => {
      this.routes = routes;
    });
  }
}
