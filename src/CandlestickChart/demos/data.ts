/** Deterministic random walk of daily OHLC prices, so the demo renders the same on every load. */
const walk = (seed: number, days: number, start: number, vol: number) => {
  let s = seed;
  const rnd = () => (s = (s * 16_807) % 2_147_483_647) / 2_147_483_647 - 0.5;
  const out: { close: number; date: string; high: number; low: number; open: number }[] = [];
  let price = start;
  for (let i = 0; i < days; i++) {
    const open = price;
    const close = +(open + rnd() * vol * 2 + vol * 0.08).toFixed(2);
    const high = +(Math.max(open, close) + Math.abs(rnd()) * vol).toFixed(2);
    const low = +(Math.min(open, close) - Math.abs(rnd()) * vol).toFixed(2);
    const d = new Date(Date.UTC(2026, 8, 1 + i));
    out.push({
      close,
      date: `${d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${d.getUTCDate()}`,
      high,
      low,
      open: +open.toFixed(2),
    });
    price = close;
  }
  return out;
};

export const prices = walk(42, 30, 182.4, 3.2);
