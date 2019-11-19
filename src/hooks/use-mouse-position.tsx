import { useCallback, useEffect, useRef, useState } from 'react';

interface IMousePosition {
  position: {
    x: number,
    y: number,
  };
  diff: {
    x: number,
    y: number,
  };
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<IMousePosition>({
    position: {
      x: 0,
      y: 0,
    },
    diff: {
      x: 0,
      y: 0,
    },
  });
  const prevPos = useRef(mousePosition.position);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const position = {
      x: e.pageX,
      y: e.pageY,
    };

    const diff = {
      x: position.x - prevPos.current.x,
      y: position.y - prevPos.current.y,
    };

    const nextPos: IMousePosition = {
      position,
      diff,
    };

    prevPos.current = { ...nextPos.position };
    setMousePosition(nextPos);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePosition;
}
