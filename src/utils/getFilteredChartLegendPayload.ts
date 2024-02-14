export const getFilteredChartLegendPayload = (payload: Record<string, any>[]) => {
  return payload.filter((item) => item.color !== 'none');
};
