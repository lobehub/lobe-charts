import { DeltaTypes, ValueFormatter } from '@/types/charts';

export const defaultValueFormatter: ValueFormatter = String;

export const sumNumericArray = (arr: number[]) =>
  arr.reduce((prefixSum, num) => prefixSum + num, 0);

export const isOnSeverSide = typeof document === 'undefined' || typeof window === 'undefined';

export const mapInputsToDeltaType = (deltaType: string, isIncreasePositive: boolean): string => {
  if (isIncreasePositive || deltaType === DeltaTypes.Unchanged) {
    return deltaType;
  }
  switch (deltaType) {
    case DeltaTypes.Increase: {
      return DeltaTypes.Decrease;
    }
    case DeltaTypes.ModerateIncrease: {
      return DeltaTypes.ModerateDecrease;
    }
    case DeltaTypes.Decrease: {
      return DeltaTypes.Increase;
    }
    case DeltaTypes.ModerateDecrease: {
      return DeltaTypes.ModerateIncrease;
    }
  }
  return '';
};
