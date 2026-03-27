import React, { useState, useRef, useEffect } from "react";
import { Spektr } from "spektr";

const EXAMPLES = ["Buttons", "Typography", "Card", "Form", "Badges", "Navigation", "Spacing", "List"] as const;
type Example = (typeof EXAMPLES)[number];
type Page = "getting-started" | "api" | "examples";

export function App() {
  const [page, setPage] = useState<Page>("getting-started");
  const [activeExample, setActiveExample] = useState<string>(EXAMPLES[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const go = (p: Page) => (e: React.MouseEvent) => { e.preventDefault(); setPage(p); window.scrollTo(0, 0); closeMenu(); };

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setPage("examples");
    closeMenu();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  useEffect(() => {
    if (page !== "examples") return;
    const sections = EXAMPLES.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { setActiveExample(e.target.id); break; }
      }
    }, { rootMargin: "-20% 0px -60% 0px" });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [page]);

  return (
    <Spektr>
      <button className={`menu-btn${menuOpen ? " open" : ""}`} aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
        <svg viewBox="0 0 24 24"><line className="line1" x1="3" y1="6" x2="21" y2="6"/><line className="line2" x1="3" y1="12" x2="21" y2="12"/><line className="line3" x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div className={`mobile-backdrop${menuOpen ? " open" : ""}`} onClick={closeMenu} />
      <div style={S.shell}>
        <nav style={S.sidebar} className={`mobile-sidebar${menuOpen ? " open" : ""}`}>
          <div style={S.sidebarInner}>
            <div style={S.brandRow}>
              <a href="https://antoshkin.tech" style={S.backBtn} aria-label="Back"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></a>
              <a href="#" onClick={go("getting-started")} style={S.brand}>Spektr</a>
            </div>
            <div style={S.navSection}>
              <p style={S.navLabel}>Basics</p>
              <a href="#" onClick={go("getting-started")} style={page === "getting-started" ? S.navActive : S.navItem}>Getting Started</a>
              <a href="#" onClick={go("api")} style={page === "api" ? S.navActive : S.navItem}>API</a>
            </div>
            <div style={S.navSection}>
              <p style={S.navLabel}>Examples</p>
              {EXAMPLES.map(ex => (
                <a key={ex} href="#" onClick={scrollTo(ex)} style={page === "examples" && activeExample === ex ? S.navActive : S.navItem}>{ex}</a>
              ))}
            </div>
            <div style={S.navSection}>
              <p style={S.navLabel}>Links</p>
              <a href="https://github.com/AndrewAntoshkin/spektr" target="_blank" rel="noopener" style={S.navItem}>GitHub</a>
              <a href="https://www.npmjs.com/package/@andrewaitken/spektr" target="_blank" rel="noopener" style={S.navItem}>npm</a>
            </div>
          </div>
          <a href="https://antoshkin.tech" target="_blank" rel="noopener" style={S.sidebarLink}>antoshkin.tech</a>
        </nav>
        <div className="spacer-col" style={{ width: 240, flexShrink: 0 }} />
        <main style={S.main}>
          <article style={S.article}>
            {page === "getting-started" && <GettingStarted onNext={go("api")} />}
            {page === "api" && <ApiPage onPrev={go("getting-started")} onNext={go("examples")} />}
            {page === "examples" && <ExamplesPage onPrev={go("api")} />}
          </article>
        </main>
      </div>
    </Spektr>
  );
}

/* =============== Getting Started =============== */

