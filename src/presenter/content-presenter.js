import { render } from '../framework/render.js';
import FiltersFormView from '../view/filters-form-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import SortFormView from '../view/sort-form-view.js';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view.js';


export default class PointPresenter {
  #filtersContainer = null;
  #mainContainer = null;
  #tripPointModel = null;
  #contentPoints = [];
  #noPointComponent = new NoPointsView();
  #filtersComponent = new FiltersFormView();
  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripListView();

  constructor ({filtersContainer, mainContainer, tripPointModel}) {
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;
    this.#tripPointModel = tripPointModel;
  }

  init = () => {
    this.#contentPoints = [...this.#tripPointModel.points];
    this.#renderContent();
  };

  #renderPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter({
      pointsListContainer: this.#tripListComponent.element,
    });
    tripPointPresenter.init(tripPoint);
  };

  #renderFilter = () => {
    render(this.#filtersComponent, this.#filtersContainer);
  };

  #renderSort = () => {
    render(this.#sortFormComponent, this.#mainContainer);
  };

  #renderPoints = () => {
    this.#contentPoints.forEach(this.#renderPoint);
  };

  #renderPointsList = () => {
    render(this.#tripListComponent, this.#mainContainer);
    this.#renderPoints();
  };

  #renderNoPoints = () => {
    render (this.#noPointComponent, this.#mainContainer);
  };

  #renderContent = () => {
    if (this.#contentPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderFilter();
    this.#renderSort();
    this.#renderPointsList();

  };

}
