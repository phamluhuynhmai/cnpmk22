import { Component, OnInit } from '@angular/core';
import { DashService } from './../../services/dash.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  clients = 0
  empolyes = 0
  menus = 0
  orders = 0

  constructor(private dashService: DashService,) { }

  titre="Bảng điều khiển"
  ngOnInit(): void {
    this.dashService.dash().subscribe((data) => {
      this.clients = data.clients;
      this.empolyes = data.empolyes;
      this.menus = data.menus;
      this.orders = data.orders;
    })
  }

}
