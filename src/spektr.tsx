import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { computeSpecs, type ElementSpecs } from "./compute-specs";
import { Overlay } from "./overlay";

export interface SpektrProps {
  children: React.ReactNode;
  /** Enable/disable the overlay. Default: true */
  enabled?: boolean;
}

export function Spektr({ children, enabled = true }: SpektrProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [target, setTarget] = useState<Element | null>(null);
  const [specs, setSpecs] = useState<ElementSpecs | null>(null);
  const [pinned, setPinned] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  const inspect = useCallback(
    (x: number, y: number) => {
      if (!enabled || pinned) return;
      const el = document.elementFromPoint(x, y);
      if (!el || el === containerRef.current) {
        setTarget(null);
        setSpecs(null);
        return;
      }
      setTarget(el);
      setSpecs(computeSpecs(el));
    },
    [enabled, pinned]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;

      lastMousePos.current = { x: e.clientX, y: e.clientY };
      const isAlt = e.altKey;
      setActive(isAlt);

      if (!isAlt && !pinned) {
        setTarget(null);
        setSpecs(null);
        return;
      }

      if (isAlt && !pinned) {
        inspect(e.clientX, e.clientY);
      }
    },
    [enabled, pinned, inspect]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!e.altKey || !enabled) return;
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        setPinned((p) => {
          if (p) {
            setTarget(null);
            setSpecs(null);
          }
          return !p;
        });
      }
    },
    [enabled, target]
  );

  // When Alt is pressed while mouse is stationary, start inspecting
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt" && lastMousePos.current) {
        setActive(true);
        inspect(lastMousePos.current.x, lastMousePos.current.y);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setActive(false);
        if (!pinned) {
          setTarget(null);
          setSpecs(null);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [enabled, pinned, inspect]);

  // Handle mouse leaving the window
  const handleMouseLeave = useCallback(() => {
    setActive(false);
    lastMousePos.current = null;
    if (!pinned) {
      setTarget(null);
      setSpecs(null);
    }
  }, [pinned]);

  useEffect(() => {
    if (!enabled) {
      setTarget(null);
      setSpecs(null);
      setPinned(false);
      setActive(false);
    }
  }, [enabled]);

  const showOverlay = enabled && specs && target && (active || pinned);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClickCapture={handleClick}
      style={{
        cursor: active && enabled ? "crosshair" : undefined,
      }}
    >
      {children}

      {showOverlay &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              overflow: "visible",
              pointerEvents: "none",
              zIndex: 2147483646,
            }}
          >
            <Overlay specs={specs} target={target} />
            {pinned && (
              <div
                style={{
                  position: "fixed",
                  bottom: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.75)",
                  color: "#e5e5e5",
                  fontSize: "12px",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                  padding: "4px 12px",
                  borderRadius: "6px",
                  zIndex: 2147483647,
                }}
              >
                Pinned — Alt+click to unpin
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
