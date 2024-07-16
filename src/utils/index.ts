import { ValueFormatter } from '@/types';

export const defaultValueFormatter: ValueFormatter = (value: number) => value.toString();

export const sumNumericArray = (arr: number[]) =>
  arr.reduce((prefixSum, num) => prefixSum + num, 0);
