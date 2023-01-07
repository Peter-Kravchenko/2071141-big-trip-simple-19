import { render } from '../render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripListView from '../view/trip-list-view.js';
import TripFormAddView from '../view/trip-form-add-view.js';
import FiltersFormView from '../view/filters-form-view.js';


export default class PointPresenter {
  filtersComponent = new FiltersFormView();
  sortFormComponent = new SortFormView();
  tripListComponent = new TripListView();

  init = (filtersContainer, mainContainer, tripPointModel) => {
    this.pointModel = tripPointModel;
    this.contentPoint = [...this.pointModel.getPoints()];

    render(this.filtersComponent, filtersContainer);
    render(this.sortFormComponent, mainContainer);
    render(this.tripListComponent, mainContainer);
    render(new TripFormAddView(this.contentPoint[0]), this.tripListComponent.getElement());

    for(let i = 0; i < this.contentPoint.length; i++) {
      render(new TripEventItemView(this.contentPoint[i]), this.tripListComponent.getElement());
    }
  };

}
