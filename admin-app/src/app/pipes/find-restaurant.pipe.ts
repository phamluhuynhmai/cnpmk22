import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findRestaurant'
})
export class FindRestaurantPipe implements PipeTransform {
  transform(restaurants: any[], restaurantId: string): string {
    if (!restaurants || !restaurantId) {
      return 'Chưa có thông tin';
    }
    
    const restaurant = restaurants.find(r => r._id === restaurantId);
    return restaurant ? restaurant.name : 'Chưa có thông tin';
  }
} 