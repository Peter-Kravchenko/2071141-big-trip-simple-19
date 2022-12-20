import SortView from '../view/sort-view.js';
import EditView from '../view/edit-view.js';
import FilterView from '../view/filter-view.js';
import WaypointView from '../view/waypoint-view.js';
import ListView from '../view/list-view.js';
import {render} from '../render.js';

const WAYPOINTS_COUNT = 3;

export default class TripPresenter{
  tripListView = new ListView();

  constructor({boardContainer, headerContainer}) {
    this.boardContainer = boardContainer;
    this.headerContainer = headerContainer;
  }

  init() {
    render(new FilterView, this.headerContainer);
    render(new SortView, this.boardContainer);
    render(this.tripListView, this.boardContainer);
    render(new EditView(), this.tripListView.getElement());
    for (let i = WAYPOINTS_COUNT; i > 0; i--) {
      render(new WaypointView(), this.tripListView.getElement());
    }
  }
}
