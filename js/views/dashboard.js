/* js/views/dashboard.js — SPA Dashboard: Daily Command Center
   Warm Commerce visual + operational hierarchy.
   Reuses commandCenterMetrics / globalTotals / actionableDebtors (read-only).
   No FIFO/payment/invoice mutation logic.
*/
'use strict';

(function (global) {
  const ICO = {
    target:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>',
    trendUp:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>',
    trendDown:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 7 9 13 13 9 21 17"/><polyline points="14 17 21 17 21 10"/></svg>',
    cash:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>',
    invoice:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    users:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    pay:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    alert:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    chart:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
  };

  function deltaHtml(pct) {
    if (pct > 0.05) {
      return (
        '<span class="cc-delta cc-delta-up">' +
        ICO.trendUp +
        ' ' +
        pct.toLocaleString('fa-IR') +
        '٪ نسبت به بازه مشابه ماه قبل</span>'
      );
    }
    if (pct < -0.05) {
      return (
        '<span class="cc-delta cc-delta-down">' +
        ICO.trendDown +
        ' ' +
        Math.abs(pct).toLocaleString('fa-IR') +
        '٪ نسبت به بازه مشابه ماه قبل</span>'
      );
    }
    return '<span class="cc-delta cc-delta-flat">بدون تغییر معنادار نسبت به بازه مشابه ماه قبل</span>';
  }

  function navigate(path, params) {
    if (typeof AppRouter !== 'undefined' && AppRouter.navigate) {
      AppRouter.navigate(path, params || {});
    } else {
      location.hash = '#' + path;
    }
  }

  function targetCardHtml(mtdSales, target) {
    const hasTarget = target > 0;
    const pct = hasTarget ? Math.round((mtdSales / target) * 1000) / 10 : 0;
    const barPct = hasTarget ? Math.min(100, Math.max(0, (mtdSales / target) * 100)) : 0;
    const over = hasTarget && mtdSales >= target;
    const remain = hasTarget ? Math.max(0, target - mtdSales) : 0;

    let statusLine = '';
    if (!hasTarget) {
      statusLine = '<div class="cc-target-hint">هدف ماهانه تنظیم نشده — برای انگیزه روزانه یک هدف تعیین کنید</div>';
    } else if (over) {
      statusLine =
        '<div class="cc-target-hint cc-target-over">هدف محقق شد ✓ — ' +
        toman(mtdSales - target) +
        ' ت بالاتر از هدف</div>';
    } else {
      statusLine =
        '<div class="cc-target-hint">' + toman(remain) + ' ت تا رسیدن به هدف</div>';
    }

    return (
      '<div class="cc-card cc-target-card' +
      (over ? ' is-complete' : '') +
      '">' +
      '<div class="cc-target-top">' +
      '<div class="cc-target-title">هدف فروش ماهانه</div>' +
      '<button type="button" class="cc-target-icon-btn" id="cc-edit-target" title="تنظیم هدف" aria-label="تنظیم هدف فروش">' +
      ICO.target +
      '</button></div>' +
      '<div class="cc-target-pct' +
      (over ? ' is-over' : '') +
      '">' +
      (hasTarget ? pct.toLocaleString('fa-IR') + '٪' : '—') +
      '</div>' +
      '<div class="cc-progress" role="progressbar" aria-valuenow="' +
      Math.round(barPct) +
      '" aria-valuemin="0" aria-valuemax="100">' +
      '<div class="cc-progress-fill' +
      (over ? ' is-over' : '') +
      '" style="width:' +
      barPct +
      '%"></div></div>' +
      statusLine +
      '</div>'
    );
  }

  function salesCardHtml(m) {
    return (
      '<div class="cc-card cc-sales-card">' +
      '<div class="cc-card-label">فروش ماه جاری</div>' +
      '<div class="cc-card-value">' +
      toman(m.mtdSales) +
      ' <span class="cc-unit">ت</span></div>' +
      '<div class="cc-card-sub">' +
      (m.mtdCount || 0).toLocaleString('fa-IR') +
      ' فاکتور · ' +
      (m.jd || 0).toLocaleString('fa-IR') +
      ' روز از ماه</div>' +
      deltaHtml(m.salesDeltaPct) +
      '</div>'
    );
  }

  function profitCardHtml(m) {
    return (
      '<div class="cc-card cc-profit-card">' +
      '<div class="cc-card-label">سود ماه جاری</div>' +
      '<div class="cc-card-value cc-value-sm">' +
      toman(m.mtdProfit) +
      ' <span class="cc-unit">ت</span></div>' +
      deltaHtml(m.profitDeltaPct) +
      '</div>'
    );
  }

  function receivablesCardHtml() {
    const list = typeof actionableDebtors === 'function' ? actionableDebtors(3) : [];
    const totalDebt =
      typeof globalTotals === 'function' ? globalTotals().customerDebt : 0;
    const rows = list
      .map(function (x) {
        return (
          '<a class="cc-debt-row" href="#/customer?id=' +
          encodeURIComponent(x.c.id) +
          '">' +
          '<span class="cc-debt-name">' +
          esc(x.c.name || '—') +
          '</span>' +
          '<span class="cc-debt-amt">' +
          toman(x.t.balance) +
          ' ت</span></a>'
        );
      })
      .join('');

    return (
      '<div class="cc-card cc-recv-card">' +
      '<div class="cc-recv-head">' +
      '<span class="cc-card-label">مطالبات نیازمند اقدام</span>' +
      '<span class="cc-recv-ico">' +
      ICO.alert +
      '</span></div>' +
      (list.length
        ? '<div class="cc-recv-sum">بیشترین مانده‌ها برای پیگیری</div>' +
          '<div class="cc-debt-list">' +
          rows +
          '</div>' +
          '<a class="cc-link" href="#/reports">مشاهده گزارش مطالبات ←</a>'
        : '<div class="cc-recv-empty">مانده قابل پیگیری ثبت نشده</div>') +
      (totalDebt > 0 && !list.length
        ? ''
        : totalDebt > 0
          ? '<div class="cc-recv-foot">جمع بدهی مشتریان: ' + toman(totalDebt) + ' ت</div>'
          : '') +
      '</div>'
    );
  }

  function quickActionsHtml() {
    return (
      '<div class="cc-section-label">اقدام سریع</div>' +
      '<div class="cc-actions">' +
      '<button type="button" class="cc-action" data-cc-act="invoice">' +
      '<span class="cc-action-ico">' +
      ICO.invoice +
      '</span><span>ثبت فاکتور</span></button>' +
      '<button type="button" class="cc-action" data-cc-act="payments">' +
      '<span class="cc-action-ico">' +
      ICO.cash +
      '</span><span>وصول</span></button>' +
      '<button type="button" class="cc-action" data-cc-act="pay">' +
      '<span class="cc-action-ico">' +
      ICO.pay +
      '</span><span>پرداخت‌ها</span></button>' +
      '<button type="button" class="cc-action" data-cc-act="customers">' +
      '<span class="cc-action-ico">' +
      ICO.users +
      '</span><span>مشتریان</span></button>' +
      '</div>'
    );
  }

  function bindDashboardEvents(root) {
    const targetBtn = root.querySelector('#cc-edit-target');
    if (targetBtn) {
      targetBtn.onclick = function () {
        const cur = typeof getMonthlySalesTarget === 'function' ? getMonthlySalesTarget() : 0;
        const v = prompt(
          'هدف فروش ماهانه (تومان):',
          cur > 0 ? String(Math.round(cur)) : '500000000'
        );
        if (v == null) return;
        const n = Number(String(v).replace(/[^\d.]/g, ''));
        if (!isFinite(n) || n < 0) {
          if (typeof showToast === 'function') showToast('عدد معتبر وارد کنید');
          return;
        }
        if (typeof setMonthlySalesTarget === 'function') setMonthlySalesTarget(n);
        if (typeof ViewHost !== 'undefined' && ViewHost.refreshCurrent) ViewHost.refreshCurrent();
        else refreshInto(root, function () { return false; });
      };
    }
    root.querySelectorAll('[data-cc-act]').forEach(function (btn) {
      btn.onclick = function () {
        const act = btn.getAttribute('data-cc-act');
        if (act === 'invoice') navigate('/invoices');
        else if (act === 'payments') navigate('/payments');
        else if (act === 'pay') navigate('/payments');
        else if (act === 'customers') navigate('/customers');
      };
    });
  }

  function refreshInto(root, isStale) {
    const m =
      typeof commandCenterMetrics === 'function'
        ? commandCenterMetrics(new Date())
        : {
            mtdSales: 0,
            mtdProfit: 0,
            mtdCount: 0,
            salesDeltaPct: 0,
            profitDeltaPct: 0,
            jd: 0
          };
    const target = typeof getMonthlySalesTarget === 'function' ? getMonthlySalesTarget() : 0;

    if (typeof isStale === 'function' && isStale()) return;

    root.innerHTML =
      '<h2 class="section-title cc-page-title">داشبورد</h2>' +
      targetCardHtml(m.mtdSales, target) +
      '<div class="cc-row-2">' +
      salesCardHtml(m) +
      profitCardHtml(m) +
      '</div>' +
      receivablesCardHtml() +
      quickActionsHtml() +
      '<div class="cc-foot-links">' +
      '<a class="cc-link" href="#/reports">' +
      ICO.chart +
      ' گزارش‌های کامل</a>' +
      '<a class="cc-link" href="#/settings">تنظیمات و بکاپ</a>' +
      '</div>';

    bindDashboardEvents(root);
  }

  function mount(root, params) {
    if (!root) return function () {};
    const nav = document.getElementById('nav');
    if (nav) nav.style.display = 'none';
    const fab = document.getElementById('fab');
    if (fab) {
      fab.style.display = 'none';
      fab.onclick = null;
    }

    let cancelled = false;
    let refreshToken = null;
    const isStale = function () {
      return cancelled;
    };
    function refreshDashboard() {
      try {
        refreshInto(root, isStale);
      } catch (e) {
        if (!cancelled) {
          console.error('DashboardView refresh failed', e);
          root.innerHTML =
            '<div class="empty">خطا در بارگذاری داشبورد. صفحه را دوباره باز کنید.</div>';
        }
      }
    }
    refreshDashboard();

    if (typeof ViewHost !== 'undefined' && ViewHost.setRefresh) {
      refreshToken = ViewHost.setRefresh(refreshDashboard);
    }

    return function unmount() {
      cancelled = true;
      if (typeof ViewHost !== 'undefined' && ViewHost.clearRefresh) {
        ViewHost.clearRefresh(refreshToken);
      }
      refreshToken = null;
      if (nav) nav.style.display = '';
      root.innerHTML = '';
    };
  }

  global.DashboardView = {
    mount: mount,
    unmount: function () {}
  };
})(typeof window !== 'undefined' ? window : this);
