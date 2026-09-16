* {
  box-sizing: border-box;
}

:root {
  --bg: #06141e;
  --bg-soft: #0d1f2b;
  --panel: rgba(15, 28, 38, 0.93);
  --panel-strong: #12283a;
  --card: #f3f7fb;
  --text: #e8f1f8;
  --muted: #9bb0c1;
  --primary: #4fd1c5;
  --accent: #fbbf24;
  --shadow: 0 24px 80px rgba(8, 17, 25, 0.45);
  --border: rgba(255, 255, 255, 0.08);
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: radial-gradient(circle at top, #102a3d 0%, var(--bg) 40%);
  color: var(--text);
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select {
  font: inherit;
}

.container {
  width: min(1140px, calc(100% - 32px));
  margin: 0 auto;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(14px);
  background: rgba(6, 20, 30, 0.7);
  border-bottom: 1px solid var(--border);
}

.navshell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 78px;
  gap: 18px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), #83d4ff);
  color: #062233;
  font-weight: 800;
}

.brand-name {
  font-weight: 800;
  letter-spacing: -0.04em;
}

.brand-tag {
  font-size: 0.72rem;
  color: var(--muted);
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 22px;
  color: var(--muted);
}

.main-nav a:hover {
  color: var(--text);
}

.account-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.primary-btn,
.secondary-btn,
.ghost-btn,
.tab-btn,
.close-btn {
  border: 0;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.primary-btn,
.secondary-btn,
.ghost-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 0.86rem 1.2rem;
  font-weight: 700;
}

.primary-btn {
  background: linear-gradient(135deg, var(--primary), #7ae2d2);
  color: #072a34;
  box-shadow: 0 15px 35px rgba(79, 209, 197, 0.35);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  color: var(--text);
}

.secondary-btn.light {
  background: rgba(255, 255, 255, 0.04);
}

.ghost-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

.primary-btn:hover,
.secondary-btn:hover,
.ghost-btn:hover,
.tab-btn:hover,
.close-btn:hover {
  transform: translateY(-1px);
}

.hero {
  padding: 72px 0 44px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 40px;
}

.eyebrow {
  display: inline-block;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(79, 209, 197, 0.12);
  color: #9feae0;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
}

.hero-copy h1 {
  font-size: clamp(2.7rem, 5vw, 5rem);
  line-height: 0.94;
  letter-spacing: -0.07em;
  margin: 18px 0 16px;
}

.hero-copy p {
  margin: 0;
  color: var(--muted);
  font-size: 1.08rem;
  max-width: 560px;
  line-height: 1.7;
}

.cta-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 26px;
}

.hero-stats {
  margin-top: 28px;
  padding: 0;
  list-style: none;
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

.hero-stats li {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-stats strong {
  font-size: 1.5rem;
  letter-spacing: -0.04em;
}

.hero-stats span {
  color: var(--muted);
  font-size: 0.82rem;
}

.hero-card {
  background: linear-gradient(180deg, rgba(18, 40, 58, 0.7), rgba(8, 17, 25, 0.9));
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  border-radius: 28px;
  padding: 26px;
}

.mini-glass {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 20px;
}

.mini-glass span,
.vehicle-meta span {
  color: var(--muted);
}

.mini-glass strong {
  display: block;
  margin-top: 6px;
  font-size: 1.9rem;
  letter-spacing: -0.06em;
}

.route-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.route-pills span {
  display: inline-flex;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  font-size: 0.72rem;
}

.vehicle-showcase {
  min-height: 260px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-top: 22px;
  border-radius: 22px;
  padding: 32px 18px 18px;
  background: linear-gradient(135deg, #d5f7f2, #9dcff7 40%, #f4d6a4 100%);
  color: #0d1d2e;
}

.vehicle-icon {
  font-size: 6rem;
  filter: drop-shadow(0 18px 24px rgba(22, 35, 48, 0.18));
}

.vehicle-meta h3 {
  margin: 8px 0 0;
  font-size: clamp(2rem, 3.5vw, 3rem);
  letter-spacing: -0.06em;
}

.analytics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  padding: 12px 0 32px;
}

.analytics-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px 22px;
}

.analytics-card span {
  display: block;
  color: var(--muted);
  margin-bottom: 10px;
}

.analytics-card strong {
  font-size: 1.2rem;
}

.fleet,
.booking,
.admin-section {
  padding-top: 54px;
  padding-bottom: 54px;
}

.section-heading {
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 15px 0 0;
  font-size: clamp(2rem, 3vw, 3rem);
  letter-spacing: -0.05em;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.vehicle-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.vehicle-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.vehicle-symbol {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.06);
}

.vehicle-badge {
  padding: 0.42rem 0.65rem;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.12);
  color: #ffd978;
  font-size: 0.68rem;
  font-weight: 800;
}

.vehicle-card h3 {
  margin: 0;
  font-size: 1.4rem;
}

.vehicle-type {
  color: var(--muted);
  margin-top: 6px;
  display: block;
}

.vehicle-meta-list {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 0.85rem;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.vehicle-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.price span {
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: 500;
}

.booking-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

.booking-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 24px;
}

.form-row {
  margin-bottom: 20px;
}

.form-row label {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-weight: 600;
  color: var(--muted);
}

input,
select {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  min-height: 52px;
  padding: 0.8rem 0.95rem;
}

.dual {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.summary-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(79, 209, 197, 0.08);
  border: 1px solid rgba(79, 209, 197, 0.2);
  border-radius: 16px;
  padding: 18px 16px;
  margin-bottom: 18px;
}

.summary-box span {
  color: var(--muted);
}

.summary-box strong {
  font-size: 1.8rem;
  letter-spacing: -0.06em;
}

.wide {
  width: 100%;
}

.history-panel h3 {
  margin-top: 0;
  font-size: 1.6rem;
}

.history-list {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.history-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px 16px;
}

.history-item strong {
  display: block;
  margin-bottom: 4px;
}

.history-item span {
  color: var(--muted);
  display: block;
  font-size: 0.82rem;
}

.empty-state {
  color: var(--muted);
  margin: 0;
}

.admin-section {
  display: none;
}

.admin-section.visible {
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px;
}

.metric-card span {
  color: var(--muted);
}

.metric-card strong {
  display: block;
  margin-top: 8px;
  font-size: 2rem;
  letter-spacing: -0.06em;
}

.admin-table-wrap {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 22px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem 1.1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

th {
  font-size: 0.74rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(5, 11, 16, 0.7);
  z-index: 50;
}

.modal.hidden,
.hidden {
  display: none !important;
}

.modal-panel {
  width: min(480px, calc(100% - 32px));
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 24px;
  position: relative;
  box-shadow: var(--shadow);
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: var(--text);
  background: rgba(255, 255, 255, 0.04);
}

.auth-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.tab-btn {
  flex: 1;
  min-height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--muted);
  font-weight: 700;
}

.tab-btn.active {
  background: rgba(79, 209, 197, 0.12);
  color: var(--text);
}

@media (max-width: 980px) {
  .hero-grid,
  .booking-grid,
  .vehicle-grid {
    grid-template-columns: 1fr 1fr;
  }

  .analytics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .main-nav,
  .account-actions {
    display: none;
  }

  .hero-grid,
  .booking-grid,
  .vehicle-grid,
  .analytics,
  .metrics-grid,
  .dual {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 32px;
  }

  .cta-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .vehicle-showcase {
    min-height: 220px;
  }
}
