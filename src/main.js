import { render } from './framework/render.js';
import { getPoints } from './mock/point.js';
import TripPointModel from './model/trip-point-model.js';
import ContentPresenter from './presenter/content-presenter.js';
//import TripPointPresenter from './presenter/trip-point-presenter.js';
import NewTripPointBtnView from './view/new-trip-point-btn-view.js';


const siteFilterElement = document.querySelector('.trip-controls');
const siteContentElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-main');
const points = getPoints();


const newTripPointBtnComponent = new NewTripPointBtnView({ onClick: handleNewTripPointBtnClick});
const tripPointModel = new TripPointModel();
tripPointModel.init(points);
const pointPresenter = new ContentPresenter({
  filtersContainer: siteFilterElement,
  mainContainer: siteContentElement,
  tripPointModel,
  onNewPointDestroy: handleNewTripPointFormClose});

function handleNewTripPointBtnClick () {
  pointPresenter.createPoint();
  newTripPointBtnComponent.element.disabled = true;
}
function handleNewTripPointFormClose () {
  newTripPointBtnComponent.element.disabled = false;
}

render (newTripPointBtnComponent, siteHeaderElement);

pointPresenter.init();
