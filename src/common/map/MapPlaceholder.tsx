import { cx } from '@lobehub/ui';
import { MapPin, MapPinOff } from 'lucide-react';
import type { ReactNode } from 'react';

import { mapStyles as styles } from './styles';

export interface MapPlaceholderProps {
  /** `loading` shimmers; `empty` waits for coordinates; `unavailable` means MapLibre did not load. */
  kind?: 'loading' | 'empty' | 'unavailable';
  label?: ReactNode;
}

const LABELS = {
  empty: 'Waiting for locations',
  loading: 'Loading map',
  unavailable: 'Map unavailable',
};

// Adapted from CopilotKit a2ui-playground (MIT): maps.tsx `MapSkeleton`.
const MapPlaceholder = ({ kind = 'loading', label }: MapPlaceholderProps) => {
  const Icon = kind === 'unavailable' ? MapPinOff : MapPin;
  return (
    <div className={styles.placeholder} data-map-state={kind}>
      {kind === 'unavailable' ? null : <div className={styles.shimmer} />}
      <div className={styles.placeholderBody} role={kind === 'unavailable' ? 'alert' : 'status'}>
        <span className={styles.placeholderIcon}>
          <Icon className={cx(kind !== 'unavailable' && styles.placeholderPulse)} size={16} />
        </span>
        <span>{label ?? LABELS[kind]}</span>
      </div>
    </div>
  );
};

export default MapPlaceholder;
