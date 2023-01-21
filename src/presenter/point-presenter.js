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
  #tripPoint = null;
  #contentPoint = [];

  #filtersComponent = new FiltersFormView();
  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripListView();

  constructor (filtersContainer, mainContainer, tripPointModel) {
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;
    this.#tripPoint = tripPointModel;
  }

  #renderPoint = (tripPoint) => {
    const tripPointComponent = new TripEventItemView(tripPoint);
    const tripFormAddComponent = new TripFormAddView (tripPoint);

    const replacePointToForm = () => {
      this.#tripListComponent.element.replaceChild(tripFormAddComponent.element, tripPointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#tripListComponent.element.replaceChild(tripPointComponent.element, tripFormAddComponent.element, );
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', ()=> {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    tripFormAddComponent.element.querySelector('form').addEventListener('submit', (evt) =>{
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    tripFormAddComponent.element.querySelector('form').addEventListener('click', () =>{
      replaceFormToPoint();
    });

    render (tripPointComponent, this.#tripListComponent.element);
  };

  #renderContent = () =>{
    if (this.#contentPoint.length === 0) {
      render (new NoPointsView(), this.#mainContainer);
      return;
    }

    render(this.#filtersComponent, this.#filtersContainer);
    render(this.#sortFormComponent, this.#mainContainer);
    render(this.#tripListComponent, this.#mainContainer);

    this.#contentPoint.forEach((_, index) => {
      this.#renderPoint(this.#contentPoint[index]);
    });
  };

  init = () => {
    this.#contentPoint = [...this.#tripPoint.points];
    this.#renderContent();
  };

}
