import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { LucideIcon } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

export interface ScrollButtonProps {
  disabled?: boolean;
  icon: LucideIcon;
  onClick?: () => void;
}

const ScrollButton = memo<ScrollButtonProps>(({ icon, onClick, disabled }) => {
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<any | null>(null);

  useEffect(() => {
    if (isPressed) {
      intervalRef.current = setInterval(() => {
        onClick?.();
      }, 300);
    } else {
      clearInterval(intervalRef.current as any);
    }
    return () => clearInterval(intervalRef.current as any);
  }, [isPressed, onClick]);

  useEffect(() => {
    if (disabled) {
      clearInterval(intervalRef.current as any);
      setIsPressed(false);
    }
  }, [disabled]);

  return (
    <Button
      disabled={disabled}
      icon={<Icon className={'w-full'} icon={icon} />}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setIsPressed(true);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        setIsPressed(false);
      }}
      size={'small'}
      style={{
        height: 24,
        width: 24,
      }}
    />
  );
});

export default ScrollButton;
