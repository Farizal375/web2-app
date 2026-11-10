import { useEffect, useState } from "react";

const appName = import.meta.env.VITE_APP_NAME || "Web Beta";
const themeColor = import.meta.env.VITE_THEME_COLOR || "#2563eb";

const phrases = [
  "See the signal in every data point.",
  "Make confident decisions, faster.",
  "Bring your whole business into focus.",
];

const metrics = [
  {
    id: "uptime",
    target: 99.9,
    decimals: 1,
    suffix: "%",
    label: "Platform uptime",
    note: "Reliable by design",
  },
  {
    id: "requests",
    target: 1.2,
    decimals: 1,
    suffix: "M+",
    label: "Events processed",
    note: "Every single day",
  },
  {
    id: "response",
    target: 42,
    decimals: 0,
    suffix: "ms",
    label: "Average response",
    note: "Across every region",
  },
];

const features = [
  {
    title: "One clear picture",
    description:
      "Bring your key business signals together in a unified view your whole team can understand.",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    title: "Insights in real time",
    description:
      "Spot meaningful changes as they happen with live reporting and timely, helpful context.",
    icon: (
      <>
        <path d="M3 12h4l3-8 4 16 3-8h4" />
      </>
    ),
  },
  {
    title: "Built for your team",
    description:
      "Share the right view with the right people and turn aligned teams into decisive teams.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.25" />
        <path d="M3 20v-1.2a5.8 5.8 0 0 1 11.6 0V20M16 5.2a3.3 3.3 0 0 1 0 6.4m1.3 3a5.3 5.3 0 0 1 3.7 5.1V20" />
      </>
    ),
  },
];

const initialChartValues = [48, 57, 53, 67, 61, 76, 70, 83, 78, 91, 85, 98];

function ArrowIcon({ diagonal = false }) {
  return diagonal ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M6 5h9v9" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13m-5-5 5 5-5 5" />
    </svg>
  );
}

