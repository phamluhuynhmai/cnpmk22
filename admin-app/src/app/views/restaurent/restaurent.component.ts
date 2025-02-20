import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/interfaces/Restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { FoodmenuService } from 'src/app/services/foodmenu.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restaurent',
  templateUrl: './restaurent.component.html',
  styleUrls: ['./restaurent.component.scss']
})
export class RestaurentComponent implements OnInit {

  titre = "Thể loại thực đơn"
  displayedColumns: string[] = ['Id', 'Image', 'Name', 'Speciality', 'Action'];
  dataSource:Restaurant[] = [];


  constructor(
    private restaurantService: RestaurantService,
    private foodMenuService: FoodmenuService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getListRestaurent()
  }

  getListRestaurent() {
    this.restaurantService.getListRestaurent().subscribe((data) => {
      this.dataSource = data.restaurants
    })
  }

  getListMenus(id:string){
    this.router.navigate([`/admin/menus/${id}`])
  }

  updateRestaurent(id:string) {
    this.router.navigate([`/admin/restaurantform/edit/${id}`])
  }

  deleteRestaurent(id:string) {
    this.foodMenuService.getListMenu(id).subscribe((data) => {
      if (data.menus.length > 0) {
        this._snackBar.open('Xóa không thành công: Thể loại có menu', 'Done');
        return;
      }
    })
    this.restaurantService.deleteRestaurent(id).subscribe((data) => {
      if(data.success) {
        this.getListRestaurent();
        this._snackBar.open(data.message, 'Done');
      }else {
        this._snackBar.open(data.message, 'Done');
      }
    })
  }

}
