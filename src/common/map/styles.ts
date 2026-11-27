import { createStaticStyles, keyframes } from '@lobehub/ui';

// Adapted from CopilotKit a2ui-playground (MIT): renderers/map/map.css, map-canvas.tsx `Pin` / `EndPin` and
// maps.tsx `MapSkeleton`. Colours are LobeHub tokens; the accent comes in as `--map-accent`.

const shimmer = keyframes`
  from { background-position: 150% 0; }
  to { background-position: -50% 0; }
`;

const pinDrop = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: none; }
`;

const pinPulse = keyframes`
  0% { opacity: 0.7; transform: translate(-50%, 50%) scale(0.6); }
  100% { opacity: 0; transform: translate(-50%, 50%) scale(2.4); }
`;

export const mapStyles = createStaticStyles(({ css, cssVar }) => ({
  canvas: css`
    position: relative;

    overflow: hidden;

    width: 100%;
    height: 100%;

    background: ${cssVar.colorFillQuaternary};

    /* MapLibre's stylesheet loads after ours, so every override carries the extra root class. */
    & .maplibregl-map {
      font: inherit;
    }

    & .maplibregl-canvas {
      outline: none;
    }

    & .maplibregl-map .maplibregl-ctrl-bottom-right,
    & .maplibregl-map .maplibregl-ctrl-top-right {
      z-index: 3;
    }

    & .maplibregl-map .maplibregl-ctrl-group {
      overflow: hidden;

      border: 1px solid ${cssVar.colorBorderSecondary};
      border-radius: 9px;

      background: color-mix(in srgb, ${cssVar.colorBgElevated} 92%, transparent);
      backdrop-filter: blur(6px);
      box-shadow: ${cssVar.boxShadowSecondary};
    }

    & .maplibregl-map .maplibregl-ctrl-group button {
      width: 26px;
      height: 26px;
    }

    & .maplibregl-map .maplibregl-ctrl-group button + button {
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    & .maplibregl-map .maplibregl-ctrl-group button:not(:disabled):hover {
      background: ${cssVar.colorFillTertiary};
    }

    & .maplibregl-map .maplibregl-ctrl-attrib {
      border-radius: 6px 0 0;

      font-size: 9.5px;
      line-height: 1.5;
      color: ${cssVar.colorTextSecondary};

      background: color-mix(in srgb, ${cssVar.colorBgElevated} 80%, transparent);
      backdrop-filter: blur(6px);
    }

    & .maplibregl-map .maplibregl-ctrl-attrib a {
      color: inherit;
    }

    & .maplibregl-map .maplibregl-ctrl-attrib a:hover {
      color: ${cssVar.colorText};
    }

    & .maplibregl-map .maplibregl-ctrl-attrib.maplibregl-compact {
      min-height: 20px;
      margin-block: 0 6px;
      margin-inline: 0 6px;
      padding-block: 0;
      padding-inline: 0 22px;
      border-radius: 999px;
    }

    & .maplibregl-map .maplibregl-ctrl-attrib.maplibregl-compact-show {
      padding-block: 2px;
      padding-inline: 8px 26px;
      border-radius: 10px;
    }

    & .maplibregl-map .maplibregl-ctrl-attrib-button {
      width: 20px;
      height: 20px;
      background-color: transparent;
    }
  `,
  /** Dark theme: the controls take dark tokens, so the black MapLibre icons are inverted. */
  canvasDark: css`
    & .maplibregl-map .maplibregl-ctrl-group button .maplibregl-ctrl-icon,
    & .maplibregl-map .maplibregl-ctrl-attrib-button {
      filter: invert(1) opacity(0.7);
    }
  `,
  canvasLight: css`
    & .maplibregl-map .maplibregl-ctrl-group button .maplibregl-ctrl-icon {
      opacity: 0.75;
    }

    & .maplibregl-map .maplibregl-ctrl-attrib-button {
      opacity: 0.6;
    }
  `,
  endPin: css`
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    animation: ${pinDrop} 420ms cubic-bezier(0.22, 1, 0.36, 1) both;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
  endPinDot: css`
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    width: 15px;
    height: 15px;
    border: 2px solid ${cssVar.colorWhite};
    border-radius: 50%;

    box-shadow: 0 2px 8px ${cssVar.colorBgMask};
  `,
  endPinHalo: css`
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  `,
  endPinInner: css`
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${cssVar.colorWhite};
  `,
  fade: css`
    pointer-events: none;

    position: absolute;
    z-index: 4;
    inset-block-end: 0;
    inset-inline: 0;

    height: 40px;
  `,
  pin: css`
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    animation: ${pinDrop} 420ms cubic-bezier(0.22, 1, 0.36, 1) both;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
  pinActive: css`
    && > div:nth-of-type(1) {
      transform: rotate(45deg) scale(1.18);
      border-color: ${cssVar.colorWhite};
      background: color-mix(in srgb, var(--map-accent) 78%, ${cssVar.colorWhite});
      box-shadow:
        0 0 0 4px color-mix(in srgb, var(--map-accent) 28%, transparent),
        0 8px 18px -4px ${cssVar.colorBgMask};
    }
  `,
  pinHead: css`
    position: relative;
    transform: rotate(45deg);

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    width: 26px;
    height: 26px;
    border: 1.5px solid color-mix(in srgb, ${cssVar.colorWhite} 85%, transparent);
    border-radius: 50% 50% 4px;

    background: var(--map-accent);
    box-shadow: 0 6px 14px -4px ${cssVar.colorBgMask};

    transition:
      transform 200ms ease-out,
      background 200ms ease-out,
      box-shadow 200ms ease-out;
  `,
  pinInteractive: css`
    cursor: pointer;

    &:hover > div:nth-of-type(1) {
      transform: rotate(45deg) scale(1.1);
      background: color-mix(in srgb, var(--map-accent) 85%, ${cssVar.colorWhite});
    }
  `,
  pinLabel: css`
    transform: rotate(-45deg);

    font-size: 11px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: ${cssVar.colorTextLightSolid};
  `,
  pinPlainDot: css`
    display: block;

    width: 8px;
    height: 8px;
    border-radius: 50%;

    background: ${cssVar.colorWhite};
  `,
  pinPulse: css`
    pointer-events: none;

    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 50%;

    width: 20px;
    height: 20px;
    border-radius: 50%;

    background: color-mix(in srgb, var(--map-accent) 50%, transparent);

    animation: ${pinPulse} 1.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
  pinShadow: css`
    display: block;

    width: 10px;
    height: 3px;
    margin-block-start: 3px;
    border-radius: 999px;

    background: ${cssVar.colorBgMask};
    filter: blur(1px);
  `,
  placeholder: css`
    position: absolute;
    z-index: 5;
    inset: 0;

    overflow: hidden;

    background-color: ${cssVar.colorFillQuaternary};
    background-image:
      linear-gradient(${cssVar.colorFillTertiary} 1px, transparent 1px),
      linear-gradient(90deg, ${cssVar.colorFillTertiary} 1px, transparent 1px);
    background-size: 28px 28px;
  `,
  placeholderBody: css`
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;

    padding: 16px;

    font-size: 11px;
    line-height: 1.5;
    color: ${cssVar.colorTextDescription};
    text-align: center;
  `,
  placeholderIcon: css`
    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    width: 32px;
    height: 32px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 50%;

    color: var(--map-accent, ${cssVar.colorTextSecondary});

    background: ${cssVar.colorFillTertiary};
  `,
  placeholderPulse: css`
    animation: map-placeholder-pulse 2s ease-in-out infinite;

    @keyframes map-placeholder-pulse {
      50% {
        opacity: 0.5;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
  popup: css`
    pointer-events: none;

    position: absolute;
    z-index: 30;
    inset-block-end: calc(100% + 10px);
    inset-inline-start: 50%;
    transform: translateX(-50%);

    width: max-content;
    max-width: 220px;
    padding-block: 6px;
    padding-inline: 10px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 10px;

    font-size: 12px;
    line-height: 1.4;
    color: ${cssVar.colorText};
    text-align: start;

    background: ${cssVar.colorBgElevated};
    box-shadow: ${cssVar.boxShadowSecondary};
  `,
  popupDescription: css`
    margin-block-start: 2px;
    font-size: 11.5px;
    color: ${cssVar.colorTextSecondary};
  `,
  popupTitle: css`
    font-weight: 600;
  `,
  shimmer: css`
    pointer-events: none;

    position: absolute;
    inset: 0;

    background: linear-gradient(
      90deg,
      transparent 0%,
      ${cssVar.colorFillTertiary} 50%,
      transparent 100%
    );
    background-size: 200% 100%;

    animation: ${shimmer} 1.6s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
}));
