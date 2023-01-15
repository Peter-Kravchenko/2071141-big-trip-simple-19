import { TRIP_POINT_COUNT, generateTripPoint } from '../mock/point.js';

export default class TripsModel {
  #tripPoint = Array.from({length: TRIP_POINT_COUNT }, generateTripPoint);

  get points () {
    return this.#tripPoint;
  }
}
