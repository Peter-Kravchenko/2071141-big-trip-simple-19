export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElements = (arr) => {
  const maxLength = arr.length;
  const lengthOfArray = getRandomInteger(1, maxLength);
  const elements = [];
  for (let i = elements.length; i < lengthOfArray; i++) {
    const indexOfElement = getRandomInteger(0, maxLength - 1);
    const element = arr[indexOfElement];
    if (!elements.includes(element)) {
      elements.push(element);
    }
  }
  return elements;
};

export const shuffleElements = (elements) => elements.sort(() => Math.random() - 0.5);

export const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
