import { Component, OnInit } from '@angular/core';
import { TrafficService } from '../../services';
import { Traffic } from '../../models';

@Component({
  selector: 'app-traffic-list',
  templateUrl: './traffic-list.component.html',
  styleUrls: ['./traffic-list.component.scss']
})
export class TrafficListComponent implements OnInit {
  traffic: Traffic[];
  trafficImage: any = '../../../assets/images/galaxy.jpg';
  title = 'Traffic';

  constructor(public trafficService: TrafficService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.trafficService.getAll().subscribe(traffic => {
      this.traffic = traffic;
    });
  }
}
