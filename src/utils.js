import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const shuffleElements = (elements) => elements.sort(() => Math.random() - 0.5);

const humanizeDate = (date) => dayjs(date).format('DD/MM/YY H:00');
const humanizeHour = (hour) => dayjs(hour).format(' HH:00');
const humanizeStartDate = (startDate) => dayjs(startDate).format('MMMM DD');
const differenceHoursMinutes = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom),'hour','minute');

export {getRandomInteger, humanizeDate, humanizeHour, humanizeStartDate, differenceHoursMinutes, shuffleElements};
