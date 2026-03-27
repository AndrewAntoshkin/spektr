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
  /** Key to hold for inspection. Default: "Alt" */
  hotkey?: string;
}

export function Spektr({
  children,
  enabled = true,
  hotkey = "Alt",
}: SpektrProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hotkeyPressed, setHotkeyPressed] = useState(false);
  const [target, setTarget] = useState<Element | null>(null);
  const [specs, setSpecs] = useState<ElementSpecs | null>(null);
  const [pinned, setPinned] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const onDown = (e: KeyboardEvent) => {
      if (e.key === hotkey) setHotkeyPressed(true);
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === hotkey) {
        setHotkeyPressed(false);
        if (!pinned) {
          setTarget(null);
          setSpecs(null);
        }
      }
    };
    const onBlur = () => {
      setHotkeyPressed(false);
      if (!pinned) {
        setTarget(null);
        setSpecs(null);
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [enabled, hotkey, pinned]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!hotkeyPressed || !enabled || pinned) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el === containerRef.current) {
          setTarget(null);
          setSpecs(null);
          return;
        }
        if (el === target) return;
        setTarget(el);
        setSpecs(computeSpecs(el));
      });
    },
    [hotkeyPressed, enabled, pinned, target]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!hotkeyPressed || !enabled) return;
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        setPinned((p) => !p);
      }
    },
    [hotkeyPressed, enabled, target]
  );

  useEffect(() => {
    if (!enabled) {
      setTarget(null);
      setSpecs(null);
      setPinned(false);
    }
  }, [enabled]);

  const showOverlay = enabled && specs && target && (hotkeyPressed || pinned);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClickCapture={handleClick}
      style={{
        cursor: hotkeyPressed && enabled ? "crosshair" : undefined,
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
