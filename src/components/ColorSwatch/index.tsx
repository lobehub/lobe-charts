import { CSSProperties, memo } from 'react';

interface ColorSwatchProps {
  className?: string;
  color: string;
  size?: number;
  style?: CSSProperties;
}

const ColorSwatch = memo<ColorSwatchProps>(({ size = 8, color, ...rest }) => (
  <div style={{ background: color, borderRadius: '50%', height: size, width: size }} {...rest} />
));

export default ColorSwatch;
