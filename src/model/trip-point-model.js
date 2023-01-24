export default class TripPointModel {
  #points = [];

  get points () {
    return this.#points;
  }

  init(points){
    this.#points = points;
  }
}