function GettingStarted({ onNext }: { onNext: (e: React.MouseEvent) => void }) {
  return (
    <>
      <h1 style={S.h1}>Getting Started</h1>
      <p style={S.lead}>Spektr is a design spec overlay for React. Hold Alt and hover any element to inspect spacing, typography, and colors — like Figma Inspect, but in the browser.</p>

      <Sect title="Installation">
        <p style={S.body}>Install via your package manager.</p>
        <Pre code="npm i @andrewaitken/spektr" />
      </Sect>

      <Sect title="Quick Start">
        <p style={S.body}>Wrap your app with <code style={S.ic}>&lt;Spektr&gt;</code>. Then hold <kbd style={S.kbd}>Alt</kbd> (Option on Mac) and hover any element.</p>
        <Pre code={`import { Spektr } from '@andrewaitken/spektr';

function App() {
  return (
    <Spektr>
      <YourApp />
    </Spektr>
  );
}`} />
      </Sect>

      <Sect title="What You See">
        <p style={S.body}>When inspecting, the overlay shows:</p>
        <div style={S.fl}>
          <Feature dot="#3b82f6" title="Element highlight" desc="Blue outline with dimensions (width × height)" />
          <Feature dot="#22c55e" title="Padding" desc="Green overlay showing inner spacing" />
          <Feature dot="#fb923c" title="Margin" desc="Orange overlay showing outer spacing" />
          <Feature dot="#555" title="Spec tooltip" desc="Typography, colors, border-radius, and layout info" />
        </div>
      </Sect>

      <Sect title="Pin Inspections">
        <p style={S.body}><kbd style={S.kbd}>Alt</kbd>+click on any element to pin the overlay. Click again to unpin. Useful for comparing specs across elements.</p>
      </Sect>

      <Sect title="Development Only">
        <p style={S.body}>Use the <code style={S.ic}>enabled</code> prop to disable Spektr in production.</p>
        <Pre code={`<Spektr enabled={process.env.NODE_ENV === 'development'}>
  <YourApp />
</Spektr>`} />
      </Sect>

      <Sect title="Props">
        <Table head={["Prop", "Type", "Default"]} rows={[
          ["children", "ReactNode", "—"],
          ["enabled", "boolean", "true"],
        ]} />
      </Sect>

      <Nav prev={null} next={{ label: "API", onClick: onNext }} />
    </>
  );
}

/* =============== API Reference =============== */

function ApiPage({ onPrev, onNext }: { onPrev: (e: React.MouseEvent) => void; onNext: (e: React.MouseEvent) => void }) {
  return (
    <>
      <h1 style={S.h1}>API Reference</h1>
      <p style={S.lead}>All components, utilities, and types exported from Spektr.</p>

      <Sect title="Anatomy">
        <p style={S.body}>Import the wrapper and add it around any part of your tree.</p>
        <Pre code={`import { Spektr } from '@andrewaitken/spektr';

export function App() {
  return (
    <Spektr>
      {/* your components here */}
    </Spektr>
  );
}`} />
      </Sect>

      <Sect title="Spektr">
        <p style={S.body}>The main wrapper component. Captures mouse events and renders the overlay via a React Portal.</p>
        <Table head={["Prop", "Type", "Default", "Description"]} rows={[
          ["children", "ReactNode", "—", "Content to make inspectable"],
          ["enabled", "boolean", "true", "Toggle overlay on/off"],
        ]} />
      </Sect>

      <Sect title="Overlay">
        <p style={S.body}>Low-level overlay component. Renders padding, margin, dimension label, and spec tooltip for a given <code style={S.ic}>ElementSpecs</code> object. Exported for custom implementations.</p>
        <Table head={["Prop", "Type", "Default", "Description"]} rows={[
          ["specs", "ElementSpecs", "—", "Computed specs for the target element"],
          ["target", "Element", "—", "The DOM element being inspected"],
        ]} />
      </Sect>

      <Sect title="computeSpecs(el)">
        <p style={S.body}>Extracts all visual properties from a DOM element using <code style={S.ic}>getComputedStyle()</code> and <code style={S.ic}>getBoundingClientRect()</code>.</p>
        <Pre code={`import { computeSpecs } from '@andrewaitken/spektr';

const el = document.querySelector('.my-button');
const specs = computeSpecs(el);

console.log(specs.fontSize);        // "14px"
console.log(specs.padding);         // { top: 8, right: 16, bottom: 8, left: 16 }
console.log(specs.backgroundColor); // "rgb(250, 250, 250)"`} />
      </Sect>

      <Sect title="ElementSpecs">
        <p style={S.body}>The full type returned by <code style={S.ic}>computeSpecs</code>.</p>
        <Table head={["Property", "Type", "Description"]} rows={[
          ["tagName", "string", "Lowercase tag (div, button…)"],
          ["id", "string", "Element id attribute"],
          ["className", "string", "First 3 class names"],
          ["rect", "DOMRect", "Bounding client rect"],
          ["width / height", "number", "Element dimensions in px"],
          ["padding", "BoxSides", "Computed padding"],
          ["margin", "BoxSides", "Computed margin"],
          ["fontFamily", "string", "First font family"],
          ["fontSize", "string", "e.g. \"16px\""],
          ["fontWeight", "string", "e.g. \"400\", \"600\""],
          ["lineHeight", "string", "e.g. \"24px\""],
          ["letterSpacing", "string", "\"0\" if normal"],
          ["color", "string", "Computed text color"],
          ["backgroundColor", "string", "Computed background"],
          ["borderRadius", "string", "e.g. \"8px\""],
          ["border", "string", "Computed border or empty"],
          ["boxShadow", "string", "Computed shadow or empty"],
          ["opacity", "string", "e.g. \"1\""],
          ["display", "string", "e.g. \"flex\", \"block\""],
          ["position", "string", "e.g. \"static\""],
          ["gap", "string", "Flex/grid gap or empty"],
        ]} />
      </Sect>

      <Sect title="BoxSides">
        <p style={S.body}>Numeric values for each side, used for padding and margin.</p>
        <Pre code={`interface BoxSides {
  top: number;
  right: number;
  bottom: number;
  left: number;
}`} />
      </Sect>

      <Sect title="Utility Functions">
        <p style={S.body}>Helper functions exported for custom overlay implementations.</p>
        <Table head={["Function", "Signature", "Description"]} rows={[
          ["formatColor", "(raw: string) → { hex, display } | null", "Converts rgb/rgba to hex. Returns null for transparent."],
          ["formatSides", "(sides: BoxSides) → string", "Formats sides into shorthand (e.g. \"8 16\")"],
          ["hasMeaningfulValue", "(sides: BoxSides) → boolean", "Returns true if any side > 0"],
        ]} />
      </Sect>

      <Sect title="Keyboard Shortcuts">
        <Table head={["Shortcut", "Action"]} rows={[
          ["Alt + hover", "Inspect element under cursor"],
          ["Alt + click", "Pin / unpin current inspection"],
          ["Release Alt", "Hide overlay (unless pinned)"],
        ]} />
      </Sect>

      <Nav prev={{ label: "Getting Started", onClick: onPrev }} next={{ label: "Examples", onClick: onNext }} />
    </>
  );
}

