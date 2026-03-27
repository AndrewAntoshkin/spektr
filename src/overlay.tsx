import React from "react";
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

const GREEN = "rgba(34, 197, 94, 0.25)";
const ORANGE = "rgba(251, 146, 60, 0.25)";
const BORDER = "rgba(59, 130, 246, 0.8)";

export function Overlay({ specs }: OverlayProps) {
  const { rect, padding, margin } = specs;
  const sx = window.scrollX;
  const sy = window.scrollY;

  const bgColor = formatColor(specs.backgroundColor);
  const textColor = formatColor(specs.color);
  const tooltipPos = getPosition(specs);

  return (
    <>
      {/* Margin */}
      {hasMeaningfulValue(margin) && (
        <div
          style={{
            ...abs,
            top: rect.top + sy - margin.top,
            left: rect.left + sx - margin.left,
            width: rect.width + margin.left + margin.right,
            height: rect.height + margin.top + margin.bottom,
            background: ORANGE,
          }}
        />
      )}

      {/* Element border */}
      <div
        style={{
          ...abs,
          top: rect.top + sy,
          left: rect.left + sx,
          width: rect.width,
          height: rect.height,
          border: `1px solid ${BORDER}`,
        }}
      />

      {/* Padding */}
      {hasMeaningfulValue(padding) && (
        <>
          {padding.top > 0 && (
            <div style={{ ...abs, top: rect.top + sy, left: rect.left + sx, width: rect.width, height: padding.top, background: GREEN }} />
          )}
          {padding.bottom > 0 && (
            <div style={{ ...abs, top: rect.bottom + sy - padding.bottom, left: rect.left + sx, width: rect.width, height: padding.bottom, background: GREEN }} />
          )}
          {padding.left > 0 && (
            <div style={{ ...abs, top: rect.top + sy + padding.top, left: rect.left + sx, width: padding.left, height: rect.height - padding.top - padding.bottom, background: GREEN }} />
          )}
          {padding.right > 0 && (
            <div style={{ ...abs, top: rect.top + sy + padding.top, left: rect.right + sx - padding.right, width: padding.right, height: rect.height - padding.top - padding.bottom, background: GREEN }} />
          )}
        </>
      )}

      {/* Dimension label */}
      <div
        style={{
          ...abs,
          ...mono,
          top: rect.top + sy - 24,
          left: rect.left + sx,
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
          ...tooltipPos,
          background: "#1a1a1a",
          color: "#e5e5e5",
          fontSize: "12px",
          fontFamily: mono.fontFamily,
          lineHeight: "1.5",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          maxWidth: "320px",
          zIndex: 2147483647,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ color: "#93c5fd", marginBottom: "6px" }}>
          <span style={{ fontWeight: 600 }}>&lt;{specs.tagName}&gt;</span>
          {specs.id && <span style={{ color: "#fbbf24" }}> #{specs.id}</span>}
        </div>

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

        {(hasMeaningfulValue(padding) || hasMeaningfulValue(margin)) && (
          <Section label="Spacing">
            {hasMeaningfulValue(padding) && <Row label="padding" value={formatSides(padding)} />}
            {hasMeaningfulValue(margin) && <Row label="margin" value={formatSides(margin)} />}
            {specs.gap && <Row label="gap" value={specs.gap} />}
          </Section>
        )}

        {(bgColor || specs.borderRadius !== "0px" || specs.boxShadow) && (
          <Section label="Visual">
            {bgColor && (
              <Row label="bg" value={bgColor.display}>
                <Swatch color={bgColor.hex} />
              </Row>
            )}
            {specs.borderRadius !== "0px" && <Row label="radius" value={specs.borderRadius} />}
            {specs.boxShadow && <Row label="shadow" value="present" />}
          </Section>
        )}

        <Section label="Layout">
          <Row label="display" value={specs.display} />
          {specs.position !== "static" && <Row label="position" value={specs.position} />}
        </Section>
      </div>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "6px" }}>
      <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#737373", letterSpacing: "0.05em", marginBottom: "2px" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
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
  const sx = window.scrollX;
  const sy = window.scrollY;
  const gap = 10;
  const tooltipW = 280;
  const tooltipH = 220;

  const fitsRight = rect.right + gap + tooltipW < window.innerWidth;
  const fitsLeft = rect.left - gap - tooltipW > 0;
  const fitsBelow = rect.bottom + gap + tooltipH < window.innerHeight;

  if (fitsRight) {
    return { top: rect.top + sy, left: rect.right + sx + gap };
  }
  if (fitsLeft) {
    return { top: rect.top + sy, left: rect.left + sx - gap - tooltipW };
  }
  if (fitsBelow) {
    return { top: rect.bottom + sy + gap, left: rect.left + sx };
  }
  return { top: Math.max(4, rect.top + sy - tooltipH - gap), left: rect.left + sx };
}

const abs: React.CSSProperties = {
  position: "absolute",
  pointerEvents: "none",
};

const mono: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
};
