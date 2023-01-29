import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import FiltersFormView from '../view/filters-form-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import SortFormView from '../view/sort-form-view.js';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view.js';


export default class ContentPresenter {
  #filtersContainer = null;
  #mainContainer = null;
  #tripPointModel = null;
  #contentPoints = [];
  #noPointComponent = new NoPointsView();
  #filtersComponent = new FiltersFormView();
  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripListView();

  #tripPointPresenters = new Map();

  constructor ({filtersContainer, mainContainer, tripPointModel}) {
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;
    this.#tripPointModel = tripPointModel;
  }

  init = () => {
    this.#contentPoints = [...this.#tripPointModel.points];
    this.#renderContent();
  };

  #renderFilter = () => {
    render(this.#filtersComponent, this.#filtersContainer);
  };

  #renderSort = () => {
    render(this.#sortFormComponent, this.#mainContainer);
  };

  #renderPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter({
      pointsListContainer: this.#tripListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });
    tripPointPresenter.init(tripPoint);
    this.#tripPointPresenters.set(tripPoint.id, tripPointPresenter);
  };

  #renderPoints = () => {
    this.#contentPoints.forEach(this.#renderPoint);
  };

  #renderPointsList = () => {
    render(this.#tripListComponent, this.#mainContainer);
    this.#renderPoints();
  };

  #clearPointsList = () => {
    this.#tripPointPresenters.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenters.clear();
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

  #handlePointChange = (updatedPoint) => {
    this.#contentPoints = updateItem(this.#contentPoints, updatedPoint);
    this.#tripPointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#tripPointPresenters.forEach((presenter) =>
      presenter.resetView()
    );
  };

}
