import { TRIP_POINT_ITEMS } from '../const.js';
import { generatePoint } from '../mock/point.js';

export default class TripsModel {
  tripPoint = Array.from({length: TRIP_POINT_ITEMS }, generatePoint);

  getPoints = () => this.tripPoint;
}
