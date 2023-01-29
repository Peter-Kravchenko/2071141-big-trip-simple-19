import { render, replace, remove } from '../framework/render.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripPointEditView from '../view/trip-point-edit-view.js';


const Mode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

export default class TripPointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #tripPoint = null;
  #mode = Mode.DEFAULT;

  constructor({pointsListContainer, onDataChange, onModeChange}) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDIT) {
      replace(this.#tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  }

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm () {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDIT;
  }

  #replaceFormToPoint () {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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

  #handleFormSubmit = (tripPoint) => {
    this.#handleDataChange(tripPoint);
    this.#replaceFormToPoint();
  };

}
