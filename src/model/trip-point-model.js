import { UpdateType } from '../const';
import Observable from '../framework/observable';


export default class TripPointModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points () {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      // console.log(this.#points);
    } catch (err) {
      this.#points = [];
      throw new Error('Error loading data from server');
    }
    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch(err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }


  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    try {
      await this.#pointsApiService.deletePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'] ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
    };
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  };

}
