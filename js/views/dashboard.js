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
    // target icon – bullseye with arrow, now in gold to match the theme
    target: '<svg viewBox="0 0 463 463" width="40" height="40" style="width:40px;height:40px" fill="none" stroke="#C89B3C" stroke-width="1.8" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M462.429,60.63c-1.16-2.803-3.896-4.63-6.929-4.63H407V7.5c0-3.034-1.827-5.768-4.63-6.929 c-2.804-1.161-6.028-0.519-8.174,1.626l-57.941,57.941C325.773,70.621,320,84.558,320,99.383v33.011l-12.225,12.225 C275.063,114.456,231.399,96,183.5,96C82.318,96,0,178.318,0,279.5S82.318,463,183.5,463S367,380.683,367,279.5 c0-47.899-18.455-91.562-48.618-124.275L330.607,143h33.011c14.824,0,28.761-5.773,39.244-16.256l57.941-57.941 C462.948,66.659,463.59,63.433,462.429,60.63z M335,99.383c0-10.818,4.213-20.989,11.862-28.638L392,25.607v34.787l-57,57V99.383z M352,279.5c0,92.911-75.589,168.5-168.5,168.5S15,372.412,15,279.5S90.589,111,183.5,111c43.763,0,83.679,16.775,113.667,44.226 l-23.354,23.354C249.825,157.091,218.165,144,183.5,144C108.785,144,48,204.786,48,279.5S108.785,415,183.5,415 S319,354.215,319,279.5c0-34.665-13.09-66.325-34.58-90.313l23.354-23.354C335.226,195.821,352,235.737,352,279.5z M208,279.5 c0,13.509-10.99,24.5-24.5,24.5S159,293.01,159,279.5s10.99-24.5,24.5-24.5c4.027,0,7.827,0.983,11.182,2.711l-16.485,16.485 c-2.929,2.929-2.929,7.678,0,10.606c1.465,1.464,3.385,2.197,5.304,2.197s3.839-0.732,5.304-2.197l16.485-16.485 C207.018,271.674,208,275.474,208,279.5z M205.61,246.784c-6.313-4.28-13.924-6.784-22.109-6.784c-21.78,0-39.5,17.72-39.5,39.5 s17.72,39.5,39.5,39.5s39.5-17.72,39.5-39.5c0-8.185-2.503-15.796-6.784-22.109l23.548-23.548 C249.906,246.317,256,262.208,256,279.5c0,39.977-32.523,72.5-72.5,72.5S111,319.477,111,279.5s32.523-72.5,72.5-72.5 c17.292,0,33.183,6.094,45.657,16.236L205.61,246.784z M239.81,212.584C224.58,199.748,204.93,192,183.5,192 c-48.248,0-87.5,39.252-87.5,87.5s39.252,87.5,87.5,87.5s87.5-39.252,87.5-87.5c0-21.429-7.748-41.08-20.584-56.31l23.384-23.384 c18.782,21.257,30.2,49.165,30.2,79.693c0,66.444-54.056,120.5-120.5,120.5S63,345.944,63,279.5S117.056,159,183.5,159 c30.529,0,58.437,11.418,79.693,30.2L239.81,212.584z M392.255,116.138c-7.649,7.65-17.819,11.862-28.637,11.862h-18.011l57-57 h34.787L392.255,116.138z"></path></g></svg>',
    // growth icon – bar chart, now larger (56px) and with gold stroke
    growth: '<svg viewBox="0 0 24 24" width="56" height="56" style="width:56px;height:56px" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M14 14C14 13.4477 14.4477 13 15 13H17C17.5523 13 18 13.4477 18 14V18C18 18.5523 17.5523 19 17 19H15C14.4477 19 14 18.5523 14 18V14Z" stroke="#C89B3C" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V18C14 18.5523 13.5523 19 13 19H11C10.4477 19 10 18.5523 10 18V16Z" stroke="#C89B3C" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 17C6 16.4477 6.44772 16 7 16H9C9.55228 16 10 16.4477 10 17V18C10 18.5523 9.55228 19 9 19H7C6.44772 19 6 18.5523 6 18V17Z" stroke="#C89B3C" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 19H20" stroke="#C89B3C" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.5 11C6.0529 11.285 6.81216 11.4045 7.72169 11.3498C8.63123 11.295 9.6678 11.0674 10.7548 10.6836C11.8418 10.2999 12.9515 9.76988 14.0019 9.13275C15.0523 8.49563 16.0166 7.76767 16.8235 7.00266M14.7802 6.59182L16.9845 6.89165L16.369 9.3436" stroke="#C89B3C" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>',
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