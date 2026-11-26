// Sankey layout.
// Ported from d3-sankey 0.12.3 (BSD-3-Clause, Copyright 2015 Mike Bostock; see below) with `nodeAlign`
// fixed to `sankeyJustify`, as used by the official A2UI SankeyChart (CopilotKit a2ui-playground, MIT).
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided
// that the following conditions are met: redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer; redistributions in binary form must
// reproduce the above copyright notice, this list of conditions and the following disclaimer in the
// documentation and/or other materials provided with the distribution; neither the name of the author nor
// the names of contributors may be used to endorse or promote products derived from this software without
// specific prior written permission. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES ARE DISCLAIMED.

export interface SankeyLinkInput {
  source: string;
  target: string;
  value: number;
}

export interface SankeyNode {
  depth: number;
  height: number;
  id: string;
  index: number;
  layer: number;
  sourceLinks: SankeyLink[];
  targetLinks: SankeyLink[];
  value: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface SankeyLink {
  index: number;
  source: SankeyNode;
  target: SankeyNode;
  value: number;
  width: number;
  /** Centre of the ribbon where it leaves the source. */
  y0: number;
  /** Centre of the ribbon where it enters the target. */
  y1: number;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/**
 * Cleans raw links: drops invalid and self links, merges parallel links, and drops any link that would
 * close a cycle (the layout needs a DAG). Node ids keep their first-seen order.
 */
export const prepareSankey = (
  data: any[],
  sourceKey = 'source',
  targetKey = 'target',
  valueKey = 'value',
) => {
  const merged = new Map<string, SankeyLinkInput>();
  for (const d of data ?? []) {
    const source = d?.[sourceKey];
    const target = d?.[targetKey];
    const value = d?.[valueKey];
    if (typeof source !== 'string' || typeof target !== 'string' || source === target) continue;
    if (!isNum(value) || value <= 0) continue;
    const k = `${source}\u0000${target}`;
    const prev = merged.get(k);
    merged.set(k, prev ? { ...prev, value: prev.value + value } : { source, target, value });
  }
  const out = new Map<string, string[]>();
  const reaches = (from: string, to: string) => {
    const seen = new Set<string>();
    const stack = [from];
    while (stack.length > 0) {
      const n = stack.pop()!;
      if (n === to) return true;
      if (seen.has(n)) continue;
      seen.add(n);
      stack.push(...(out.get(n) ?? []));
    }
    return false;
  };
  const links: SankeyLinkInput[] = [];
  for (const l of merged.values()) {
    if (reaches(l.target, l.source)) continue;
    out.set(l.source, [...(out.get(l.source) ?? []), l.target]);
    links.push(l);
  }
  const ids: string[] = [];
  for (const l of links) for (const id of [l.source, l.target]) if (!ids.includes(id)) ids.push(id);
  return { ids, links };
};

const sum = <T>(arr: T[], f: (d: T) => number) => arr.reduce((s, d) => s + f(d), 0);
const ascendingBreadth = (a: SankeyNode, b: SankeyNode) => a.y0 - b.y0;
const ascendingSourceBreadth = (a: SankeyLink, b: SankeyLink) =>
  ascendingBreadth(a.source, b.source) || a.index - b.index;
const ascendingTargetBreadth = (a: SankeyLink, b: SankeyLink) =>
  ascendingBreadth(a.target, b.target) || a.index - b.index;

export interface SankeyLayoutOptions {
  iterations?: number;
  nodePadding?: number;
  nodeWidth?: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** d3-sankey layout with justify alignment. */
export const layoutSankey = (
  ids: string[],
  inputs: SankeyLinkInput[],
  { x0, x1, y0, y1, nodeWidth: dx = 24, nodePadding = 8, iterations = 6 }: SankeyLayoutOptions,
) => {
  const nodes: SankeyNode[] = ids.map((id, index) => ({
    depth: 0,
    height: 0,
    id,
    index,
    layer: 0,
    sourceLinks: [],
    targetLinks: [],
    value: 0,
    x0: 0,
    x1: 0,
    y0: 0,
    y1: 0,
  }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const links: SankeyLink[] = inputs.map((l, index) => {
    const link: SankeyLink = {
      index,
      source: byId.get(l.source)!,
      target: byId.get(l.target)!,
      value: l.value,
      width: 0,
      y0: 0,
      y1: 0,
    };
    link.source.sourceLinks.push(link);
    link.target.targetLinks.push(link);
    return link;
  });
  if (nodes.length === 0) return { links, nodes };

  for (const node of nodes)
    node.value = Math.max(
      sum(node.sourceLinks, (l) => l.value),
      sum(node.targetLinks, (l) => l.value),
    );

  // Depths (from sources) and heights (from sinks).
  const walk = (key: 'depth' | 'height', next: (n: SankeyNode) => SankeyNode[]) => {
    let current = new Set(nodes);
    let x = 0;
    while (current.size > 0) {
      const following = new Set<SankeyNode>();
      for (const node of current) {
        node[key] = x;
        for (const n of next(node)) following.add(n);
      }
      if (++x > nodes.length) throw new Error('circular link');
      current = following;
    }
  };
  walk('depth', (n) => n.sourceLinks.map((l) => l.target));
  walk('height', (n) => n.targetLinks.map((l) => l.source));

  // Layers, justified: sinks go to the last column.
  const columnCount = Math.max(...nodes.map((n) => n.depth)) + 1;
  const kx = columnCount > 1 ? (x1 - x0 - dx) / (columnCount - 1) : 0;
  const columns: SankeyNode[][] = Array.from({ length: columnCount }, () => []);
  for (const node of nodes) {
    const aligned = node.sourceLinks.length > 0 ? node.depth : columnCount - 1;
    const i = Math.max(0, Math.min(columnCount - 1, Math.floor(aligned)));
    node.layer = i;
    node.x0 = x0 + i * kx;
    node.x1 = node.x0 + dx;
    columns[i].push(node);
  }
  const filled = columns.filter((c) => c.length > 0);

  const py = Math.min(nodePadding, (y1 - y0) / (Math.max(...filled.map((c) => c.length)) - 1 || 1));

  const reorderLinks = (list: SankeyNode[]) => {
    for (const { sourceLinks, targetLinks } of list) {
      sourceLinks.sort(ascendingTargetBreadth);
      targetLinks.sort(ascendingSourceBreadth);
    }
  };
  const reorderNodeLinks = ({ sourceLinks, targetLinks }: SankeyNode) => {
    for (const {
      source: { sourceLinks: s },
    } of targetLinks)
      s.sort(ascendingTargetBreadth);
    for (const {
      target: { targetLinks: t },
    } of sourceLinks)
      t.sort(ascendingSourceBreadth);
  };

  // Initial breadths.
  const ky = Math.min(
    ...filled.map((c) => (y1 - y0 - (c.length - 1) * py) / sum(c, (n) => n.value)),
  );
  for (const column of filled) {
    let y = y0;
    for (const node of column) {
      node.y0 = y;
      node.y1 = y + node.value * ky;
      y = node.y1 + py;
      for (const link of node.sourceLinks) link.width = link.value * ky;
    }
    y = (y1 - y + py) / (column.length + 1);
    for (let i = 0; i < column.length; ++i) {
      column[i].y0 += y * (i + 1);
      column[i].y1 += y * (i + 1);
    }
    reorderLinks(column);
  }

  const resolveTopToBottom = (column: SankeyNode[], start: number, i: number, alpha: number) => {
    let y = start;
    for (; i < column.length; ++i) {
      const node = column[i];
      const d = (y - node.y0) * alpha;
      if (d > 1e-6) {
        node.y0 += d;
        node.y1 += d;
      }
      y = node.y1 + py;
    }
  };
  const resolveBottomToTop = (column: SankeyNode[], start: number, i: number, alpha: number) => {
    let y = start;
    for (; i >= 0; --i) {
      const node = column[i];
      const d = (node.y1 - y) * alpha;
      if (d > 1e-6) {
        node.y0 -= d;
        node.y1 -= d;
      }
      y = node.y0 - py;
    }
  };
  const resolveCollisions = (column: SankeyNode[], alpha: number) => {
    const i = column.length >> 1;
    const subject = column[i];
    resolveBottomToTop(column, subject.y0 - py, i - 1, alpha);
    resolveTopToBottom(column, subject.y1 + py, i + 1, alpha);
    resolveBottomToTop(column, y1, column.length - 1, alpha);
    resolveTopToBottom(column, y0, 0, alpha);
  };

  const targetTop = (source: SankeyNode, target: SankeyNode) => {
    let y = source.y0 - ((source.sourceLinks.length - 1) * py) / 2;
    for (const { target: node, width } of source.sourceLinks) {
      if (node === target) break;
      y += width + py;
    }
    for (const { source: node, width } of target.targetLinks) {
      if (node === source) break;
      y -= width;
    }
    return y;
  };
  const sourceTop = (source: SankeyNode, target: SankeyNode) => {
    let y = target.y0 - ((target.targetLinks.length - 1) * py) / 2;
    for (const { source: node, width } of target.targetLinks) {
      if (node === source) break;
      y += width + py;
    }
    for (const { target: node, width } of source.sourceLinks) {
      if (node === target) break;
      y -= width;
    }
    return y;
  };

  for (let iter = 0; iter < iterations; ++iter) {
    const alpha = Math.pow(0.99, iter);
    const beta = Math.max(1 - alpha, (iter + 1) / iterations);
    // Right to left, by outgoing links.
    for (let i = columns.length - 2; i >= 0; --i) {
      const column = columns[i];
      if (column.length === 0) continue;
      for (const source of column) {
        let y = 0;
        let w = 0;
        for (const { target, value } of source.sourceLinks) {
          const v = value * (target.layer - source.layer);
          y += sourceTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        const d = (y / w - source.y0) * alpha;
        source.y0 += d;
        source.y1 += d;
        reorderNodeLinks(source);
      }
      column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
    // Left to right, by incoming links.
    for (let i = 1; i < columns.length; ++i) {
      const column = columns[i];
      if (column.length === 0) continue;
      for (const target of column) {
        let y = 0;
        let w = 0;
        for (const { source, value } of target.targetLinks) {
          const v = value * (target.layer - source.layer);
          y += targetTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        const d = (y / w - target.y0) * alpha;
        target.y0 += d;
        target.y1 += d;
        reorderNodeLinks(target);
      }
      column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  // Link breadths.
  for (const node of nodes) {
    let ys = node.y0;
    let yt = node.y0;
    for (const link of node.sourceLinks) {
      link.y0 = ys + link.width / 2;
      ys += link.width;
    }
    for (const link of node.targetLinks) {
      link.y1 = yt + link.width / 2;
      yt += link.width;
    }
  }

  return { links, nodes };
};

/** Horizontal S-curve between the ends of a ribbon. */
export const ribbonPath = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1}C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
};
