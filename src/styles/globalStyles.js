const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    max-width: 100vw;
    overflow-x: hidden;
  }

  input, select, textarea, button {
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  input[type=number] { -moz-appearance: textfield; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; opacity: 0.6; }
  input[type=date]::-webkit-inner-spin-button { display: none; }
  input:focus, select:focus, textarea:focus, button:focus { outline: none; }
  input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #0a1220 inset !important; -webkit-text-fill-color: inherit !important; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

  @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin    { to { transform: rotate(360deg); } }

  select option { background: #0d1424; color: #e2e8f0; }

  /* Padding padrão do content — controlado só via CSS */
  .content-el { padding: 2rem; }

  .sidebar-el {
    transition: width 0.3s cubic-bezier(0.4,0,0.2,1),
                transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .sidebar-label, .sidebar-footer, .sidebar-user-info,
  .sidebar-toggle-label, .sidebar-theme-label {
    transition: opacity 0.2s ease, width 0.2s ease;
  }

  /* ── Desktop largo (1440px+) ─────────────────────────── */
  @media (min-width: 1440px) {
    .content-el { max-width: 1320px !important; }
  }

  /* ── Desktop padrão (1025–1439px) ───────────────────── */
  @media (max-width: 1280px) {
    .metrics-grid { gap: 12px !important; }
    .content-el   { padding: 1.5rem !important; }
  }

  /* ── Tablet (768–1024px) ─────────────────────────────── */
  @media (max-width: 1024px) {
    .sidebar-el          { width: 64px !important; min-width: 64px !important; }
    .main-el             { margin-left: 64px !important; }
    .sidebar-label       { opacity: 0 !important; width: 0 !important; overflow: hidden !important; white-space: nowrap !important; }
    .sidebar-footer      { display: none !important; }
    .sidebar-user-info   { display: none !important; }
    .sidebar-logo-text   { display: none !important; }
    .sidebar-theme-label { display: none !important; }
    .sidebar-toggle-label{ display: none !important; }
    .sidebar-nav-btn     { justify-content: center !important; padding: 0.75rem !important; gap: 0 !important; margin: 2px 8px !important; width: calc(100% - 16px) !important; border-left: none !important; border-radius: 12px !important; }
    .sidebar-theme-btn   { justify-content: center !important; padding: 0.65rem !important; }
    .sidebar-user-card   { justify-content: center !important; padding: 0.75rem 0 !important; }
    .sidebar-logo        { justify-content: center !important; padding: 0 0.75rem 1.5rem !important; }
    .metrics-grid        { grid-template-columns: repeat(2,1fr) !important; }
    .two-col             { grid-template-columns: 1fr !important; }
    .charts-grid         { grid-template-columns: 1fr !important; }
    .evo-row             { grid-template-columns: repeat(3,1fr) !important; }
    .metas-grid          { grid-template-columns: 1fr !important; }
    .content-el          { padding: 1.25rem !important; }
    .extrato-filters     { gap: 8px !important; }
    .rel-main            { grid-template-columns: 1fr !important; }
    .rel-metrics         { grid-template-columns: repeat(3,1fr) !important; }
    .rel-insights        { grid-template-columns: 1fr 1fr !important; }
  }

  /* ── Mobile (< 768px) — todos os celulares ───────────── */
  @media (max-width: 767px) {
    .sidebar-el          { transform: translateX(-100%) !important; width: 240px !important; min-width: 240px !important; position: fixed !important; z-index: 200 !important; }
    .sidebar-el.open     { transform: translateX(0) !important; }
    .sidebar-label       { opacity: 1 !important; width: auto !important; }
    .sidebar-footer      { display: flex !important; }
    .sidebar-user-info   { display: block !important; }
    .sidebar-logo-text   { display: inline !important; }
    .sidebar-theme-label { display: flex !important; }
    .sidebar-toggle-label{ display: block !important; }
    .sidebar-nav-btn     { justify-content: flex-start !important; padding: 0.75rem 1.5rem !important; gap: 12px !important; margin: 2px 0.75rem !important; width: calc(100% - 1.5rem) !important; }
    .sidebar-user-card   { justify-content: flex-start !important; padding: 0.875rem 1rem !important; }
    .sidebar-logo        { justify-content: flex-start !important; padding: 0 1.5rem 2rem !important; }
    .main-el             { margin-left: 0 !important; width: 100% !important; overflow-x: hidden !important; }
    .mobile-btn          { display: none !important; }
    .content-el          { padding: 0.875rem !important; padding-bottom: 96px !important; width: 100% !important; max-width: 100% !important; overflow-x: hidden !important; }
    .metrics-grid        { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
    .two-col             { grid-template-columns: 1fr !important; }
    .charts-grid         { grid-template-columns: 1fr !important; }
    .evo-row             { grid-template-columns: repeat(2,1fr) !important; }
    .metas-grid          { grid-template-columns: 1fr !important; }
    .rel-metrics         { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
    .rel-main            { grid-template-columns: 1fr !important; }
    .rel-insights        { grid-template-columns: 1fr !important; }
    .extrato-filters     { flex-direction: column !important; align-items: stretch !important; }
    .extrato-filters select, .extrato-filters input { width: 100% !important; }
    .extrato-summary     { flex-direction: column !important; gap: 6px !important; }
    .export-btns         { width: 100% !important; }
    .export-btns button  { flex: 1 !important; justify-content: center !important; }
    .header-el           { padding: 0.75rem 1rem !important; }
    .header-title        { font-size: 14px !important; }
    .txn-meta            { display: none !important; }
    .txn-amount          { font-size: 13px !important; }
  }

  /* ── Telas muito pequenas (< 380px) — Galaxy A, etc ─── */
  @media (max-width: 379px) {
    .content-el          { padding: 0.75rem !important; }
    .metrics-grid        { grid-template-columns: 1fr !important; }
    .rel-metrics         { grid-template-columns: 1fr !important; }
  }
`;

export default globalStyles;