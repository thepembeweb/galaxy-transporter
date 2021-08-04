import { Component, OnInit } from '@angular/core';
import { PlanetService } from '../../services';
import { Planet } from '../../models';

@Component({
  selector: 'app-planet-list',
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss']
})
export class PlanetListComponent implements OnInit {
  planets: Planet[];
  planetImage: any = '../../../assets/images/galaxy.jpg';
  title = 'Planets';

  constructor(public planetService: PlanetService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.planetService.getAll().subscribe(planets => {
      this.planets = planets;
    });
  }
}
