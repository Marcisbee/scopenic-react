import dlv from 'dlv';
import React, { useLayoutEffect, useRef } from 'react';

import { useRefsContext } from '../../../../../../utils/refs-context';
import { EditorStore, parsePath } from '../../../../context/editor-context';
import { useOverlayContext } from '../../context/overlay';

import overlayCss from './overlay.inline.scss';

function getPosition(frame: HTMLIFrameElement, element: any): Record<string, number> {
  if (!element || !frame || !frame.contentDocument) {
    return {};
  }

  const target = frame.contentDocument.getElementById(element.id);

  if (!target || !target.getBoundingClientRect) {
    return {};
  }

  // @TODO: Figure out less expensive solution
  return target.getBoundingClientRect() as any || {};
}

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

function HorizontalHandler({
  type = 'padding',
  direction = 'left',
  state,
  setState,
  onFinish,
}: any) {
  const [down, setDown] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const { x } = useWindowMousePosition();

  function mouseDown() {
    setPosition(x);
    setDown(true);
  }

  function mouseUp() {
    setDown(false);

    const diff = x - position;

    onFinish({
      value: state,
      diff,
    });
  }

  React.useEffect(() => {
    if (down) {
      const diff = x - position;
      // if (direction === 'right') {
      //   if (state - diff >= 0) {
      //     setPosition(x);
      //   }
      //   setState((s: number) => Math.max(0, s - diff));
      //   onFinish({
      //     value: state,
      //     diff,
      //   });
      //   return;
      // }

      if (state + diff >= 0) {
        setPosition(x);
      }
      setState((s: number) => Math.max(0, s + diff));
      onFinish({
        value: state,
        diff,
      });
    }
  }, [state, down, x, position]);

  return (
    <div
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      className={`selector-${type}-${direction}-handler ${down && 'active'}`}
      style={{ width: state }}
    >
      <span>{state >= 30 && state + 'px'}</span>
    </div>
  );
}

function SizeHandler({ direction = 'right', state, setState, onFinish }: any) {
  const [down, setDown] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const { x } = useWindowMousePosition();

  function mouseDown() {
    setPosition(x);
    setDown(true);
  }

  function mouseUp() {
    setDown(false);
  }

  React.useEffect(() => {
    if (down) {
      const diff = x - position;
      // if (direction === "right") {
      //   if (state - diff >= 0) {
      //     setPosition(x);
      //   }
      //   setState(state => Math.max(0, state - diff));
      //   return;
      // }

      if (state + diff >= 0) {
        setPosition(x);
      }
      setState((s: number) => Math.max(0, s + diff));
      onFinish({
        value: state,
        diff,
      });
    }
  }, [state, down, x, position]);

  return (
    <div
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      className={`selector-width-${direction}-handler ${down && 'active'}`}
    >
      <span>{state >= 30 && state + 'px'}</span>
    </div>
  );
}

const Overlay: React.FC = () => {
  const refs = useRefsContext();
  const el = useRef<HTMLDivElement>(null);
  const [overlayContext, setOverlayContext] = useOverlayContext();

  const node: HTMLIFrameElement = (refs.workspace.current as any).node;

  const { element, position } = overlayContext;
  const currentPosition = getPosition(node, element);

  const { updateStylePropery } = EditorStore.useStoreActions((s) => s);

  const [marginTop, setMarginTop] = React.useState(0);
  const [marginBottom, setMarginBottom] = React.useState(0);
  const [marginLeft, setMarginLeft] = React.useState(0);
  const [marginRight, setMarginRight] = React.useState(0);

  const [paddingTop, setPaddingTop] = React.useState(0);
  const [paddingBottom, setPaddingBottom] = React.useState(0);
  const [paddingLeft, setPaddingLeft] = React.useState(0);
  const [paddingRight, setPaddingRight] = React.useState(0);

  const [width, setWidth] = React.useState(0);

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

        if (refs.activeElement) {
          Object.assign(
            refs.activeElement,
            {
              current: null,
            },
          );
        }
      }
    };
  }, [element]);

  const updateStyle = (property: string) => ({ value, diff }: { value: number, diff: number }) => {
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
            left: currentPosition.left || position.left,
            top: currentPosition.top || position.top,
            width: currentPosition.width || position.width,
            height: currentPosition.height || position.height,
          }}
        >
          <VerticalHandler
            type="margin"
            direction="top"
            state={marginTop}
            setState={setMarginTop}
            onFinish={updateStyle('marginTop')}
          />
          <VerticalHandler
            type="margin"
            direction="bottom"
            state={marginBottom}
            setState={setMarginBottom}
            onFinish={updateStyle('marginBottom')}
          />
          <HorizontalHandler
            type="margin"
            direction="left"
            state={marginLeft}
            setState={setMarginLeft}
            onFinish={updateStyle('marginLeft')}
          />
          <HorizontalHandler
            type="margin"
            direction="right"
            state={marginRight}
            setState={setMarginRight}
            onFinish={updateStyle('marginRight')}
          />

          <VerticalHandler
            direction="top"
            state={paddingTop}
            setState={setPaddingTop}
            onFinish={updateStyle('paddingTop')}
          />
          <VerticalHandler
            direction="bottom"
            state={paddingBottom}
            setState={setPaddingBottom}
            onFinish={updateStyle('paddingBottom')}
          />
          <HorizontalHandler
            direction="left"
            state={paddingLeft}
            setState={setPaddingLeft}
            onFinish={updateStyle('paddingLeft')}
          />
          <HorizontalHandler
            direction="right"
            state={paddingRight}
            setState={setPaddingRight}
            onFinish={updateStyle('paddingRight')}
          />
          <SizeHandler
            direction="right"
            state={width}
            setState={setWidth}
            onFinish={updateStyle('width')}
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
