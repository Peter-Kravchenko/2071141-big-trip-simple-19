import AbstractView from '../framework/view/abstract-view.js';
import { humanizeHour, humanizeStartDate } from '../utils/point-utils';


const createContentTemplate = (tripPoints, tripOffers, tripDestinations) => {
  const {basePrice, destination, dateFrom, dateTo, type, offers} = tripPoints;

  const destinationName = destination ? tripDestinations.find((el) => (el.id === destination)).name : '';

  const createOffersTemplate = () => {
    const selectedOffers = tripOffers.find((offer) => offer.type === type).offers;

    let offersTemplate = '';
    if(offers.length) {
      offers.forEach((pointOffer) => {
        const selectedOffer = selectedOffers.find((el) => pointOffer === el.id);
        offersTemplate +=
        ` <li class="event__offer">
        <span class="event__offer-title">${selectedOffer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${selectedOffer.price}</span>
       </li>`;
      });
    }
    return offersTemplate;
  };

  const selectedOffersTemplate = createOffersTemplate();

  return (`<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateFrom}">${humanizeStartDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destinationName} </h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFrom}">${humanizeHour(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateTo}">${humanizeHour(dateTo)}</time>
      </p>
    </div>
    <p class="event__price">
       &euro;&nbsp;<span class="event__price-value">${basePrice ? basePrice : ''}</span>
     </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${selectedOffersTemplate}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>
  `);
};

export default class TripEventItemView extends AbstractView {
  #tripPoint = null;
  #tripOffers = null;
  #tripDestinations = null;
  #handleEditClick = null;

  constructor({tripPoint, tripOffers ,tripDestinations, onEditClick}) {
    super();
    this.#tripPoint = tripPoint;
    this.#tripOffers = tripOffers;
    this.#tripDestinations = tripDestinations;
    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHendler);
  }

  get template() {
    return createContentTemplate(this.#tripPoint, this.#tripOffers, this.#tripDestinations);
  }

  #editClickHendler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
