import AbstractView from '../framework/view/abstract-view';


const createContentTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class TripListView extends AbstractView {

  get template() {
    return createContentTemplate();
  }
}
