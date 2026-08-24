/* js/views/dashboard.js — Daily Command Center
   UI/derived metrics only. Existing accounting logic remains authoritative.
*/
'use strict';

(function (global) {
  const ICO = {
    invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="4" width="13" height="12" rx="1.5"/><path d="M14.5 8H19l3.5 3.5V16h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/><path d="M4 10h16"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6.5-8 12-8 12S4 16.5 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2.8-2.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.8-2.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.8 2.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4h-.1a1.7 1.7 0 0 0-1.6.9Z"/></svg>',
    warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V9l7-4 7 4v12"/><path d="M9 21v-6h6v6"/></svg>',
    target: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none"><circle cx="13" cy="13" r="8.2" stroke="#C89B3C" stroke-width="1.6"/><circle cx="13" cy="13" r="5.1" stroke="#C89B3C" stroke-width="1.6"/><circle cx="13" cy="13" r="1.7" fill="#C89B3C"/><path d="M3 4 11.6 11.4" stroke="#C89B3C" stroke-width="1.7" stroke-linecap="round"/><path d="M2.1 5.4 3.9 2.6" stroke="#C89B3C" stroke-width="1.5" stroke-linecap="round"/><path d="M11.6 11.4 8.3 10.6 10.4 8.2Z" fill="#C89B3C"/></svg>',
    moneyBag: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none"><path d="M9.4 4.8 7.7 2.3h8.6l-1.7 2.5" stroke="#8A6423" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.4 4.8c-3.6 1-6.2 4.8-6.2 9.1 0 4.9 4 8.3 8.8 8.3s8.8-3.4 8.8-8.3c0-4.3-2.6-8.1-6.2-9.1" fill="#C89B3C"/><text x="12" y="17.6" text-anchor="middle" font-size="8.6" font-weight="700" fill="#6B4A1A" font-family="Arial, Tahoma, sans-serif">$</text></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 5 4h14l2 5.5"/><path d="M4 9.5V20h16V9.5"/><path d="M9 20v-6h6v6"/><path d="M3 9.5h18"/></svg>'
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

  function targetFabHtml() {
    return '<button type="button" class="dash-target-fab" data-monthly-target aria-label="تنظیم هدف فروش">' + ICO.target + '</button>';
  }

  function targetHtml(metrics) {
    const target = typeof getMonthlySalesTarget === 'function' ? getMonthlySalesTarget() : 0;
    const sales = Number(metrics.mtdSales) || 0;
    const pct = target > 0 ? Math.round((sales / target) * 100) : 0;
    const capped = Math.min(100, Math.max(0, pct));
    const done = target > 0 && sales >= target;
    return (
      '<div class="dash-monthly-target ' + (done ? 'is-done' : '') + '">' +
        '<div class="dmt-top">' +
          '<span class="dmt-icon-plain">' + ICO.moneyBag + '</span>' +
          '<span class="dmt-label">هدف فروش این ماه</span>' +
        '</div>' +
        '<div class="dmt-row">' +
          '<div class="dmt-progress"><div class="dmt-bar"><span style="width:' + capped + '%"></span></div></div>' +
          '<span class="dmt-pct">' + (target > 0 ? pct + '٪' : '—') + '</span>' +
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
      '<h2 class="section-title">داشبورد' + targetFabHtml() + '</h2>' +
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
