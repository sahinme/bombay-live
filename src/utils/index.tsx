export const getRandomKeyFromArray = (items: Array<string | number>) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const upsert = (
  array: Array<any>,
  element: { id: number | string; value: any }
) => {
  const i = array.findIndex((_element) => _element.id === element.id);
  if (i > -1) array[i] = element;
  else array.push(element);
  return array;
};
