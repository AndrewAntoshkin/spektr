export interface BoxSides {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ElementSpecs {
  tagName: string;
  id: string;
  className: string;
  rect: DOMRect;

  width: number;
  height: number;
  padding: BoxSides;
  margin: BoxSides;

  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  color: string;

  backgroundColor: string;
  borderRadius: string;
  border: string;
  boxShadow: string;
  opacity: string;

  display: string;
  position: string;
  gap: string;
}

function px(v: string): number {
  return parseFloat(v) || 0;
}

export function computeSpecs(el: Element): ElementSpecs {
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();

  return {
    tagName: el.tagName.toLowerCase(),
    id: el.id,
    className:
      el.className && typeof el.className === "string"
        ? el.className.split(/\s+/).slice(0, 3).join(" ")
        : "",
    rect,

    width: rect.width,
    height: rect.height,

    padding: {
      top: px(cs.paddingTop),
      right: px(cs.paddingRight),
      bottom: px(cs.paddingBottom),
      left: px(cs.paddingLeft),
    },
    margin: {
      top: px(cs.marginTop),
      right: px(cs.marginRight),
      bottom: px(cs.marginBottom),
      left: px(cs.marginLeft),
    },

    fontFamily: cs.fontFamily.split(",")[0].replace(/['"]/g, "").trim(),
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing === "normal" ? "0" : cs.letterSpacing,
    color: cs.color,

    backgroundColor: cs.backgroundColor,
    borderRadius: cs.borderRadius,
    border: cs.border === "none" ? "" : cs.border,
    boxShadow: cs.boxShadow === "none" ? "" : cs.boxShadow,
    opacity: cs.opacity,

    display: cs.display,
    position: cs.position,
    gap: cs.gap === "normal" ? "" : cs.gap,
  };
}

export function formatColor(raw: string): { hex: string; display: string } | null {
  if (!raw || raw === "transparent" || raw === "rgba(0, 0, 0, 0)") return null;

  const match = raw.match(
    /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/
  );
  if (!match) return { hex: raw, display: raw };

  const [, r, g, b, a] = match;
  const hex =
    "#" +
    [r, g, b].map((v) => Number(v).toString(16).padStart(2, "0")).join("");

  if (a !== undefined && parseFloat(a) < 1) {
    return { hex, display: `${hex} / ${Math.round(parseFloat(a) * 100)}%` };
  }
  return { hex, display: hex };
}

export function hasMeaningfulValue(sides: BoxSides): boolean {
  return sides.top > 0 || sides.right > 0 || sides.bottom > 0 || sides.left > 0;
}

export function formatSides(sides: BoxSides): string {
  const { top, right, bottom, left } = sides;
  if (top === right && right === bottom && bottom === left) return `${top}`;
  if (top === bottom && left === right) return `${top} ${right}`;
  return `${top} ${right} ${bottom} ${left}`;
}
