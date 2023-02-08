import { render, remove, RenderPosition } from '../framework/render.js';
import FiltersFormView from '../view/filters-form-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import SortFormView from '../view/sort-form-view.js';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import { UpdateType, UserAction } from '../const.js';
import NewTripPointPresenter from './new-trip-point-presenter.js';
import LoadingView from '../view/loading-view.js';

export default class ContentPresenter {
  #filtersContainer = null;
  #mainContainer = null;
  #tripPointModel = null;
  #noPointComponent = new NoPointsView();
  #loadingComponent = new LoadingView();
  #newTripPointPresenter = null;
  #filtersComponent = new FiltersFormView();
  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripListView();
  #onNewPointDestroy = null;
  #isLoading = true;
  #offers = null;
  #destinations = null;

  #tripPointsPresenter = new Map();

  constructor ({filtersContainer, mainContainer, tripPointModel, onNewPointDestroy}) {
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;
    this.#tripPointModel = tripPointModel;
    this.#onNewPointDestroy = onNewPointDestroy;

    this.#newTripPointPresenter = new NewTripPointPresenter({
      pointListContainer: this.#tripListComponent.element,
      offers: this.#offers,
      destinations: this.#destinations,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewPointDestroy,
    });

    this.#tripPointModel.addObserver(this.#handleModelEvent);
  }

  get tripPoints() {
    //Фильтрация, сделать позже
    return this.#tripPointModel.points;
  }

  init = () => {
    this.#renderContentBoard();
  };

  createPoint() {
    this.#newTripPointPresenter.init();
  }

  #renderFilter = () => {
    render(this.#filtersComponent, this.#filtersContainer);
  };

  #renderSort = () => {
    render(this.#sortFormComponent, this.#mainContainer);
  };

  #renderPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter({
      pointsListContainer: this.#tripListComponent.element,
      offers: this.#offers,
      destinations: this.#destinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onDestroy: this.#onNewPointDestroy,
    });
    tripPointPresenter.init(tripPoint, this.#tripPointModel.offers, this.#tripPointModel.destinations);
    this.#tripPointsPresenter.set(tripPoint.id, tripPointPresenter);
  };

  #renderPoints = () => {
    this.tripPoints.forEach(this.#renderPoint);
  };

  #renderPointsList = () => {
    render(this.#tripListComponent, this.#mainContainer);
    this.#renderPoints();
  };

  #renderContentBoard = () => {
    //const tripPoints поправить нэйминг
    render(this.#tripListComponent, this.#mainContainer);

    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const tripPoint = this.#tripPointModel.points;
    const tripPointCount = tripPoint.length;


    if (tripPointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderFilter();
    this.#renderSort();
    this.#renderPointsList();

  };

  #clearBoard = (/*{resetSortType = false} = {}*/) => {
    // this.#tripPointNewPresenter.destroy();
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointsPresenter.clear();

    remove(this.#sortFormComponent);
    remove(this.#filtersComponent);

    if(this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    // if (resetSortType) {
    //   this.#currentSortType = SORT_TYPES.DATE;
  };

  #renderNoPoints = () => {
    render (this.#noPointComponent, this.#mainContainer);
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#tripPointsPresenter.forEach((presenter) =>
      presenter.resetView()
    );
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripPointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#tripPointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripPointsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderContentBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderContentBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContentBoard();
        break;
    }
  };
}
