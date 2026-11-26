// Treemap layout: squarified tiling with inner / outer padding.
// Ported from d3-hierarchy 3.1.2 `treemap` and `treemapSquarify` (ISC License, Copyright 2010-2021 Mike Bostock),
// as used by the official A2UI Treemap (CopilotKit a2ui-playground, MIT).

export interface TreemapLeafInput {
  group: string;
  name: string;
  value: number;
}

export interface TreemapCell extends TreemapLeafInput {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface Node {
  children?: Node[];
  depth: number;
  leaf?: TreemapLeafInput;
  value: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;

const dice = (parent: Node, x0: number, y0: number, x1: number, y1: number) => {
  const nodes = parent.children!;
  const k = parent.value && (x1 - x0) / parent.value;
  for (const node of nodes) {
    node.y0 = y0;
    node.y1 = y1;
    node.x0 = x0;
    node.x1 = x0 += node.value * k;
  }
};

const slice = (parent: Node, x0: number, y0: number, x1: number, y1: number) => {
  const nodes = parent.children!;
  const k = parent.value && (y1 - y0) / parent.value;
  for (const node of nodes) {
    node.x0 = x0;
    node.x1 = x1;
    node.y0 = y0;
    node.y1 = y0 += node.value * k;
  }
};

const squarify = (parent: Node, x0: number, y0: number, x1: number, y1: number, ratio = PHI) => {
  const nodes = parent.children!;
  const n = nodes.length;
  let i0 = 0;
  let i1 = 0;
  let value = parent.value;
  while (i0 < n) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    let sumValue: number;
    do sumValue = nodes[i1++].value;
    while (!sumValue && i1 < n);
    let minValue = sumValue;
    let maxValue = sumValue;
    const alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
    let beta = sumValue * sumValue * alpha;
    let minRatio = Math.max(maxValue / beta, beta / minValue);
    for (; i1 < n; ++i1) {
      const nodeValue = nodes[i1].value;
      sumValue += nodeValue;
      if (nodeValue < minValue) minValue = nodeValue;
      if (nodeValue > maxValue) maxValue = nodeValue;
      beta = sumValue * sumValue * alpha;
      const newRatio = Math.max(maxValue / beta, beta / minValue);
      if (newRatio > minRatio) {
        sumValue -= nodeValue;
        break;
      }
      minRatio = newRatio;
    }
    const row: Node = { children: nodes.slice(i0, i1), depth: 0, value: sumValue, x0, x1, y0, y1 };
    if (dx < dy) dice(row, x0, y0, x1, value ? (y0 += (dy * sumValue) / value) : y1);
    else slice(row, x0, y0, value ? (x0 += (dx * sumValue) / value) : x1, y1);
    value -= sumValue;
    i0 = i1;
  }
};

/**
 * Lays out leaves (optionally grouped one level deep) in a `width` x `height` box. Children are sorted by
 * value, largest first, at every level. Returns the leaf cells and the colour keys in input order.
 */
export const layoutTreemap = (
  leaves: TreemapLeafInput[],
  width: number,
  height: number,
  { paddingInner = 3, paddingOuter = 1.5 } = {},
) => {
  // Merge duplicates (same group + name) and build root -> group -> leaf.
  const merged = new Map<string, TreemapLeafInput>();
  for (const leaf of leaves) {
    if (!(leaf.value > 0)) continue;
    const key = `${leaf.group}\u0000${leaf.name}`;
    const prev = merged.get(key);
    merged.set(key, prev ? { ...prev, value: prev.value + leaf.value } : { ...leaf });
  }
  const root: Node = { children: [], depth: 0, value: 0, x0: 0, x1: width, y0: 0, y1: height };
  const groups = new Map<string, Node>();
  for (const leaf of merged.values()) {
    const node: Node = { depth: 0, leaf, value: leaf.value, x0: 0, x1: 0, y0: 0, y1: 0 };
    if (leaf.group) {
      let group = groups.get(leaf.group);
      if (!group) {
        group = { children: [], depth: 1, value: 0, x0: 0, x1: 0, y0: 0, y1: 0 };
        groups.set(leaf.group, group);
        root.children!.push(group);
      }
      node.depth = 2;
      group.children!.push(node);
    } else {
      node.depth = 1;
      root.children!.push(node);
    }
  }
  // Sum and sort, largest first (stable for ties).
  const sum = (node: Node): number => {
    if (node.children) {
      node.value = node.children.reduce((s, c) => s + sum(c), 0);
      node.children.sort((a, b) => b.value - a.value);
    }
    return node.value;
  };
  sum(root);

  const paddingStack = [0];
  const cells: TreemapCell[] = [];
  const position = (node: Node) => {
    let p = paddingStack[node.depth];
    let x0 = node.x0 + p;
    let y0 = node.y0 + p;
    let x1 = node.x1 - p;
    let y1 = node.y1 - p;
    if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
    if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
    node.x0 = x0;
    node.y0 = y0;
    node.x1 = x1;
    node.y1 = y1;
    if (node.children && node.children.length > 0) {
      p = paddingStack[node.depth + 1] = paddingInner / 2;
      x0 += paddingOuter - p;
      y0 += paddingOuter - p;
      x1 -= paddingOuter - p;
      y1 -= paddingOuter - p;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      squarify(node, x0, y0, x1, y1);
      for (const child of node.children) position(child);
    } else if (node.leaf) {
      cells.push({ ...node.leaf, x0: node.x0, x1: node.x1, y0: node.y0, y1: node.y1 });
    }
  };
  if (root.value > 0) position(root);

  // Colour keys (group, or the leaf's own name when ungrouped) in the order they first appear.
  const keys = Array.from(new Set([...merged.values()].map((l) => l.group || l.name)));
  return { cells, keys, total: root.value };
};
