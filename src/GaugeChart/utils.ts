/**
 * Half-ring sector from the left end (`from = 0`) to the right end (`to = 1`) with fully rounded ends
 * that stay inside the swept angle, like a d3 arc with an unbounded `cornerRadius`.
 */
export const gaugeArcPath = (
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  from: number,
  to: number,
): string => {
  if (outer <= 0 || to <= from) return '';
  // d3 convention: 0 is 12 o'clock, clockwise; the gauge spans -90deg .. 90deg.
  const a0 = -Math.PI / 2 + from * Math.PI;
  const a1 = -Math.PI / 2 + to * Math.PI;
  const cr = (outer - inner) / 2;
  const mid = (outer + inner) / 2;
  const at = (r: number, a: number) =>
    `${(cx + r * Math.sin(a)).toFixed(3)},${(cy - r * Math.cos(a)).toFixed(3)}`;
  const delta = Math.asin(Math.min(1, cr / mid));
  const s = a0 + delta;
  const e = a1 - delta;
  if (e <= s) {
    // Too short for two caps: a single round dot at the middle angle.
    const a = (a0 + a1) / 2;
    const [x, y] = at(mid, a).split(',').map(Number);
    return `M${x - cr},${y}a${cr},${cr} 0 1,0 ${cr * 2},0a${cr},${cr} 0 1,0 ${-cr * 2},0Z`;
  }
  const large = e - s > Math.PI ? 1 : 0;
  return [
    `M${at(outer, s)}`,
    `A${outer},${outer} 0 ${large},1 ${at(outer, e)}`,
    `A${cr},${cr} 0 0,1 ${at(inner, e)}`,
    `A${inner},${inner} 0 ${large},0 ${at(inner, s)}`,
    `A${cr},${cr} 0 0,1 ${at(outer, s)}`,
    'Z',
  ].join('');
};
