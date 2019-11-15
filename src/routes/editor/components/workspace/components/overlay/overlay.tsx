import dlv from 'dlv';
import React, { useLayoutEffect, useRef } from 'react';

import { useRefsContext } from '../../../../../../utils/refs-context';
import { EditorStore, parsePath } from '../../../../context/editor-context';
import { useOverlayContext } from '../../context/overlay';

import overlayCss from './overlay.inline.scss';

function useWindowMousePosition() {
  const refs = useRefsContext();

  const [WindowMousePosition, setWindowMousePosition] = React.useState<{
    x: number,
    y: number,
  }>({
    x: 0,
    y: 0,
  });

  function handleMouseMove(e: any) {
    setWindowMousePosition({
      x: e.pageX,
      y: e.pageY,
    });
  }

  React.useEffect(() => {
    if (!refs.workspace.current) {
      return;
    }

    const node: HTMLIFrameElement = (refs.workspace.current as any).node;

    if (!node) {
      return;
    }

    const iframeWindow = node.contentWindow;

    if (!iframeWindow) {
      return;
    }

    iframeWindow.addEventListener('mousemove', handleMouseMove);

    return () => {
      iframeWindow.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return WindowMousePosition;
}

function VerticalHandler({
  type = 'padding',
  direction = 'top',
  state,
  setState,
  onFinish,
}: any) {
  const [down, setDown] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const { y } = useWindowMousePosition();

  function mouseDown() {
    setPosition(y);
    setDown(true);
  }

  function mouseUp() {
    setDown(false);

    const diff = y - position;

    onFinish({
      value: state,
      diff,
    });
  }

  useLayoutEffect(() => {
    if (down) {
      const diff = y - position;
      if (state + diff >= 0) {
        setPosition(y);
      }
      setState((s: any) => Math.max(0, s + diff));
      onFinish({
        value: state,
        diff,
      });
    }
  }, [state, down, y, position]);

  return (
    <div
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      className={`selector-${type}-${direction}-handler ${down && 'active'}`}
      style={{ height: state, lineHeight: state + 'px' }}
    >
      <span>{state >= 30 && state + 'px'}</span>
    </div>
  );
}

const Overlay: React.FC = () => {
  const { updateStylePropery } = EditorStore.useStoreActions((s) => s);
  const [marginTop, setMarginTop] = React.useState(0);
  const [marginBottom, setMarginBottom] = React.useState(0);
  // const [marginBottom, setMarginBottom] = React.useState(0);
  // const [marginLeft, setMarginLeft] = React.useState(0);
  // const [marginRight, setMarginRight] = React.useState(0);

  const el = useRef<HTMLDivElement>(null);
  const [overlayContext, setOverlayContext] = useOverlayContext();

  const {
    element,
    position,
  } = overlayContext;

  const { pathFull } = parsePath(element ? element.path : []);

  const item = EditorStore.useStoreState((s) => (
    dlv(s.state.data.pages[s.state.activePage], pathFull)
  ));

  useLayoutEffect(() => {
    if (!el.current) {
      return;
    }

    const handleLeave = (e: MouseEvent) => {
      e.preventDefault();

      setOverlayContext((draft) => {
        draft.element = null;
        draft.position = null;
      });
    };

    el.current.addEventListener('mouseleave', handleLeave);

    return () => {
      if (el.current) {
        el.current.removeEventListener('mouseleave', handleLeave);
      }
    };
  }, [element]);

  const updateStyle = (property: string, type: 'top' | 'bottom' | 'left' | 'right') => ({ value, diff }: { value: number, diff: number }) => {
    const data = item || element;

    if (!data) {
      return;
    }

    updateStylePropery({
      id: data.id,
      className: data.className,
      property,
      value: `${value}px`,
    });

    setOverlayContext((draft) => {
      if (draft.position) {
        draft.position[type] += diff;
      }
    });
  };

  return (
    <div>
      <style>
        {overlayCss}
      </style>

      {position && (
        <div
          className="selector"
          ref={el}
          style={{
            left: position.left,
            top: position.top,
            width: position.width,
            height: position.height,
            // marginTop,
          }}
        >
          <VerticalHandler
            type="margin"
            direction="top"
            state={marginTop}
            setState={setMarginTop}
            onFinish={updateStyle('marginTop', 'top')}
          />
          <VerticalHandler
            type="margin"
            direction="bottom"
            state={marginBottom}
            setState={setMarginBottom}
            onFinish={updateStyle('marginBottom', 'bottom')}
          />
        </div>
      )}

      <pre>{JSON.stringify({
        element: overlayContext.element,
        position: overlayContext.position,
      }, null, ' ')}</pre>
    </div>
  );
};

export default Overlay;
