export const constructCategoryColors = (
  categories: string[],
  colors: string[],
): Map<string, string> => {
  const categoryColors = new Map<string, string>();
  for (const [idx, category] of categories.entries()) {
    categoryColors.set(category, colors[idx % colors.length]);
  }
  return categoryColors;
};

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
) => {
  return [autoMinValue ? 'auto' : (minValue ?? 0), maxValue ?? 'auto'];
};

export const constructCategories = (data: any[], color?: string): string[] => {
  if (!color) {
    return [];
  }

  const categories = new Set<string>();
  for (const datum of data) {
    categories.add(datum[color]);
  }
  return [...categories];
};

export const deepEqual = (obj1: any, obj2: any) => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null)
    return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

export const hasOnlyOneValueForThisKey = (array: any[], keyToCheck: string) => {
  const val = [];

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck]);
      if (val.length > 1) {
        return false;
      }
    }
  }

  return true;
};
