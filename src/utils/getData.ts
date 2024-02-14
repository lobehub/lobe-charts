export const getData = (item: Record<string, any>, type: 'area' | 'radial') => {
  if (type === 'radial') {
    return item.value;
  }

  return item.payload[item.dataKey];
};
