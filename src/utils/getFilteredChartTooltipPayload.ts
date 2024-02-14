export const getFilteredChartTooltipPayload = (
  payload: Record<string, any>[],
  segmentId?: string,
) => {
  const duplicatesFilter = payload.filter((item) => item.fill !== 'none' || !item.color);
  if (!segmentId) {
    return duplicatesFilter;
  }
  return duplicatesFilter.filter((item) => item.name === segmentId);
};
