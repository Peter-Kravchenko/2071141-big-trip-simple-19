import { render, replace, remove } from '../framework/render.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripPointEditView from '../view/trip-point-edit-view.js';

export default class TripPointPresenter {
  #pointsListContainer = null;

  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #tripPoint = null;

  constructor({pointsListContainer}) {
    this.#pointsListContainer = pointsListContainer;
  }

  init(tripPoint) {
    this.#tripPoint = tripPoint;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;

    this.#tripPointComponent = new TripEventItemView(
      {tripPoint: this.#tripPoint,
        onEditClick: this.#handleEditClick,
      });

    this.#tripPointEditComponent = new TripPointEditView (
      {tripPoint: this.#tripPoint,
        onFormSubmit: this.#handleFormSubmit,
        onFormClose: this.#handleFormSubmit,
      });

    if (prevTripPointComponent === null || prevTripPointEditComponent === null) {
      render (this.#tripPointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#pointsListContainer.contains(prevTripPointComponent.element)) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#pointsListContainer.contains(prevTripPointEditComponent.element)) {
      replace(this.#tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  }

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  }

  #replacePointToForm () {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint () {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

}
