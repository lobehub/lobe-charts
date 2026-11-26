// Monotone cubic (Fritsch-Carlson) curve as a d3-shape CurveFactory, so recharts draws the same
// smooth-without-overshoot lines and areas as the official charts.
// Adapted from CopilotKit a2ui-playground (MIT): src/a2ui/catalog/renderers/chart-kit.tsx `monotonePath`.

type Point = [number, number];

interface PathContext {
  bezierCurveTo: (x1: number, y1: number, x2: number, y2: number, x: number, y: number) => void;
  closePath: () => void;
  lineTo: (x: number, y: number) => void;
  moveTo: (x: number, y: number) => void;
}

const drawMonotone = (context: PathContext, points: Point[], move: boolean) => {
  const n = points.length;
  if (n === 0) return;
  const [x0, y0] = points[0];
  if (move) context.moveTo(x0, y0);
  else context.lineTo(x0, y0);
  if (n === 1) return;
  if (n === 2) {
    context.lineTo(points[1][0], points[1][1]);
    return;
  }
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const h = points[i + 1][0] - points[i][0];
    dx.push(h);
    m.push(h === 0 ? 0 : (points[i + 1][1] - points[i][1]) / h);
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++)
    t.push(
      m[i - 1] * m[i] <= 0
        ? 0
        : (3 * (dx[i - 1] + dx[i])) /
            ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]),
    );
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    const [xa, ya] = points[i];
    const [xb, yb] = points[i + 1];
    const h = dx[i] / 3;
    context.bezierCurveTo(xa + h, ya + t[i] * h, xb - h, yb - t[i + 1] * h, xb, yb);
  }
};

class MonotoneCurve {
  private context: PathContext;
  private line = Number.NaN;
  private points: Point[] = [];

  constructor(context: PathContext) {
    this.context = context;
  }

  areaStart() {
    this.line = 0;
  }

  areaEnd() {
    this.line = Number.NaN;
  }

  lineStart() {
    this.points = [];
  }

  lineEnd() {
    // In an area the second line (the baseline, reversed) continues the first one.
    drawMonotone(this.context, this.points, this.line !== 1);
    if (this.line === 1) this.context.closePath();
    this.line = 1 - this.line;
  }

  point(x: number, y: number) {
    this.points.push([+x, +y]);
  }
}

/** Pass as recharts `type` on `Line` / `Area`. */
export const curveA2uiMonotone = (context: PathContext) => new MonotoneCurve(context);
