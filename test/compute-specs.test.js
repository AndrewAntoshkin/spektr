import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Test the pure utility functions from the built output
const {
  formatColor,
  formatSides,
  hasMeaningfulValue,
} = await import("../dist/index.js");

describe("formatColor", () => {
  it("parses rgb values to hex", () => {
    const result = formatColor("rgb(255, 0, 128)");
    assert.equal(result.hex, "#ff0080");
    assert.equal(result.display, "#ff0080");
  });

  it("parses rgba with alpha", () => {
    const result = formatColor("rgba(0, 0, 0, 0.5)");
    assert.equal(result.hex, "#000000");
    assert.equal(result.display, "#000000 / 50%");
  });

  it("returns null for transparent", () => {
    assert.equal(formatColor("transparent"), null);
    assert.equal(formatColor("rgba(0, 0, 0, 0)"), null);
  });

  it("returns null for empty string", () => {
    assert.equal(formatColor(""), null);
  });

  it("passes through unknown formats", () => {
    const result = formatColor("hsl(180, 50%, 50%)");
    assert.equal(result.display, "hsl(180, 50%, 50%)");
  });
});

describe("formatSides", () => {
  it("formats uniform values as single number", () => {
    assert.equal(formatSides({ top: 16, right: 16, bottom: 16, left: 16 }), "16");
  });

  it("formats symmetric values as two numbers", () => {
    assert.equal(formatSides({ top: 8, right: 16, bottom: 8, left: 16 }), "8 16");
  });

  it("formats all-different as four numbers", () => {
    assert.equal(formatSides({ top: 1, right: 2, bottom: 3, left: 4 }), "1 2 3 4");
  });

  it("handles zeros", () => {
    assert.equal(formatSides({ top: 0, right: 0, bottom: 0, left: 0 }), "0");
  });
});

describe("hasMeaningfulValue", () => {
  it("returns false for all zeros", () => {
    assert.equal(hasMeaningfulValue({ top: 0, right: 0, bottom: 0, left: 0 }), false);
  });

  it("returns true if any side is non-zero", () => {
    assert.equal(hasMeaningfulValue({ top: 0, right: 0, bottom: 0, left: 8 }), true);
    assert.equal(hasMeaningfulValue({ top: 4, right: 0, bottom: 0, left: 0 }), true);
  });
});
