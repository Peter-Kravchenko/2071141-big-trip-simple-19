import { render, replace } from '../framework/render.js';
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

    this.#tripPointComponent = new TripEventItemView(
      {tripPoint: this.#tripPoint,
        onEditClick: this.#handleEditClick,
      });

    this.#tripPointEditComponent = new TripPointEditView (
      {tripPoint: this.#tripPoint,
        onFormSubmit: this.#handleFormSubmit,
        onFormClose: this.#handleFormSubmit,
      });

    render (this.#tripPointComponent, this.#pointsListContainer);
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
