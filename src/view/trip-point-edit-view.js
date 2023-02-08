import {BLANK_POINT } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const createContentTemplate = (tripPoint, pointOffers, pointDestinations, destinationsCityList) => {
  const {basePrice, destination, dateFrom, dateTo, type, offers} = tripPoint;

  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);

  const types = pointOffers ? pointOffers.map((offerByType) => offerByType.type) : '';

  const createType = (currentType) => types.map((pointType) =>
    `<div class="event__type-item">
  <input id="event-type-${pointType}-${destination}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${currentType === pointType ? 'checked' : ''} ${'disabled'}>
  <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${destination}">${pointType}</label>
  </div>`).join('');

  const createDestinationNamesListTemplate = (selectedCity) => {
    const cityName = pointDestinations.find((city) => city.id === selectedCity);

    return `
    <label class="event__label  event__type-output" for="event-destination-${selectedCity}">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-${selectedCity}" type="text" name="event-destination" value="${cityName ? cityName.name : ''}" list="destination-list-${selectedCity}" required>
    <datalist id="destination-list-${selectedCity}">
    ${destinationsCityList.map((destinationCity) => `
    <option value="${destinationCity}" ${cityName && cityName.name === destinationCity ? 'selected' : ''}>`).join(' ')}
    </datalist>`;
  };

  const destinationNamesListTemplate = createDestinationNamesListTemplate(destination);

  const createPictures = (pictures) => {
    const chosenCity = pointDestinations.find((city) => city.id === pictures);
    return chosenCity ? chosenCity.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('') : '';
  };

  const picturesTemplate = createPictures(destination);

  const typeTemplate = createType(type);

  const isOfferChecked = (offer) => offers.includes(offer) ? 'checked' : '';

  const createTripPointOffers = () => {
    const pointOfferType = pointOffers.find((el) => el.type === type).offers;
    return pointOfferType.map((offer) => ` <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}" data-id="${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isOfferChecked(offer)}>
              <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title"> ${offer.title} </span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price"> ${offer.price} </span>
              </div>`).join(' ');
  };

  const offersTemplate = createTripPointOffers();

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${destination}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${destination}" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typeTemplate}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">     
        ${destinationNamesListTemplate}
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time">From</label>
          <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${parceDateStart.format(DATE_FORMAT)}">
          &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${parceDateEnd.format(DATE_FORMAT)}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offersTemplate}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestinations.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${picturesTemplate};
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`);
};

export default class TripPointEditView extends AbstractStatefulView {
  #tripPoint = null;
  #pointOffers = [];
  #pointDestinations = null;
  #handleFormSubmit = null;
  handleFormClose = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;
  #destinationsCityList = null;

  constructor({tripPoint = BLANK_POINT, pointOffers, pointDestinations, onFormSubmit, onFormClose, onDeleteClick}) {
    super();
    this._setState(TripPointEditView.parsePointToState(tripPoint));
    this.#pointOffers = pointOffers;
    this.#pointDestinations = pointDestinations;
    this.#destinationsCityList = this.#pointDestinations.map((city) => city.name);
    this.#handleFormSubmit = onFormSubmit;
    this.handleFormClose = onFormClose;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    return createContentTemplate(this._state, this.#pointOffers, this.#pointDestinations, this.#destinationsCityList);
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#handleFormClose);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#handleFormClose);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(TripPointEditView.parseStateToPoint(this._state), this.#pointOffers, this.#pointDestinations);
  };

  #handleFormClose = () => {
    this.handleFormClose(this.#tripPoint);
  };

  #offerChangeHandler = () => {
    const selectOffers = [];
    Array.from(this.element.querySelectorAll('.event__offer-checkbox'))
      .forEach((checkbox) => checkbox.checked ? selectOffers.push(Number(checkbox.dataset.id)) : '');
    this.updateElement({
      offers: selectOffers,
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const inputPrice = evt.target.value;

    if (evt.target.value === '') {
      evt.target.value = '0';
    }
    evt.target.value = isNaN(inputPrice) ? this._state.basePrice : inputPrice;
    this._state.basePrice = evt.target.value;
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const offers = this._state.type === evt.target.value ? this._state.offers : [];
    this.updateElement({
      type: evt.target.value,
      offers,
    });
  };

  #destinationChangeHandler = (evt) => {
    if(!(this.#destinationsCityList.includes(evt.target.value))) {
      return;
    }
    this.#pointDestinations.forEach((city) => {
      if(evt.target.value && city.name === evt.target.value) {
        this.updateElement({
          destination: city.id,
        });
      }
    });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(TripPointEditView.parseStateToPoint(this._state));
  };

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(tripPoint) {
    this.updateElement(
      TripPointEditView.parsePointToState(tripPoint),
    );
  }

  static parsePointToState(task) {
    return {...task};
  }

  static parseStateToPoint(state) {
    return {...state};
  }

}
