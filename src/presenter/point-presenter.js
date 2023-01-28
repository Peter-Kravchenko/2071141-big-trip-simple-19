import { render, replace } from '../framework/render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripListView from '../view/trip-list-view.js';
import TripFormAddView from '../view/trip-form-add-view.js';
import FiltersFormView from '../view/filters-form-view.js';
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

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const tripPointComponent = new TripEventItemView(
      {tripPoint,
        onEditClick: () => {
          replacePointToForm.call(this);
          document.addEventListener('keydown', escKeyDownHandler);
        }});

    const tripFormAddComponent = new TripFormAddView (
      {tripPoint,
        onFormSubmit: () => {
          replaceFormToPoint.call(this);
          document.removeEventListener('keydown', escKeyDownHandler);
        },
        onFormClose: () => {
          replaceFormToPoint.call(this);
          document.removeEventListener('keydown', escKeyDownHandler);
        },});

    function replacePointToForm () {
      replace(tripFormAddComponent, tripPointComponent);
    }

    function replaceFormToPoint () {
      replace(tripPointComponent, tripFormAddComponent);
    }

    render (tripPointComponent, this.#tripListComponent.element);
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
