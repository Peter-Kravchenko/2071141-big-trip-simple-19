import TripsModel from './model/trip-point-model.js';
import PointPresenter from './presenter/point-presenter.js';

const siteFilterContainer = document.querySelector('.trip-controls');
const siteContentContainer = document.querySelector('.trip-events');

const tripPointModel = new TripsModel();
const pointPresenter = new PointPresenter(siteFilterContainer, siteContentContainer, tripPointModel);

pointPresenter.init();
