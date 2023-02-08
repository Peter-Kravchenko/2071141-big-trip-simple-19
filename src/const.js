export const OFFER_TYPES = ['taxi','bus','train','ship','drive','flight','check-in', 'sightseeing','restaurant'];

export const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

export const SORT_TYPES = {
  DATE: 'day',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: 0,
  id:0,
  offers: [],
  type: OFFER_TYPES[0]
};
