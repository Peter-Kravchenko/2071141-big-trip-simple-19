import TripPresenter from './presenter/trip-presenter.js';

const siteHeaderElement = document.querySelector('.trip-controls');
const siteEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({
  boardContainer: siteEventsElement,
  headerContainer: siteHeaderElement,
});

tripPresenter.init();
