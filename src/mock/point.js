import { nanoid } from 'nanoid';
import { OfferTypes } from '../const.js';
import { getRandomInteger } from '../utils/common.js';

const OFFERS = ['Add luggage', 'Choose seats', 'Add meal', 'Comfort class', 'Business class'];

export const DESTINATIONS = ['Chamonix', 'Paris', 'London', 'Madrid', 'Geneva'];

const TRIP_POINT_COUNT = 20;

const generateType = () => {
  const type = Object.values(OfferTypes);
  const typesIndex = getRandomInteger(0, type.length - 2);
  return type[typesIndex];
};

const generateOffers = () => {
  const offer = OFFERS;
  const offerIndex = getRandomInteger(0, offer.length - 1);
  return offer[offerIndex];
};

const generatePicture = () => `https://loremflickr.com/248/152?random=${getRandomInteger(0, 5000)}`;

export const offers = [{
  id: 1,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},
{
  id: 2,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},
{
  id: 3,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
}];


export const destinations = [{
  id: 1,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  name: 'Chamonix',
  pictures: [{
    src: Array.from({length: getRandomInteger(0, 5)}, generatePicture),
    description: 'Beautiful Mountains'
  }]
},
{
  id: 2,
  description: 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  name: 'Paris',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'City of light'
  }]
},
{
  id: 3,
  description: 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  name: 'London',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'The capital of UK'
  }]
}
];

const generateTripPoint = () => ({
  basePrice: getRandomInteger(100, 2000),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: getRandomInteger(1, 3),
  id: nanoid(),
  offers: 400,
  type: generateType(),
}
);

export const getPoints = () => Array.from({length: TRIP_POINT_COUNT }, generateTripPoint);
