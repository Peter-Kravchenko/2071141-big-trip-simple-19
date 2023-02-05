import { nanoid } from 'nanoid';
import { OFFER_TYPES, OFFERS_TITLE, DESTINATIONS, DESCRIPTIONS, TRIP_POINT_ITEMS } from '../const.js';
import { getRandomElements, getRandomInteger } from '../utils/common.js';

const generateDate = () => {
  const min = getRandomInteger(0,60);
  const hour = getRandomInteger(0, 23);
  const day = getRandomInteger(1,31);
  const month = getRandomInteger(0,12);
  const year = getRandomInteger(2020, 2024);

  const dateFrom = new Date(year, month, day, hour, min);
  const dateTo = new Date(year, month, day, hour, min);

  return {dateFrom, dateTo};
};

export const mockOffers = [];
for (let i = 0; i < OFFERS_TITLE.length; i++) {
  mockOffers.push({
    id: i,
    title: OFFERS_TITLE[i],
    price: getRandomInteger(1, 1000),
  });
}

export const mockOffersByType = [];
for (let i = 0; i < OFFER_TYPES.length; i++) {
  mockOffersByType.push({
    type: OFFER_TYPES[i],
    offers: getRandomElements(mockOffers),
  });
}

const generatePicture = () => `https://loremflickr.com/248/152?random=${getRandomInteger(0, 500)}`;

const generateDestination = (id) => ({
  id,
  description: getRandomElements(DESCRIPTIONS),
  name: DESTINATIONS[id],
  pictures: [{
    src: Array.from({length: getRandomInteger(0, 5)}, generatePicture),
    description: `${DESTINATIONS[id]} ${DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)].split().slice(0,1)}}`,
  }]
});

const getDestinations = (count) => {
  const tripPointDestinations = [];
  for (let i = 0; i < count; i++) {
    tripPointDestinations.push(generateDestination(i));
  }
  return tripPointDestinations;
};

export const destinations = getDestinations(DESTINATIONS.length);

const generateTripPoint = () => {
  const dateMock = generateDate();
  const typesAndOffers = mockOffersByType[getRandomInteger(0, mockOffersByType.length - 1)];
  return {
    basePrice: getRandomInteger(100, 2000),
    dateFrom: dateMock.dateFrom,
    dateTo: dateMock.dateTo,
    destination: getRandomInteger(0, 4),
    id: nanoid(),
    offers: getRandomElements(typesAndOffers.offers),
    type: typesAndOffers.type,
  };
};

export const getPoints = () => Array.from({length: TRIP_POINT_ITEMS }, generateTripPoint);
