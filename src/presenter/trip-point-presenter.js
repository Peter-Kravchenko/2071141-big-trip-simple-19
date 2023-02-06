import { UserAction, UpdateType } from '../const.js';
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
        onFormClose: this.#handleFormClose,
        onDeleteClick: this.#handleDeleteClick,
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

  #handleFormClose = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update);
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (tripPoint) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      tripPoint,
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  }

}