/* =============== Examples =============== */

function ExamplesPage({ onPrev }: { onPrev: (e: React.MouseEvent) => void }) {
  const [btnVariant, setBtnVariant] = useState<"primary" | "outline" | "ghost" | "pill" | "small">("primary");
  const [toggleOn, setToggleOn] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [checked, setChecked] = useState(false);

  return (
    <>
      <h1 style={S.h1}>Examples</h1>
      <p style={S.lead}>Hold <kbd style={S.kbd}>Alt</kbd> (Option) and hover any element. Each example is interactive — click, toggle, type.</p>

      {/* 1. Buttons */}
      <section id="Buttons" style={S.section}>
        <h2 style={S.h2}>Buttons</h2>
        <p style={S.body}>Button variants with different padding, background, border, and border-radius. Click each to see the active state.</p>
        <div style={S.preview}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {(["primary", "outline", "ghost", "pill", "small"] as const).map(v => (
              <button key={v} onClick={() => setBtnVariant(v)} style={{
                ...btnStyles[v],
                ...(btnVariant === v ? { outline: "2px solid #3b82f6", outlineOffset: 2 } : {}),
              }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
            ))}
          </div>
        </div>
        <Table head={["Prop", "Value"]} rows={[
          ["padding", btnVariant === "small" ? "6px 10px" : "8px 18px"],
          ["border-radius", btnVariant === "pill" ? "100px" : "8px"],
          ["background", btnVariant === "primary" || btnVariant === "pill" || btnVariant === "small" ? "#fafafa" : "transparent"],
          ["border", btnVariant === "outline" ? "1px solid #3a3a39" : "none"],
          ["font-size", btnVariant === "small" ? "12px" : "13px"],
        ]} />
      </section>

      {/* 2. Typography */}
      <section id="Typography" style={S.section}>
        <h2 style={S.h2}>Typography Scale</h2>
        <p style={S.body}>Inspect font-size, font-weight, line-height, and letter-spacing across a type scale.</p>
        <div style={S.preview}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
            <p style={{ fontSize: 32, fontWeight: 600, color: "#e5e5e5", letterSpacing: "-0.03em", margin: 0 }}>Display heading</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: "#e5e5e5", letterSpacing: "-0.02em", margin: 0 }}>Section heading</p>
            <p style={{ fontSize: 18, fontWeight: 500, color: "#d4d4d4", margin: 0 }}>Subtitle text</p>
            <p style={{ fontSize: 16, color: "#a1a1aa", lineHeight: "1.6", margin: 0 }}>Body text — the quick brown fox jumps over the lazy dog.</p>
            <p style={{ fontSize: 13, color: "#6b6b6b", margin: 0 }}>Caption text · secondary information</p>
            <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, margin: 0 }}>OVERLINE LABEL</p>
          </div>
        </div>
        <Table head={["Level", "Size", "Weight", "Spacing"]} rows={[
          ["Display", "32px", "600", "-0.03em"],
          ["Section", "24px", "600", "-0.02em"],
          ["Subtitle", "18px", "500", "normal"],
          ["Body", "16px", "400", "normal"],
          ["Caption", "13px", "400", "normal"],
          ["Overline", "11px", "500", "0.08em"],
        ]} />
      </section>

      {/* 3. Card */}
      <section id="Card" style={S.section}>
        <h2 style={S.h2}>Card</h2>
        <p style={S.body}>A composite component with avatar, text, and action buttons. Inspect nested padding, gap, and border-radius.</p>
        <div style={S.preview}>
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={S.avatar} />
              <div>
                <div style={S.cardName}>Andrew Antoshkin</div>
                <div style={S.cardRole}>Product Design Engineer</div>
              </div>
            </div>
            <p style={S.cardBio}>Building tools at the intersection of design systems, Figma, and AI.</p>
            <div style={S.cardActions}>
              <button style={btnStyles.primary}>Follow</button>
              <button style={btnStyles.outline}>Message</button>
            </div>
          </div>
        </div>
        <Table head={["Property", "Value"]} rows={[
          ["padding", "24px"],
          ["border-radius", "12px"],
          ["border", "1px solid #2f2f2e"],
          ["background", "#171716"],
          ["gap (header)", "12px"],
          ["avatar", "36 × 36px, border-radius: 50%"],
        ]} />
      </section>

      {/* 4. Form */}
      <section id="Form" style={S.section}>
        <h2 style={S.h2}>Form Elements</h2>
        <p style={S.body}>Type in the input, toggle the checkbox. Inspect padding, border, font-size, and label spacing.</p>
        <div style={S.preview}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
            <div>
              <label style={S.label}>Email</label>
              <input type="text" placeholder="you@example.com" value={inputVal} onChange={e => setInputVal(e.target.value)} style={S.input} />
            </div>
            <div>
              <label style={S.label}>Password</label>
              <input type="password" placeholder="••••••••" style={S.input} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <span onClick={() => setChecked(!checked)} style={{ width: 18, height: 18, borderRadius: 4, border: "1px solid #3a3a39", background: checked ? "#3b82f6" : "#171716", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>{checked ? "✓" : ""}</span>
              <span style={{ fontSize: 13, color: "#a1a1aa" }}>Remember me</span>
            </label>
            <button style={{ ...btnStyles.primary, width: "100%", padding: "10px 0" }}>Sign In</button>
          </div>
        </div>
        <Table head={["Element", "Property", "Value"]} rows={[
          ["input", "padding", "8px 12px"],
          ["input", "border-radius", "8px"],
          ["input", "border", "1px solid #3a3a39"],
          ["input", "font-size", "13px"],
          ["label", "font-size", "13px"],
          ["label", "margin-bottom", "6px"],
          ["checkbox", "size", "18 × 18px"],
        ]} />
      </section>

      {/* 5. Badges */}
      <section id="Badges" style={S.section}>
        <h2 style={S.h2}>Badges & Tags</h2>
        <p style={S.body}>Small components with tight padding, pill radius, and semantic background colors.</p>
        <div style={S.preview}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={badge("#1e3a5f", "#93c5fd")}>Default</span>
            <span style={badge("#422006", "#fbbf24")}>Warning</span>
            <span style={badge("#052e16", "#4ade80")}>Success</span>
            <span style={badge("#3b1c1c", "#f87171")}>Error</span>
            <span style={badge("#2a2a29", "#a1a1aa")}>Neutral</span>
            <span style={badge("#1c1c3b", "#a78bfa")}>Beta</span>
          </div>
        </div>
        <Table head={["Variant", "Background", "Color"]} rows={[
          ["Default", "#1e3a5f", "#93c5fd"],
          ["Warning", "#422006", "#fbbf24"],
          ["Success", "#052e16", "#4ade80"],
          ["Error", "#3b1c1c", "#f87171"],
          ["Neutral", "#2a2a29", "#a1a1aa"],
          ["Beta", "#1c1c3b", "#a78bfa"],
        ]} />
      </section>

      {/* 6. Navigation */}
      <section id="Navigation" style={S.section}>
        <h2 style={S.h2}>Navigation Bar</h2>
        <p style={S.body}>Flex layout with logo, links, and CTA button. Inspect gap, padding, and alignment.</p>
        <div style={S.preview}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "12px 20px", background: "#171716", borderRadius: 10, border: "1px solid #2f2f2e" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#e5e5e5" }}>Acme</span>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, color: "#a1a1aa", textDecoration: "none" }}>Docs</a>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, color: "#a1a1aa", textDecoration: "none" }}>Blog</a>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, color: "#a1a1aa", textDecoration: "none" }}>Pricing</a>
            </div>
            <button style={{ ...btnStyles.primary, padding: "6px 14px", fontSize: 12 }}>Sign Up</button>
          </div>
        </div>
        <Table head={["Property", "Value"]} rows={[
          ["display", "flex"],
          ["justify-content", "space-between"],
          ["align-items", "center"],
          ["padding", "12px 20px"],
          ["border-radius", "10px"],
          ["gap (links)", "20px"],
        ]} />
      </section>

      {/* 7. Spacing */}
      <section id="Spacing" style={S.section}>
        <h2 style={S.h2}>Spacing Showcase</h2>
        <p style={S.body}>Three boxes with different padding values. The overlay highlights the difference clearly.</p>
        <div style={S.preview}>
          <div style={{ display: "flex", gap: 16, width: "100%" }}>
            {[8, 16, 24].map(p => (
              <div key={p} style={{ flex: 1, padding: p, background: "#171716", borderRadius: 8, border: "1px solid #2f2f2e" }}>
                <div style={{ fontSize: 11, color: "#6b6b6b", marginBottom: 4 }}>{p}px</div>
                <div style={{ background: "#2a2a29", borderRadius: 4, padding: 8, fontSize: 12, color: "#a1a1aa" }}>Content</div>
              </div>
            ))}
          </div>
        </div>
        <Table head={["Box", "Padding", "Inner padding"]} rows={[
          ["Left", "8px", "8px"],
          ["Center", "16px", "8px"],
          ["Right", "24px", "8px"],
        ]} />
      </section>

      {/* 8. Toggle + List */}
      <section id="List" style={S.section}>
        <h2 style={S.h2}>List Items</h2>
        <p style={S.body}>Repeating pattern with consistent vertical rhythm. Includes an interactive toggle. Inspect padding, gap, and border.</p>
        <div style={S.preview}>
          <div style={{ width: "100%", maxWidth: 400, background: "#171716", borderRadius: 10, border: "1px solid #2f2f2e", overflow: "hidden" }}>
            {[
              { name: "Dark mode", desc: "Use dark color scheme", toggle: true },
              { name: "Notifications", desc: "Enable push notifications" },
              { name: "Analytics", desc: "Share anonymous usage data" },
              { name: "Auto-save", desc: "Save changes automatically" },
            ].map((item, i, arr) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid #2f2f2e" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#e5e5e5", marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#6b6b6b" }}>{item.desc}</div>
                </div>
                {item.toggle ? (
                  <div onClick={() => setToggleOn(!toggleOn)} style={{ width: 40, height: 22, borderRadius: 11, background: toggleOn ? "#3b82f6" : "#3a3a39", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.15s" }}>
                    <div style={{ position: "absolute", top: 2, left: toggleOn ? 20 : 2, width: 18, height: 18, borderRadius: 9, background: "#fff", transition: "left 0.15s" }} />
                  </div>
                ) : (
                  <span style={{ fontSize: 13, color: "#555" }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <Table head={["Property", "Value"]} rows={[
          ["item padding", "12px 16px"],
          ["border-bottom", "1px solid #2f2f2e"],
          ["border-radius (container)", "10px"],
          ["toggle size", "40 × 22px"],
          ["toggle thumb", "18 × 18px"],
          ["gap (label → desc)", "2px"],
        ]} />
      </section>

      <Nav prev={{ label: "API", onClick: onPrev }} next={null} />
    </>
  );
}

/* =============== Shared Components =============== */

function Sect({ title, children }: { title: string; children: React.ReactNode }) {
  return <section style={S.section}><h2 style={S.h2}>{title}</h2>{children}</section>;
}
function Pre({ code }: { code: string }) {
  return <div style={S.codeWrap}><pre style={S.pre}><code>{code}</code></pre></div>;
}
function Feature({ dot, title, desc }: { dot: string; title: string; desc: string }) {
  return (
    <div style={S.fRow}><div style={{ ...S.fDot, background: dot }} /><div><div style={S.fTitle}>{title}</div><p style={S.fDesc}>{desc}</p></div></div>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div style={S.tbl}>
      <div style={S.tblHead}>
        {head.map((h, i) => <span key={i} style={{ flex: i === head.length - 1 ? 3 : 2 }}>{h}</span>)}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ ...S.tblRow, ...(i === rows.length - 1 ? { borderBottom: "none" } : {}) }}>
          {row.map((cell, j) => (
            <span key={j} style={{
              flex: j === row.length - 1 ? 3 : 2,
              ...(j === 0 ? S.tblProp : {}),
              ...(j === 1 && head.length > 2 ? S.tblType : {}),
            }}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Nav({ prev, next }: { prev: { label: string; onClick: (e: React.MouseEvent) => void } | null; next: { label: string; onClick: (e: React.MouseEvent) => void } | null }) {
  return (
    <div style={S.pageNav}>
      {prev ? <a href="#" onClick={prev.onClick} style={S.pnLink}><span style={S.pnHint}>Previous</span><span style={S.pnTitle}>← {prev.label}</span></a> : <div />}
      {next ? <a href="#" onClick={next.onClick} style={S.pnLink}><span style={S.pnHint}>Next</span><span style={S.pnTitle}>{next.label} →</span></a> : <div />}
    </div>
  );
}

/* =============== Helpers =============== */

const badge = (bg: string, fg: string): React.CSSProperties => ({
  padding: "3px 10px", fontSize: 11, fontWeight: 500, background: bg, color: fg, borderRadius: 100,
});

const btnStyles: Record<string, React.CSSProperties> = {
  primary: { padding: "8px 18px", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: "#fafafa", color: "#0a0a0a", border: "none", borderRadius: 8, cursor: "pointer" },
  outline: { padding: "8px 18px", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: "transparent", color: "#d4d4d4", border: "1px solid #3a3a39", borderRadius: 8, cursor: "pointer" },
  ghost: { padding: "8px 18px", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: "transparent", color: "#a1a1aa", border: "none", borderRadius: 8, cursor: "pointer" },
  pill: { padding: "8px 24px", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: "#fafafa", color: "#0a0a0a", border: "none", borderRadius: 100, cursor: "pointer" },
  small: { padding: "6px 10px", fontSize: 12, fontWeight: 500, fontFamily: "inherit", background: "#fafafa", color: "#0a0a0a", border: "none", borderRadius: 8, cursor: "pointer" },
};

/* =============== Styles =============== */

const S: Record<string, React.CSSProperties> = {
  shell: { display: "flex", minHeight: "100vh", background: "#1c1c1b" },
  sidebar: {
    position: "fixed", top: 0, left: 0, bottom: 0, width: 240,
    background: "#171716", borderRight: "1px dotted #333",
    display: "flex", flexDirection: "column", padding: "20px 16px 16px", zIndex: 100,
    overflowY: "auto",
  },
  sidebarInner: { flex: 1 },
  brandRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24 },
  backBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, border: "1px solid #444", borderRadius: 4, background: "transparent", color: "#e5e5e5", textDecoration: "none", flexShrink: 0 },
  brand: { fontSize: 14, fontWeight: 500, color: "#e5e5e5", textDecoration: "none", display: "block" },
  sidebarLink: { fontSize: 12, color: "#555", textDecoration: "none" },
  navSection: { marginBottom: 16 },
  navLabel: { fontSize: 11, fontWeight: 500, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 },
  navItem: { display: "block", fontSize: 13, fontWeight: 500, color: "#a1a1aa", textDecoration: "none", padding: "5px 8px", borderRadius: 6, marginLeft: -8 },
  navActive: { display: "block", fontSize: 13, fontWeight: 500, color: "#e5e5e5", textDecoration: "none", padding: "5px 8px", borderRadius: 6, marginLeft: -8, background: "#2a2a29" },
  sidebarInstall: { fontSize: 12, color: "#555", fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' },

  main: { flex: 1, display: "flex", justifyContent: "center", padding: "64px 32px 80px" },
  article: { maxWidth: 672, width: "100%" },

  h1: { fontSize: 24, fontWeight: 600, color: "#e5e5e5", letterSpacing: "-0.03em", marginBottom: 10 },
  lead: { fontSize: 14, color: "#a1a1aa", lineHeight: "1.6", marginBottom: 32 },
  h2: { fontSize: 18, fontWeight: 600, color: "#e5e5e5", letterSpacing: "-0.03em", marginBottom: 10 },
  body: { fontSize: 14, color: "#a1a1aa", lineHeight: "1.6", marginBottom: 14 },
  kbd: { display: "inline-block", padding: "1px 5px", fontSize: 11, fontFamily: "ui-monospace, SFMono-Regular, monospace", background: "#2a2a29", border: "1px solid #3a3a39", borderRadius: 4, color: "#d4d4d4" },
  ic: { fontSize: 12.5, fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace', background: "#2a2a29", border: "1px solid #333", borderRadius: 5, padding: "1px 4px", color: "#d4d4d4" },
  section: { marginBottom: 48, scrollMarginTop: 32 },

  codeWrap: { background: "#212121", border: "1px solid #2f2f2e", borderRadius: 10, overflow: "hidden" },
  pre: { margin: 0, padding: "14px 16px", fontSize: 12.5, fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace', color: "#a1a1aa", lineHeight: "1.6", overflowX: "auto" },

  preview: { background: "#212121", border: "1px solid #2f2f2e", borderRadius: 10, padding: 24, display: "flex", justifyContent: "center", marginBottom: 14 },

  label: { fontSize: 13, color: "#a1a1aa", display: "block", marginBottom: 6, fontWeight: 500 },
  input: { padding: "8px 12px", fontSize: 13, fontFamily: "inherit", background: "#171716", color: "#d4d4d4", border: "1px solid #3a3a39", borderRadius: 8, outline: "none", width: "100%" },
  avatar: { width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" },

  card: { background: "#171716", border: "1px solid #2f2f2e", borderRadius: 12, padding: 24, maxWidth: 360, width: "100%" },
  cardHead: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  cardName: { fontSize: 15, fontWeight: 500, color: "#e5e5e5" },
  cardRole: { fontSize: 12, color: "#6b6b6b" },
  cardBio: { fontSize: 13, color: "#a1a1aa", lineHeight: "1.5", marginBottom: 16 },
  cardActions: { display: "flex", gap: 8 },

  fl: { display: "flex", flexDirection: "column", gap: 10 },
  fRow: { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", background: "#212121", border: "1px solid #2f2f2e", borderRadius: 10 },
  fDot: { width: 12, height: 12, borderRadius: 3, flexShrink: 0, marginTop: 3 },
  fTitle: { fontSize: 13, fontWeight: 500, color: "#e5e5e5", marginBottom: 2 },
  fDesc: { fontSize: 12, color: "#6b6b6b", lineHeight: "1.4" },

  tbl: { background: "#212121", border: "1px solid #2f2f2e", borderRadius: 10, overflow: "hidden", marginTop: 0 },
  tblHead: { display: "flex", padding: "10px 16px", borderBottom: "1px solid #2f2f2e", fontSize: 11, fontWeight: 500, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.04em" },
  tblRow: { display: "flex", padding: "10px 16px", borderBottom: "1px solid #2f2f2e", alignItems: "flex-start", fontSize: 12, color: "#a1a1aa" },
  tblProp: { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace', color: "#93c5fd", fontSize: 13 },
  tblType: { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace', color: "#a78bfa", fontSize: 12 },

  pageNav: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 32, borderTop: "1px dotted #333", marginTop: 24 },
  pnLink: { textDecoration: "none", display: "flex", flexDirection: "column", gap: 2 },
  pnHint: { fontSize: 13, color: "#6b6b6b" },
  pnTitle: { fontSize: 14, fontWeight: 500, color: "#e5e5e5" },
};
