import React, { useState } from "react";
import { Spektr } from "spektr";

export function App() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Spektr enabled={enabled}>
      <div style={styles.page}>
        {/* Hero */}
        <header style={styles.hero}>
          <h1 style={styles.title}>Spektr</h1>
          <p style={styles.subtitle}>
            Design spec overlay for React.
          </p>
          <p style={styles.hint}>
            Hold <kbd style={styles.kbd}>Alt</kbd> and hover any element below.
          </p>
          <div style={styles.heroLinks}>
            <a
              href="https://github.com/AndrewAntoshkin/spektr"
              target="_blank"
              rel="noopener"
              style={styles.link}
            >
              GitHub
            </a>
            <span style={{ color: "#525252" }}>·</span>
            <code style={styles.install}>npm i spektr</code>
          </div>
        </header>

        {/* Demo area */}
        <section style={styles.demoSection}>
          <p style={styles.demoLabel}>Try it — hold Alt and hover:</p>

          <div style={styles.demoGrid}>
            {/* Card 1 */}
            <div style={styles.card}>
              <div style={styles.cardIcon}>🎨</div>
              <h3 style={styles.cardTitle}>Colors & Typography</h3>
              <p style={styles.cardText}>
                Inspect font-size, weight, line-height, and color values of any text element.
              </p>
            </div>

            {/* Card 2 */}
            <div style={styles.card}>
              <div style={styles.cardIcon}>📐</div>
              <h3 style={styles.cardTitle}>Spacing & Layout</h3>
              <p style={styles.cardText}>
                See padding, margin, gap, and dimensions with color-coded overlays.
              </p>
            </div>

            {/* Card 3 */}
            <div style={styles.card}>
              <div style={styles.cardIcon}>📌</div>
              <h3 style={styles.cardTitle}>Pin Inspections</h3>
              <p style={styles.cardText}>
                Alt+click to pin a spec overlay. Alt+click again to unpin.
              </p>
            </div>
          </div>

          {/* Sample UI elements */}
          <div style={styles.sampleRow}>
            <button style={styles.sampleButton}>Primary Action</button>
            <button style={styles.sampleButtonOutline}>Secondary</button>
            <span style={styles.badge}>Badge</span>
          </div>

          <div style={styles.sampleCard}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={styles.avatar} />
              <div>
                <div style={styles.sampleName}>Andrew Antoshkin</div>
                <div style={styles.sampleRole}>Product Design Engineer</div>
              </div>
            </div>
            <p style={styles.sampleBio}>
              Building tools at the intersection of design systems, Figma, and AI.
            </p>
          </div>
        </section>

        {/* Usage */}
        <section style={styles.usageSection}>
          <h2 style={styles.sectionTitle}>Usage</h2>
          <pre style={styles.codeBlock}>
{`import { Spektr } from 'spektr';

function App() {
  return (
    <Spektr>
      <YourApp />
    </Spektr>
  );
}`}
          </pre>

          <div style={styles.propsTable}>
            <h3 style={styles.propsTitle}>Props</h3>
            <div style={styles.propRow}>
              <code style={styles.propName}>enabled</code>
              <span style={styles.propType}>boolean</span>
              <span style={styles.propDefault}>true</span>
            </div>
            <div style={styles.propRow}>
              <code style={styles.propName}>hotkey</code>
              <span style={styles.propType}>string</span>
              <span style={styles.propDefault}>"Alt"</span>
            </div>
            <div style={styles.propRow}>
              <code style={styles.propName}>children</code>
              <span style={styles.propType}>ReactNode</span>
              <span style={styles.propDefault}>—</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>
            Built by{" "}
            <a href="https://antoshk.in" style={styles.footerLink}>
              Andrew Antoshkin
            </a>
          </p>
        </footer>
      </div>
    </Spektr>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: "640px",
    width: "100%",
    padding: "0 24px",
    paddingBottom: "80px",
  },
  hero: {
    textAlign: "center",
    paddingTop: "clamp(60px, 15vh, 120px)",
    paddingBottom: "48px",
  },
  title: {
    fontSize: "clamp(2.5rem, 8vw, 4rem)",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: "#fafafa",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#a3a3a3",
    marginBottom: "16px",
  },
  hint: {
    fontSize: "0.875rem",
    color: "#737373",
    marginBottom: "20px",
  },
  kbd: {
    display: "inline-block",
    padding: "2px 6px",
    fontSize: "0.75rem",
    fontFamily: "ui-monospace, SFMono-Regular, monospace",
    background: "#262626",
    border: "1px solid #404040",
    borderRadius: "4px",
    color: "#d4d4d4",
  },
  heroLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    fontSize: "0.875rem",
  },
  link: {
    color: "#a3a3a3",
    textDecoration: "none",
    borderBottom: "1px solid #404040",
  },
  install: {
    fontSize: "0.8125rem",
    color: "#737373",
    fontFamily: "ui-monospace, SFMono-Regular, monospace",
  },

  demoSection: {
    paddingBottom: "48px",
  },
  demoLabel: {
    fontSize: "0.8125rem",
    color: "#525252",
    textAlign: "center",
    marginBottom: "24px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  demoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "#171717",
    border: "1px solid #262626",
    borderRadius: "12px",
    padding: "20px",
  },
  cardIcon: {
    fontSize: "1.5rem",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "0.9375rem",
    fontWeight: 500,
    color: "#fafafa",
    marginBottom: "8px",
  },
  cardText: {
    fontSize: "0.8125rem",
    color: "#737373",
    lineHeight: "1.5",
  },

  sampleRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  sampleButton: {
    padding: "10px 20px",
    fontSize: "0.875rem",
    fontWeight: 500,
    fontFamily: "inherit",
    background: "#fafafa",
    color: "#0a0a0a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  sampleButtonOutline: {
    padding: "10px 20px",
    fontSize: "0.875rem",
    fontWeight: 500,
    fontFamily: "inherit",
    background: "transparent",
    color: "#e5e5e5",
    border: "1px solid #404040",
    borderRadius: "8px",
    cursor: "pointer",
  },
  badge: {
    padding: "4px 12px",
    fontSize: "0.75rem",
    fontWeight: 500,
    background: "#1e3a5f",
    color: "#93c5fd",
    borderRadius: "100px",
  },

  sampleCard: {
    background: "#171717",
    border: "1px solid #262626",
    borderRadius: "12px",
    padding: "24px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    flexShrink: 0,
  },
  sampleName: {
    fontSize: "0.9375rem",
    fontWeight: 500,
    color: "#fafafa",
  },
  sampleRole: {
    fontSize: "0.8125rem",
    color: "#737373",
  },
  sampleBio: {
    fontSize: "0.875rem",
    color: "#a3a3a3",
    lineHeight: "1.5",
    marginTop: "12px",
  },

  usageSection: {
    paddingBottom: "48px",
    borderTop: "1px solid #1a1a1a",
    paddingTop: "48px",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 500,
    color: "#fafafa",
    marginBottom: "20px",
  },
  codeBlock: {
    background: "#141414",
    border: "1px solid #262626",
    borderRadius: "8px",
    padding: "20px",
    fontSize: "0.8125rem",
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    color: "#a3a3a3",
    lineHeight: "1.6",
    overflowX: "auto",
    marginBottom: "24px",
  },
  propsTable: {
    background: "#141414",
    border: "1px solid #262626",
    borderRadius: "8px",
    padding: "20px",
  },
  propsTitle: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#fafafa",
    marginBottom: "12px",
  },
  propRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "6px 0",
    borderBottom: "1px solid #1a1a1a",
    fontSize: "0.8125rem",
  },
  propName: {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    color: "#93c5fd",
    minWidth: "80px",
  },
  propType: {
    color: "#737373",
    minWidth: "80px",
  },
  propDefault: {
    color: "#525252",
  },

  footer: {
    borderTop: "1px solid #1a1a1a",
    paddingTop: "24px",
    fontSize: "0.8125rem",
    color: "#525252",
    textAlign: "center",
  },
  footerLink: {
    color: "#737373",
    textDecoration: "none",
    borderBottom: "1px solid #333",
  },
};