function ChartCard({ values }) {
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 300;
      const y = 118 - value;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,120 ${points} 300,120`;
  const lastPoint = values[values.length - 1];
  const lastY = 118 - lastPoint;

  return (
    <div className="chart-card">
      <div className="chart-heading">
        <div>
          <p className="chart-label">Workspace activity</p>
          <p className="chart-value">
            24,892 <span>events</span>
          </p>
        </div>
        <span className="chart-period">Last 24 hours</span>
      </div>
      <div className="chart-legend">
        <span className="legend-dot" />
        <span>Events processed</span>
        <span className="live-badge">
          <span /> Live
        </span>
      </div>
      <svg
        className="activity-chart"
        viewBox="0 0 300 130"
        role="img"
        aria-label="Live workspace activity line chart"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--theme-color)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--theme-color)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 55, 85, 115].map((y) => (
          <line
            className="chart-grid-line"
            key={y}
            x1="0"
            x2="300"
            y1={y}
            y2={y}
          />
        ))}
        <polygon className="chart-area" points={areaPoints} />
        <polyline className="chart-line" points={points} />
        <circle
          className="chart-current-point"
          cx="300"
          cy={lastY}
          r="4"
        />
      </svg>
      <div className="chart-axis" aria-hidden="true">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>Now</span>
      </div>
    </div>
  );
}

function App() {
  const [typedText, setTypedText] = useState("");
  const [metricValues, setMetricValues] = useState(
    Object.fromEntries(metrics.map(({ id }) => [id, 0])),
  );
  const [chartValues, setChartValues] = useState(initialChartValues);

  useEffect(() => {
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let pauseTicks = 0;

    const typingInterval = window.setInterval(() => {
      const phrase = phrases[phraseIndex];

      if (pauseTicks > 0) {
        pauseTicks -= 1;
        return;
      }

      if (!deleting) {
        characterIndex += 1;
        setTypedText(phrase.slice(0, characterIndex));

        if (characterIndex === phrase.length) {
          deleting = true;
          pauseTicks = 22;
        }
        return;
      }

      characterIndex -= 1;
      setTypedText(phrase.slice(0, characterIndex));

      if (characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        pauseTicks = 5;
      }
    }, 55);

    return () => window.clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const duration = 1600;
    const startTime = performance.now();
    let animationFrameId;

    const animateMetrics = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;

      setMetricValues(
        Object.fromEntries(
          metrics.map(({ id, target }) => [id, target * easedProgress]),
        ),
      );

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animateMetrics);
      }
    };

    animationFrameId = window.requestAnimationFrame(animateMetrics);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const chartInterval = window.setInterval(() => {
      setChartValues((currentValues) => {
        const previousValue = currentValues[currentValues.length - 1];
        const nextValue = Math.min(
          100,
          Math.max(26, previousValue + Math.round(Math.random() * 24 - 12)),
        );
        return [...currentValues.slice(1), nextValue];
      });
    }, 1000);

    return () => window.clearInterval(chartInterval);
  }, []);

  return (
    <div className="app-shell" style={{ "--theme-color": themeColor }}>
      <header className="site-header">
        <nav className="nav container" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label={`${appName} home`}>
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>{appName}</span>
          </a>

          <div className="nav-links">
            <a href="#solutions">Solutions</a>
            <a href="#pricing">Pricing</a>
            <a href="#resources">Resources</a>
          </div>

          <div className="nav-actions">
            <a className="login-link" href="#login">
              Login
            </a>
            <a className="button button--nav" href="#contact">
              Contact sales <ArrowIcon diagonal />
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-decoration hero-decoration--one" aria-hidden="true" />
          <div className="hero-decoration hero-decoration--two" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="eyebrow-icon">✳</span>
                Analytics that move you forward
              </p>
              <h1>
                Make data your
                <br />
                <span>next advantage.</span>
              </h1>
              <p className="hero-subtitle" aria-live="polite">
                {typedText}
                <span className="typing-cursor" aria-hidden="true" />
              </p>
              <p className="hero-description">
                Bring your business data into focus. Understand what matters,
                find new opportunities, and move forward with confidence.
              </p>
              <div className="hero-actions">
                <a className="button button--primary" href="#contact">
                  Request a demo <ArrowIcon />
                </a>
                <a className="button button--secondary" href="#solutions">
                  Explore solutions
                </a>
              </div>
              <div className="trust-note">
                <span className="trust-avatars" aria-hidden="true">
                  <span>A</span>
                  <span>M</span>
                  <span>J</span>
                </span>
                <span>Trusted by forward-thinking teams</span>
              </div>
            </div>

            <div className="hero-dashboard">
              <div className="dashboard-topbar">
                <div className="window-controls" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="dashboard-title">Overview</span>
                <span className="dashboard-menu" aria-hidden="true">
                  •••
                </span>
              </div>
              <div className="dashboard-body">
                <div className="dashboard-welcome">
                  <div>
                    <span className="dashboard-overline">MONDAY, OCTOBER 21</span>
                    <h2>Good morning, Alex</h2>
                  </div>
                  <span className="dashboard-date">Last 7 days⌄</span>
                </div>
                <div className="dashboard-kpis">
                  <div className="kpi-card">
                    <span>Total events</span>
                    <strong>24.8k</strong>
                    <small className="positive">↗ 12.8%</small>
                  </div>
                  <div className="kpi-card">
                    <span>Active users</span>
                    <strong>8,492</strong>
                    <small className="positive">↗ 8.2%</small>
                  </div>
                  <div className="kpi-card">
                    <span>Conversion</span>
                    <strong>4.86%</strong>
                    <small className="positive">↗ 2.4%</small>
                  </div>
                </div>
                <ChartCard values={chartValues} />
                <div className="dashboard-footer-note">
                  <span className="sync-indicator" />
                  Updated just now
                  <span className="dashboard-footer-link">View report <ArrowIcon /></span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-bottom container">
            <span>Powering better decisions at</span>
            <div className="customer-logos" aria-label="Trusted by teams">
              <span className="customer-logo customer-logo--north">northstar</span>
              <span className="customer-logo customer-logo--orbit">◉ orbit</span>
              <span className="customer-logo customer-logo--layers">▱ layers</span>
              <span className="customer-logo customer-logo--vertex">vertex</span>
            </div>
          </div>
        </section>

        <section className="metrics-section" aria-label="Platform metrics">
          <div className="container metrics-content">
            <div className="metrics-intro">
              <p className="eyebrow">Numbers that speak for themselves</p>
              <h2>Reliable insights. Real impact.</h2>
            </div>
            <div className="metrics-grid">
              {metrics.map((metric) => (
                <article className="metric-item" key={metric.id}>
                  <strong>
                    {metricValues[metric.id].toFixed(metric.decimals)}
                    {metric.suffix}
                  </strong>
                  <span>{metric.label}</span>
                  <small>{metric.note}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="features-section container" id="solutions">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Everything, in perspective</p>
              <h2>
                Clarity for every
                <br />
                <span>business question.</span>
              </h2>
            </div>
            <p>
              A thoughtful analytics experience that makes complex data easier
              to explore, share, and act on.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card-top">
                  <span className="feature-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {feature.icon}
                    </svg>
                  </span>
                  <span className="feature-index">0{index + 1}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href="#contact" className="feature-link">
                  Learn more <ArrowIcon />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section container" id="contact">
          <div className="contact-panel">
            <div>
              <p className="eyebrow">A clearer way forward</p>
              <h2>Let's find your next insight.</h2>
              <p>
                See how {appName} can help your team make more of every
                decision.
              </p>
            </div>
            <a className="button button--white" href="mailto:sales@example.com">
              Talk to our team <ArrowIcon />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="resources">
        <div className="container footer-main">
          <div className="footer-brand">
            <a className="brand" href="#home">
              <span className="brand-mark" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
              <span>{appName}</span>
            </a>
            <p>Better data. Better questions. Better decisions.</p>
          </div>
          <div className="footer-links">
            <a href="#solutions">Solutions</a>
            <a href="#pricing">Pricing</a>
            <a href="#resources">Resources</a>
            <a href="#contact">Contact</a>
          </div>
          <span className="footer-status">
            <span className="sync-indicator" />
            All systems operational
          </span>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {appName}. All rights reserved.</span>
          <div>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
