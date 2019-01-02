import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Planet, Route } from '../../models';

import {
  MapService
} from '../../services';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {
  @Input() routes: Route[];
  @Input() planets: Planet[];
  @ViewChild('fromPlanetDropdown') fromPlanetDropdown: ElementRef;
  @ViewChild('toPlanetDropdown') toPlanetDropdown: ElementRef;

  path: string = '';

  constructor(
    private mapService: MapService
  ) {
  }

  ngOnInit() {
    this.mapService.initialize(this.planets, this.routes);
    this.mapService.loadGraph(false, this.fromPlanetDropdown.nativeElement.value, this.toPlanetDropdown.nativeElement.value);
  }

  onPlanetChanged() {
    this.mapService.loadGraph(true, this.fromPlanetDropdown.nativeElement.value, this.toPlanetDropdown.nativeElement.value);
  }

}
