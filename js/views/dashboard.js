/* js/views/dashboard.js — Daily Command Center
   UI/derived metrics only. Existing accounting logic remains authoritative.
*/
'use strict';

(function (global) {
  const ICO = {
    invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5L14 2.5z"/><path d="M14 2.5v5h5"/><path d="M8 11h8M8 15h5"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3.2"/><path d="M3.5 19.5v-.6A4.6 4.6 0 0 1 8.1 14.3h1.8a4.6 4.6 0 0 1 4.6 4.6v.6"/><path d="M16.4 4.4a3 3 0 0 1 0 5.6"/><path d="M17.6 14.5a4 4 0 0 1 2.9 3.8v1.2"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9L12 3z"/><path d="M12 12 3.5 7.5M12 12l8.5-4.5M12 12v9"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/><path d="M7 15h3.5"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.8 5h12.2v10.2H1.8z"/><path d="M14 9h4.2L21 12.5V15.2H14"/><circle cx="6" cy="17.8" r="1.8"/><circle cx="17.2" cy="17.8" r="1.8"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18"/><path d="M4.5 10.5 12 5l7.5 5.5"/><path d="M5.5 10.5V20.5M9.5 10.5V20.5M14.5 10.5V20.5M18.5 10.5V20.5"/><path d="M3.5 10.5h17"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10.2c0 5.8-8 11-8 11s-8-5.2-8-11a8 8 0 1 1 16 0z"/><circle cx="12" cy="10.2" r="2.5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9.5M9.5 19V5M15 19v-6M20.5 19V8"/><path d="M3 19h18"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.2M12 19v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.8 12H5M19 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>',
    warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18"/><path d="M4.5 20.5V9.5L12 4.5l7.5 5v11"/><path d="M9 20.5v-5.5h6v5.5"/></svg>',
    target: '<svg viewBox="0 0 48 48" width="40" height="40" fill="none"><defs><linearGradient id="dmtTargetGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F3D98B"/><stop offset="1" stop-color="#B3812E"/></linearGradient></defs><circle cx="20" cy="28" r="14" stroke="url(#dmtTargetGrad)" stroke-width="2.4" fill="none"/><circle cx="20" cy="28" r="9" stroke="url(#dmtTargetGrad)" stroke-width="2.2" fill="none"/><circle cx="20" cy="28" r="3.6" fill="url(#dmtTargetGrad)"/><path d="M38.5 9.5 L27.2 19.8" stroke="url(#dmtTargetGrad)" stroke-width="2.3" stroke-linecap="round"/><path d="M27.2 19.8 L32.4 18.4 L28.6 24.2 Z" fill="url(#dmtTargetGrad)"/><path d="M38.5 9.5 L38.5 14.8 M38.5 9.5 L33.2 9.5" stroke="url(#dmtTargetGrad)" stroke-width="2" stroke-linecap="round"/></svg>',
    growth: '<svg viewBox="0 0 48 48" width="36" height="36" fill="none"><defs><linearGradient id="dmtGrowBar" x1="0" y1="42" x2="0" y2="10" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#C89B3C"/><stop offset="1" stop-color="#F3D98B"/></linearGradient></defs><rect x="6" y="28" width="8" height="12" rx="2" fill="url(#dmtGrowBar)" opacity=".75"/><rect x="18" y="20" width="8" height="20" rx="2" fill="url(#dmtGrowBar)" opacity=".9"/><rect x="30" y="12" width="8" height="28" rx="2" fill="url(#dmtGrowBar)"/><path d="M8 30 L17 22 L26 24 L34 12" stroke="#F5E6B8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M34 12 L34 18.5 M34 12 L28.5 12" stroke="#F5E6B8" stroke-width="2.3" stroke-linecap="round"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.2 5.2 4h13.6L21 9.2"/><path d="M4 9.2V20h16V9.2"/><path d="M9.5 20v-5.5h5V20"/><path d="M3 9.2h18"/></svg>'
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
