import { cssVar, cx } from '@lobehub/ui';

import { mapStyles as styles } from './styles';

export interface PinProps {
  active?: boolean;
  description?: string;
  interactive?: boolean;
  label?: string;
  n: number;
  /** Plain dot instead of the number (single-place cards). */
  plain?: boolean;
  /** Show the name / description bubble while active. */
  popup?: boolean;
}

// Adapted from CopilotKit a2ui-playground (MIT): map-canvas.tsx `Pin`.
export const Pin = ({ n, active, plain, label, description, interactive, popup }: PinProps) => (
  <div
    className={cx(styles.pin, interactive && styles.pinInteractive, active && styles.pinActive)}
    title={popup && active ? undefined : label || undefined}
  >
    <div className={styles.pinHead}>
      <span className={styles.pinLabel}>{plain ? <span className={styles.pinPlainDot} /> : n}</span>
    </div>
    <span className={styles.pinShadow} />
    {active ? <span className={styles.pinPulse} /> : null}
    {popup && active && label ? (
      <div className={styles.popup} role="tooltip">
        <div className={styles.popupTitle}>{label}</div>
        {description ? <div className={styles.popupDescription}>{description}</div> : null}
      </div>
    ) : null}
  </div>
);

export interface EndPinProps {
  kind: 'start' | 'end';
  /** Colour of the start pin (the destination uses the accent). */
  startColor: string;
}

// Adapted from CopilotKit a2ui-playground (MIT): map-canvas.tsx `EndPin`.
export const EndPin = ({ kind, startColor }: EndPinProps) => {
  const start = kind === 'start';
  const color = start ? startColor : 'var(--map-accent)';
  return (
    <div className={styles.endPin} data-kind={kind}>
      <span
        className={styles.endPinHalo}
        style={{ background: `color-mix(in srgb, ${color} ${start ? 20 : 25}%, transparent)` }}
      />
      <span className={styles.endPinDot} style={{ background: color }}>
        {start ? null : <span className={styles.endPinInner} />}
      </span>
    </div>
  );
};

/** Default start colour: the theme success colour. */
export const START_COLOR = cssVar.colorSuccess;
