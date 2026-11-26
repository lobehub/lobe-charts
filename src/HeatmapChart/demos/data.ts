const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['00', '03', '06', '09', '12', '15', '18', '21'];

/** API requests per 3h window: busy midday on weekdays, quieter at weekends. */
export const requests = days.flatMap((day, di) =>
  hours.map((hour, hi) => {
    const work = di < 5 ? 1 : 0.35;
    const curve = Math.exp(-((hi - 4.2) ** 2) / 4.5);
    return {
      day,
      hour,
      requests: Math.round(40 + 860 * work * curve + ((di * 7 + hi * 13) % 9) * 12),
    };
  }),
);
