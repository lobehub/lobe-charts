import { NameType, Payload } from 'recharts/types/component/DefaultTooltipContent';

export type CustomTooltipProps = {
  active: boolean | undefined;
  label: NameType | undefined;
  payload: Payload<string | number | (string | number)[], string | number>[] | undefined;
};
