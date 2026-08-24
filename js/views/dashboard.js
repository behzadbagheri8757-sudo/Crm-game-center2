/* js/views/dashboard.js — Daily Command Center
   UI/derived metrics only. Existing accounting logic remains authoritative.
*/
'use strict';

(function (global) {
  const ICO = {
    invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2.5H7.2A2 2 0 0 0 5.2 4.5v15a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2V7.5L14 2.5z"/><path d="M14 2.5v5h5"/><path d="M8.5 12h7M8.5 15.5h5M8.5 8.5h3"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3.25"/><path d="M3.5 20v-.8a4.7 4.7 0 0 1 4.7-4.7h1.6A4.7 4.7 0 0 1 14.5 19.2v.8"/><path d="M16.5 4.2a3.1 3.1 0 0 1 0 5.8"/><path d="M17.6 14.6a4.1 4.1 0 0 1 2.9 3.8V20"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8 3.6 7.2v9.6L12 21.2l8.4-4.4V7.2L12 2.8z"/><path d="M12 12.2 3.6 7.2M12 12.2l8.4-5M12 12.2V21.2"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/><path d="M7 15h4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.8 4.5h12.4v10.5H1.8z"/><path d="M14.2 8.5H19l3.2 3.5v3H14.2"/><circle cx="6" cy="17.8" r="1.9"/><circle cx="17.5" cy="17.8" r="1.9"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M4.5 10.5 12 5l7.5 5.5"/><path d="M5 10.5V21M9 10.5V21M15 10.5V21M19 10.5V21"/><path d="M3.5 10.5h17"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10.2c0 6-8 11.3-8 11.3S4 16.2 4 10.2a8 8 0 1 1 16 0z"/><circle cx="12" cy="10.2" r="2.6"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V10M9.5 19V5M15 19v-7M20.5 19V8"/><path d="M3 19h18"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/></svg>',
    warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18M4.5 20.5V9.5L12 4.5l7.5 5v11"/><path d="M9 20.5v-6h6v6"/></svg>',
    target: '<svg viewBox="0 0 48 48" width="38" height="38" fill="none"><defs><linearGradient id="dmtTargetGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F6E4A8"/><stop offset="1" stop-color="#A67A1F"/></linearGradient><filter id="dmtTSh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.3" flood-color="#6B4A10" flood-opacity=".4"/></filter></defs><g filter="url(#dmtTSh)"><circle cx="18.5" cy="27" r="13.5" stroke="url(#dmtTargetGrad)" stroke-width="2.3" fill="rgba(243,217,139,.08)"/><circle cx="18.5" cy="27" r="8.2" stroke="url(#dmtTargetGrad)" stroke-width="2.2" fill="none"/><circle cx="18.5" cy="27" r="3" fill="url(#dmtTargetGrad)"/><!-- shaft toward center --><path d="M41 7.5 L24.5 20.2" stroke="url(#dmtTargetGrad)" stroke-width="2.5" stroke-linecap="round"/><!-- arrowhead pointing into bullseye --><path d="M24.5 20.2 L29.8 19.2 L26.2 24.1 Z" fill="url(#dmtTargetGrad)"/><!-- tail feathers at outer end --><path d="M41 7.5 L41 13.2 M41 7.5 L35.3 7.5" stroke="url(#dmtTargetGrad)" stroke-width="2.1" stroke-linecap="round"/></g></svg>',
    growth: '<svg viewBox="0 0 48 48" width="40" height="40" fill="none"><defs><linearGradient id="dmtGrowBar" x1="0" y1="40" x2="0" y2="8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B3812E"/><stop offset="1" stop-color="#F3D98B"/></linearGradient><linearGradient id="dmtGrowLine" x1="6" y1="36" x2="42" y2="8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#E8C56A"/><stop offset="1" stop-color="#FFF1C2"/></linearGradient><filter id="dmtGSh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#5C3A0E" flood-opacity=".3"/></filter></defs><g filter="url(#dmtGSh)"><rect x="6" y="28" width="8" height="12" rx="2" fill="url(#dmtGrowBar)" opacity=".85"/><rect x="18" y="20" width="8" height="20" rx="2" fill="url(#dmtGrowBar)" opacity=".95"/><rect x="30" y="12" width="8" height="28" rx="2" fill="url(#dmtGrowBar)"/><path d="M8 34 L16 26 L24 28 L34 14" stroke="url(#dmtGrowLine)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M34 14 L34 20 M34 14 L28 14" stroke="url(#dmtGrowLine)" stroke-width="2.2" stroke-linecap="round"/></g></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.2 5.2 4h13.6L21 9.2"/><path d="M4 9.2V20h16V9.2"/><path d="M9.5 20v-6h5v6"/><path d="M3 9.2h18"/></svg>' 
  };

  function normalizeDigits(v) {
    return String(v || '').replace(/[۰-۹]/g, function (d) { return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)); }).replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); });
  }

  function money(v) { return toman(Math.round(Number(v) || 0)) + ' ت'; }

  function deltaHtml(pct) {
    if (pct === null || pct === undefined || !isFinite(pct)) return '<span class="kpi-delta flat">بدون مقایسه</span>';
    const n = Math.round(pct * 10) / 10;
    if (n > 0) return '<span class="kpi-delta up">↑ ' + esc(String(n).replace('-', '')) + '٪</span> <span>نسبت به بازه مشابه</span>';
    if (n < 0) return '<span class="kpi-delta down">↓ ' + esc(String(Math.abs(n))) + '٪</span> <span>نسبت به بازه مشابه</span>';
    return '<span class="kpi-delta flat">۰٪</span> <span>بدون تغییر</span>';
  }

  function dashTile(href, ico, title, sub) {
    return '<a class="dash-tile" href="' + href + '"><span class="dash-ico">' + ico + '</span><span class="dash-title">' + title + '</span>' + (sub ? '<span class="dash-sub">' + sub + '</span>' : '') + '</a>';
  }

  function recentInvoicesHtml() {
    const invs = (data.invoices || []).slice().sort(function (a, b) {
      return (b.date || '').localeCompare(a.date || '') || String(b.number || '').localeCompare(String(a.number || ''));
    }).slice(0, 5);
    if (!invs.length) return '';
    const rows = invs.map(function (inv) {
      const cust = (data.customers || []).find(function (c) { return c.id === inv.customerId; });
      return '<a class="ledger-row" href="#/invoice?id=' + encodeURIComponent(inv.id) + '"><span class="name">فاکتور #' + esc(String(inv.number || '')) + '<span class="sub">' + esc(cust ? cust.name : '—') + ' — ' + faDate(inv.date) + '</span></span><span class="filler"></span><span class="amount">' + money(inv.total) + '</span></a>';
    }).join('');
    return '<div class="dashboard-block"><div class="dashboard-block-head"><div class="dash-section-label">آخرین فاکتورها</div><a class="section-action" href="#/invoices">همه ←</a></div><div class="dash-activity">' + rows + '</div></div>';
  }

  function recentVisitsHtml() {
    const items = [];
    (data.customers || []).forEach(function (c) {
      (c.visits || []).forEach(function (v) { items.push({ customerId: c.id, name: c.name, date: v.date, time: v.time, result: v.result }); });
    });
    items.sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || (b.time || '').localeCompare(a.time || ''); });
    const top = items.slice(0, 5);
    if (!top.length) return '';
    const rows = top.map(function (v) {
      return '<a class="ledger-row" href="#/customer?id=' + encodeURIComponent(v.customerId) + '"><span class="name">' + esc(v.name) + '<span class="sub">' + faDate(v.date) + (v.time ? ' ' + esc(v.time) : '') + (v.result ? ' — ' + esc(v.result) : '') + '</span></span><span class="filler"></span><span class="amount">ویزیت</span></a>';
    }).join('');
    return '<div class="dashboard-block"><div class="dashboard-block-head"><div class="dash-section-label">آخرین ویزیت‌ها</div><a class="section-action" href="#/visits">همه ←</a></div><div class="dash-activity">' + rows + '</div></div>';
  }

  function targetHtml(metrics) {
    const target = typeof getMonthlySalesTarget === 'function' ? getMonthlySalesTarget() : 0;
    const sales = Number(metrics.mtdSales) || 0;
    const pct = target > 0 ? Math.round((sales / target) * 100) : 0;
    const capped = Math.min(100, Math.max(0, pct));
    const done = target > 0 && sales >= target;
    return (
      '<div class="dash-target-block">' +
        '<button type="button" class="dash-target-fab" data-monthly-target aria-label="تنظیم هدف فروش">' +
          ICO.target +
        '</button>' +
        '<div class="dash-monthly-target ' + (done ? 'is-done' : '') + '">' +
          '<div class="dmt-top">' +
            '<span class="dmt-title">هدف فروش این ماه</span>' +
            '<span class="dmt-growth" aria-hidden="true">' + ICO.growth + '</span>' +
          '</div>' +
          '<div class="dmt-row">' +
            '<div class="dmt-progress"><div class="dmt-bar"><span style="width:' + capped + '%"></span></div></div>' +
            '<span class="dmt-pct">' + (target > 0 ? pct + '٪' : '—') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function bindMonthlyTarget(root, refresh) {
    const btn = root.querySelector('[data-monthly-target]');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      const current = typeof getMonthlySalesTarget === 'function' ? getMonthlySalesTarget() : 0;
      const raw = prompt('هدف فروش ماهانه را به تومان وارد کنید:', current ? String(current) : '');
      if (raw === null) return;
      const normalized = normalizeDigits(raw).replace(/[,_\s]/g, '');
      const value = Number(normalized);
      if (!(value > 0)) { if (typeof showToast === 'function') showToast('هدف باید بیشتر از صفر باشد'); return; }
      if (typeof setMonthlySalesTarget === 'function') setMonthlySalesTarget(value);
      refresh();
    });
  }

  async function renderInto(root, isStale) {
    const metrics = typeof commandCenterMetrics === 'function' ? commandCenterMetrics(new Date()) : { mtdSales: globalTotals().monthSales, mtdProfit: 0, salesDeltaPct: null, profitDeltaPct: null };
    const g = globalTotals();
    const invVal = inventoryValue();
    const custN = (data.customers || []).length;
    const prodN = (data.products || []).length;
    const invN = (data.invoices || []).length;
    const payN = (data.payments || []).length;
    const chkN = (data.checks || []).length;
    if (typeof isStale === 'function' && isStale()) return;

    root.innerHTML =
      '<div class="dashboard-shell">' +
      '<h2 class="section-title">داشبورد</h2>' +
      '<div class="dashboard-eyebrow">مرکز فرماندهی روزانه</div>' +
      targetHtml(metrics) +
      '<div class="dashboard-block"><div class="dashboard-block-head"><div class="dash-section-label">خلاصه وضعیت</div></div>' +
      '<div class="dash-kpis">' +
      '<div class="dash-kpi sales"><div class="dash-kpi-label">فروش این ماه</div><div class="dash-kpi-value sales">' + money(metrics.mtdSales) + '</div><div class="dash-kpi-sub">' + deltaHtml(metrics.salesDeltaPct) + '</div></div>' +
      '<div class="dash-kpi profit"><div class="dash-kpi-label">سود این ماه</div><div class="dash-kpi-value profit">' + money(metrics.mtdProfit) + '</div><div class="dash-kpi-sub">' + deltaHtml(metrics.profitDeltaPct) + '</div></div>' +
      '<div class="dash-kpi inventory"><div class="dash-kpi-label">ارزش موجودی انبار</div><div class="dash-kpi-value">' + money(invVal) + '</div><div class="dash-kpi-sub">ارزش فعلی موجودی</div></div>' +
      '<div class="dash-kpi debt"><div class="dash-kpi-label">بدهی مشتریان</div><div class="dash-kpi-value debt">' + money(g.customerDebt) + '</div><div class="dash-kpi-sub">' + debtorList(9999).length + ' بدهکار فعال</div></div>' +
      '</div></div>' +
      '<div class="dashboard-block"><div class="dashboard-block-head"><div class="dash-section-label">دسترسی سریع</div></div>' +
      '<div class="dash-grid">' +
      dashTile('#/prospects', ICO.shop, 'ارزیابی مغازه‌ها', '') +
      dashTile('#/visits', ICO.map, 'ویزیت مشتریان', '') +
      dashTile('#/reports', ICO.chart, 'گزارش‌ها', '') +
      dashTile('#/settings', ICO.gear, 'تنظیمات و بکاپ', '') +
      dashTile('#/invoices', ICO.invoice, 'فاکتورها', invN + ' فاکتور') +
      dashTile('#/customers', ICO.users, 'مشتریان', custN + ' نفر') +
      dashTile('#/payments', ICO.card, 'پرداخت‌ها', payN + ' مورد') +
      dashTile('#/products', ICO.box, 'اجناس', prodN + ' قلم') +
      dashTile('#/suppliers', ICO.truck, 'تامین‌کنندگان', (data.suppliers || []).length + ' نفر') +
      dashTile('#/checks', ICO.bank, 'چک‌ها', chkN + ' فقره') +
      dashTile('#/inventory', ICO.warehouse, 'انبار', money(invVal)) +
      '</div></div>' +
      recentInvoicesHtml() + recentVisitsHtml() +
      '</div>';

    bindMonthlyTarget(root, function () { renderInto(root, isStale); });
  }

  function mount(root, params) {
    if (!root) return function () {};
    const nav = document.getElementById('nav');
    if (nav) nav.style.display = 'none';
    let cancelled = false;
    let refreshToken = null;
    const isStale = function () { return cancelled; };
    function refreshDashboard() {
      renderInto(root, isStale).catch(function (e) { if (!cancelled) console.error('DashboardView refresh failed', e); });
    }
    refreshDashboard();
    if (typeof ViewHost !== 'undefined' && ViewHost.setRefresh) refreshToken = ViewHost.setRefresh(refreshDashboard);
    return function unmount() {
      cancelled = true;
      if (typeof ViewHost !== 'undefined' && ViewHost.clearRefresh) ViewHost.clearRefresh(refreshToken);
      refreshToken = null;
      if (nav) nav.style.display = '';
      root.innerHTML = '';
    };
  }

  global.DashboardView = { mount: mount, unmount: function () {} };
})(typeof window !== 'undefined' ? window : this);
