import React, { useEffect, useState } from "react";
import {
  type ElementSpecs,
  formatColor,
  hasMeaningfulValue,
  formatSides,
} from "./compute-specs";

interface OverlayProps {
  specs: ElementSpecs;
  target: Element;
}

const BLUE = "rgba(59, 130, 246, 0.5)";
const GREEN = "rgba(34, 197, 94, 0.25)";
const ORANGE = "rgba(251, 146, 60, 0.25)";
const BORDER = "rgba(59, 130, 246, 0.8)";

export function Overlay({ specs, target }: OverlayProps) {
  const [pos, setPos] = useState(getPosition(specs));

  useEffect(() => {
    const update = () => setPos(getPosition(specs));
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [specs]);

  const { rect, padding, margin } = specs;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const bgColor = formatColor(specs.backgroundColor);
  const textColor = formatColor(specs.color);

  return (
    <>
      {/* Margin overlay */}
      {hasMeaningfulValue(margin) && (
        <div
          style={{
            ...abs,
            top: rect.top + scrollY - margin.top,
            left: rect.left + scrollX - margin.left,
            width: rect.width + margin.left + margin.right,
            height: rect.height + margin.top + margin.bottom,
            background: ORANGE,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Element border */}
      <div
        style={{
          ...abs,
          top: rect.top + scrollY,
          left: rect.left + scrollX,
          width: rect.width,
          height: rect.height,
          border: `1px solid ${BORDER}`,
          pointerEvents: "none",
        }}
      />

      {/* Padding overlay */}
      {hasMeaningfulValue(padding) && (
        <>
          {padding.top > 0 && (
            <div
              style={{
                ...abs,
                top: rect.top + scrollY,
                left: rect.left + scrollX,
                width: rect.width,
                height: padding.top,
                background: GREEN,
                pointerEvents: "none",
              }}
            />
          )}
          {padding.bottom > 0 && (
            <div
              style={{
                ...abs,
                top: rect.bottom + scrollY - padding.bottom,
                left: rect.left + scrollX,
                width: rect.width,
                height: padding.bottom,
                background: GREEN,
                pointerEvents: "none",
              }}
            />
          )}
          {padding.left > 0 && (
            <div
              style={{
                ...abs,
                top: rect.top + scrollY + padding.top,
                left: rect.left + scrollX,
                width: padding.left,
                height: rect.height - padding.top - padding.bottom,
                background: GREEN,
                pointerEvents: "none",
              }}
            />
          )}
          {padding.right > 0 && (
            <div
              style={{
                ...abs,
                top: rect.top + scrollY + padding.top,
                left: rect.right + scrollX - padding.right,
                width: padding.right,
                height: rect.height - padding.top - padding.bottom,
                background: GREEN,
                pointerEvents: "none",
              }}
            />
          )}
        </>
      )}

      {/* Dimension label */}
      <div
        style={{
          ...abs,
          ...tooltipBase,
          top: rect.top + scrollY - 24,
          left: rect.left + scrollX,
          background: "rgba(59, 130, 246, 0.9)",
          color: "#fff",
          fontSize: "11px",
          padding: "2px 6px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
        }}
      >
        {Math.round(specs.width)} × {Math.round(specs.height)}
      </div>

      {/* Spec tooltip */}
      <div
        style={{
          ...abs,
          ...pos,
          background: "#1a1a1a",
          color: "#e5e5e5",
          fontSize: "12px",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
          lineHeight: "1.5",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          maxWidth: "320px",
          zIndex: 2147483647,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {/* Tag */}
        <div style={{ color: "#93c5fd", marginBottom: "6px" }}>
          <span style={{ fontWeight: 600 }}>&lt;{specs.tagName}&gt;</span>
          {specs.id && (
            <span style={{ color: "#fbbf24" }}> #{specs.id}</span>
          )}
        </div>

        {/* Typography */}
        <Section label="Typography">
          <Row label="font" value={`${specs.fontSize} / ${specs.lineHeight}`} />
          <Row label="weight" value={specs.fontWeight} />
          <Row label="family" value={specs.fontFamily} />
          {textColor && (
            <Row label="color" value={textColor.display}>
              <Swatch color={textColor.hex} />
            </Row>
          )}
        </Section>

        {/* Spacing */}
        {(hasMeaningfulValue(padding) || hasMeaningfulValue(margin)) && (
          <Section label="Spacing">
            {hasMeaningfulValue(padding) && (
              <Row label="padding" value={formatSides(padding)} />
            )}
            {hasMeaningfulValue(margin) && (
              <Row label="margin" value={formatSides(margin)} />
            )}
            {specs.gap && <Row label="gap" value={specs.gap} />}
          </Section>
        )}

        {/* Visual */}
        {(bgColor || specs.borderRadius !== "0px" || specs.boxShadow) && (
          <Section label="Visual">
            {bgColor && (
              <Row label="bg" value={bgColor.display}>
                <Swatch color={bgColor.hex} />
              </Row>
            )}
            {specs.borderRadius !== "0px" && (
              <Row label="radius" value={specs.borderRadius} />
            )}
            {specs.boxShadow && <Row label="shadow" value="present" />}
          </Section>
        )}

        {/* Layout */}
        <Section label="Layout">
          <Row label="display" value={specs.display} />
          {specs.position !== "static" && (
            <Row label="position" value={specs.position} />
          )}
        </Section>
      </div>
    </>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "6px" }}>
      <div
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          color: "#737373",
          letterSpacing: "0.05em",
          marginBottom: "2px",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ color: "#a3a3a3", minWidth: "52px" }}>{label}</span>
      {children}
      <span style={{ color: "#e5e5e5" }}>{value}</span>
    </div>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRadius: "2px",
        background: color,
        border: "1px solid rgba(255,255,255,0.2)",
        flexShrink: 0,
      }}
    />
  );
}

function getPosition(specs: ElementSpecs): React.CSSProperties {
  const { rect } = specs;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const gap = 8;

  const fitsRight = rect.right + gap + 320 < window.innerWidth;
  const fitsBelow = rect.bottom + gap + 200 < window.innerHeight;

  if (fitsRight) {
    return {
      top: rect.top + scrollY,
      left: rect.right + scrollX + gap,
    };
  }
  if (fitsBelow) {
    return {
      top: rect.bottom + scrollY + gap,
      left: rect.left + scrollX,
    };
  }
  return {
    top: rect.top + scrollY,
    left: Math.max(4, rect.left + scrollX - 320 - gap),
  };
}

const abs: React.CSSProperties = {
  position: "absolute",
  pointerEvents: "none",
};

const tooltipBase: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
};
