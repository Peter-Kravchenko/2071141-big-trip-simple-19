import {render} from '../framework/render.js';
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
  #contentPoint = [];

  #filtersComponent = new FiltersFormView();
  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripListView();

  constructor ({filtersContainer, mainContainer, tripPointModel}) {
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;
    this.#tripPointModel = tripPointModel;
  }

  #renderPoint = (point) => {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint().call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const tripPointComponent = new TripEventItemView({
      point,
      onEditClick: () => {
        replacePointToForm().call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const tripFormAddComponent = new TripFormAddView ({
      point,
      onFormSubmit: () => {
        replaceFormToPoint().call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormClose: () => {
        replaceFormToPoint().call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    function replacePointToForm () {
      this.#tripListComponent.element.replaceChild(tripFormAddComponent.element, tripPointComponent.element);
    }

    function replaceFormToPoint () {
      this.#tripListComponent.element.replaceChild(tripPointComponent.element, tripFormAddComponent.element, );
    }

    render (tripPointComponent, this.#tripListComponent.element);
  };

  #renderContent = () => {
    if (this.#contentPoint.length === 0) {
      render (new NoPointsView(), this.#mainContainer);
      return;
    }

    render(this.#filtersComponent, this.#filtersContainer);
    render(this.#sortFormComponent, this.#mainContainer);
    render(this.#tripListComponent, this.#mainContainer);

    this.#contentPoint.forEach ((point) => this.#renderPoint(point));

  };

  init = () => {
    this.#contentPoint = [...this.#tripPointModel.points];
    this.#renderContent();
  };

}
