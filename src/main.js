import TripPointModel from './model/trip-point-model.js';
import PointPresenter from './presenter/point-presenter.js';

const siteFilterElement = document.querySelector('.trip-controls');
const siteContentElement = document.querySelector('.trip-events');

const tripPointModel = new TripPointModel();
const pointPresenter = new PointPresenter({
  filtersContainer: siteFilterElement,
  mainContainer: siteContentElement,
  tripPointModel});

pointPresenter.init();
