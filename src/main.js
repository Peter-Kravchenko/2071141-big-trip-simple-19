import TripsModel from './model/trip-point-model.js';
import PointPresenter from './presenter/point-presenter.js';
import { render } from './render.js';
import FiltersFormView from './view/filters-form-view.js';

const siteFilterElement = document.querySelector('.trip-controls');
const siteContentElement = document.querySelector('.trip-events');

const tripPointModel = new TripsModel();
const pointPresenter = new PointPresenter();


render(new FiltersFormView(), siteFilterElement);
pointPresenter.init(siteContentElement, tripPointModel);
