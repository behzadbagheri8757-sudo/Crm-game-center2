/* js/views/dashboard.js — Daily Command Center
   UI/derived metrics only. Existing accounting logic remains authoritative.
*/
'use strict';

(function (global) {
  const ICO = {
    invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2.5H7A1.75 1.75 0 0 0 5.25 4.25v15.5A1.75 1.75 0 0 0 7 21.5h10a1.75 1.75 0 0 0 1.75-1.75V7.5L14 2.5z"/><path d="M14 2.5v5h5"/><path d="M8.25 11.25h7.5M8.25 14.5h7.5M8.25 17.75h4.5"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="7" r="3"/><path d="M2.75 19.25v-.5A4.5 4.5 0 0 1 7.25 14.25h2.5a4.5 4.5 0 0 1 4.5 4.5v.5"/><circle cx="17" cy="7.5" r="2.4"/><path d="M16 14.4a3.75 3.75 0 0 1 5.25 3.4v1.45"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.75 3.5 7v10l8.5 4.25L20.5 17V7L12 2.75z"/><path d="M12 12 3.5 7M12 12l8.5-5M12 12v9.25"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.25"/><path d="M2.5 9.5h19"/><path d="M6.5 14.5h4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M1.75 4.75h12.5v10.5H1.75z"/><path d="M14.25 9h4.5L21.25 12.5v2.75h-7"/><circle cx="6.25" cy="17.75" r="1.75"/><circle cx="17.25" cy="17.75" r="1.75"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18"/><path d="M4.25 10.25 12 4.5l7.75 5.75"/><path d="M5.5 10.25V20.5M9.5 10.25V20.5M14.5 10.25V20.5M18.5 10.25V20.5"/><path d="M3.5 10.25h17"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 5.5-8 11.25-8 11.25S4 15.5 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V9M9.5 19.5V4.5M15 19.5v-6M20.5 19.5V8"/><path d="M2.75 19.5h18.5"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.86 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18"/><path d="M4.5 20.5V9.25L12 4.25l7.5 5V20.5"/><path d="M9 20.5v-5.5h6v5.5"/></svg>',
    target: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#C89B3C" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="12" r="8"/><circle cx="13.5" cy="12" r="5"/><circle cx="13.5" cy="12" r="2"/><path d="M2 12 H9.2"/><path d="M6.2 8.8 L9.5 12 L6.2 15.2"/></svg>',
    growth: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C89B3C" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V12"/><path d="M9 20V8"/><path d="M14 20V5"/><path d="M3 14 L8 9 L12 12 L19 4"/><path d="M15.2 4.2 L19 4 L18.2 7.8"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9 5.25 3.75h13.5L21 9"/><path d="M4 9v11h16V9"/><path d="M9.5 20v-5.5h5V20"/><path d="M3 9h18"/></svg>'
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
        '<div class="dash-target-fab-row">' +
          '<button type="button" class="dash-target-fab" data-monthly-target aria-label="تنظیم هدف فروش">' +
            ICO.target +
          '</button>' +
        '</div>' +
        '<div class="dash-monthly-target ' + (done ? 'is-done' : '') + '">' +
          '<div class="dmt-top">' +
            '<div class="dmt-heading">' +
              '<span class="dmt-growth" aria-hidden="true">' + ICO.growth + '</span>' +
              '<span class="dmt-title">هدف فروش این ماه</span>' +
            '</div>' +
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
