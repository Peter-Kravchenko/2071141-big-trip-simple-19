import { getPoints } from './mock/point.js';
import TripPointModel from './model/trip-point-model.js';
import PointPresenter from './presenter/content-presenter.js';


const siteFilterElement = document.querySelector('.trip-controls');
const siteContentElement = document.querySelector('.trip-events');
const points = getPoints();


const tripPointModel = new TripPointModel();
tripPointModel.init(points);
const pointPresenter = new PointPresenter({
  filtersContainer: siteFilterElement,
  mainContainer: siteContentElement,
  tripPointModel});

pointPresenter.init();
