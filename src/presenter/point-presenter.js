import { render } from '../render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripListView from '../view/trip-list-view.js';
import TripFormAddView from '../view/trip-form-add-view.js';
import FiltersFormView from '../view/filters-form-view.js';


export default class PointPresenter {
  #filtersContainer = null;
  #mainContainer = null;
  #tripPoint = null;
  #contentPoint = [];

  #filtersComponent = new FiltersFormView();
  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripListView();

  init = (filtersContainer, mainContainer, tripPointModel) => {
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;
    this.#tripPoint = tripPointModel;
    this.#contentPoint = [...this.#tripPoint.points];

    render(this.#filtersComponent, this.#filtersContainer);
    render(this.#sortFormComponent, this.#mainContainer);
    render(this.#tripListComponent, this.#mainContainer);
    render(new TripFormAddView(this.#contentPoint[0]), this.#tripListComponent.element);

    this.#contentPoint.forEach((_, index) => {
      this.#renderPoint(this.#contentPoint[index]);
    });
  };


  #renderPoint = (tripPoint) => {
    const tripPointComponent = new TripEventItemView(tripPoint);
    render (tripPointComponent, this.#tripListComponent.element);
  };
}
