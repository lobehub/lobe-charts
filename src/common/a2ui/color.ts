import { cssVar } from '@lobehub/ui';
import chroma from 'chroma-js';

/** Text colour that reads on a solid `color` fill: near-black on light fills, white on dark ones. */
export const readableInk = (color: string) => {
  try {
    return chroma(color).luminance() > 0.36 ? 'rgba(0, 0, 0, 0.88)' : '#fff';
  } catch {
    // CSS variables and other non-literal colours: fall back to the theme text colour.
    return cssVar.colorText;
  }
};
