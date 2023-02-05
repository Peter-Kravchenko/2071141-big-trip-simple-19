import { OFFER_TYPES, DESTINATIONS } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { destinations, mockOffers, mockOffersByType} from '../mock/point.js';
import { humanizeDate } from '../utils/point-utils';

const createType = (currentType) => OFFER_TYPES.map((pointType) =>
  `<div class="event__type-item">
   <input id="event-type-${pointType}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${currentType === pointType ? 'checked' : ''}>
   <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}">${pointType}</label>
   </div>`).join('');

const createPictures = (pictures) => pictures.map((picture) =>
  `<img class="event__photo" src= "${picture.src}" alt="${picture.description}">`).join('');

const createContentTemplate = (tripPoint) => {
  const {basePrice, destination, dateFrom, dateTo, type, offers} = tripPoint;
  //console.log(offers);
  //console.log(type);
  // console.log(tripPoint);
  //console.log(destinations);

  const createDestinationNamesListTemplate = (selectedCity) => `
<label class="event__label  event__type-output" for="event-destination-1">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${selectedCity}" list="destination-list-1">
    <datalist id="destination-list-1">
    ${DESTINATIONS.map((destinationCity) => `
    <option value="${destinationCity}" ${selectedCity === destinationCity ? 'selected' : ''}>`).join(' ')}
    </datalist>
`;

  const destinationNamesListTemplate = createDestinationNamesListTemplate(destinations[destination].name);

  const picturesTemplate = destination ? createPictures(destinations[destination].pictures) : '';

  const typeTemplate = createType(type);

  const isOfferChecked = (offer) => offers.includes(offer) ? 'checked' : '';

  const createTripPointOffers = () => {
    const pointOfferType = mockOffersByType.filter((el) => (el.type === type));
    return pointOfferType[0].offers.map((offer) => ` <div class="event__offer-selector">
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
        <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom)}">
          &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo)}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
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
        <p class="event__destination-description">${destinations[destination].description}</p>
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
  #handleFormSubmit = null;
  handleFormClose = null;

  constructor({tripPoint, onFormSubmit, onFormClose}) {
    super();
    this._setState(TripPointEditView.parsePointToState(tripPoint));
    this.#handleFormSubmit = onFormSubmit;
    this.handleFormClose = onFormClose;

    this._restoreHandlers();
  }

  _restoreHandlers() {

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#handleFormClose);

    this.element.querySelector('.event__type-group')
      .addEventListener('cahnge', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__field-group--destination')
      .addEventListener('change', this.#eventDestinationChangeHandler);
  }

  get template() {
    return createContentTemplate(this._state);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.EditFormView.parseStateToPoint(this._state));
  };

  #handleFormClose = () => {
    this.handleFormClose(this.#tripPoint);
  }; //ошибка id

  static parsePointToState(task) {
    return {...task};
  }

  static parseStateToPoint(state) {
    return {...state};
  }

  #eventTypeChangeHandler = (evt) =>
  {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      // offers: find
    });
  };

  #eventDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: !this._state.destination
    });
  };

}
