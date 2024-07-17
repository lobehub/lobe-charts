import chroma from 'chroma-js';

const isstringScale = (colors: Array<unknown>, size: number) => {
  const invalidstring = colors.find((color) => !chroma.valid(color));

  if (invalidstring) {
    throw new Error(
      `Invalid color "${String(invalidstring)}" passed. All CSS color formats are accepted.`,
    );
  }

  return colors.length === size;
};

const createstringScale = (colors: [from: string, to: string], size: number): string[] => {
  return chroma.scale(colors).mode('lch').colors(size);
};

const validateTheme = (input: string[], size: number) => {
  if (typeof input !== 'object' || input === undefined) {
    throw new Error(
      `The theme object must contain at least one of the fields "light" and "dark" with exactly 2 or ${size} colors respectively.`,
    );
  }

  if (input) {
    const { length } = input;
    if (length !== 2 && length !== size) {
      throw new Error(`theme.light must contain exactly 2 or ${size} colors, ${length} passed.`);
    }
  }
};

const createDefaultTheme = (size: number): string[] => {
  return createstringScale(['hsl(0, 0%, 20%)', 'hsl(0, 0%, 92%)'], size);
};

export function createTheme(input?: string[], size: number = 5): string[] {
  const defaultTheme = createDefaultTheme(size);

  if (input) {
    validateTheme(input, size);

    const theme = input ?? defaultTheme;

    // @ts-ignore
    return isstringScale(theme, size) ? theme : createstringScale(theme, size);
  }

  return defaultTheme;
}

export const convertAlphaToSolid = (foreground: string, background: string): string => {
  const fgColor = chroma(foreground);
  const bgColor = chroma(background);

  const alpha = fgColor.alpha();
  const alphaComplement = 1 - alpha;

  const mixedColor = [
    fgColor.get('rgb.r') * alpha + bgColor.get('rgb.r') * alphaComplement,
    fgColor.get('rgb.g') * alpha + bgColor.get('rgb.g') * alphaComplement,
    fgColor.get('rgb.b') * alpha + bgColor.get('rgb.b') * alphaComplement,
  ];

  const resultColor = chroma(mixedColor);

  return resultColor.hex();
};
