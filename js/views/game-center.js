/* js/views/game-center.js — Sales Game SPA view
   UI/UX polish + Persian localization. Reads GameLogic snapshot only.
*/
'use strict';

(function (global) {
  function esc(s) {
    if (typeof global.esc === 'function') return global.esc(s);
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Persian digits, LTR-isolated so RTL does not reverse "0 / 15". */
  function faNum(n) {
    var v = Math.round(Number(n) || 0);
    var s;
    try { s = v.toLocaleString('fa-IR'); }
    catch (e) { s = String(v); }
    return '\u200E' + s + '\u200E';
  }

  function tomanLocal(n) {
    var s;
    if (typeof toman === 'function') s = toman(n);
    else {
      try { s = (Math.round(Number(n) || 0)).toLocaleString('fa-IR'); }
      catch (e) { s = String(Math.round(Number(n) || 0)); }
    }
    return '\u200E' + s + '\u200E';
  }

  var ICO = {
    /* Unified outline set — 24 viewBox, stroke 1.75, round caps */
    brand:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 19V10l8-6 8 6v9"/>' +
        '<path d="M9 19v-5h6v5"/>' +
        '<path d="M8 10.5h8"/>' +
        '<path d="M12 4v3"/>' +
      '</svg>',
    /* chart-up + small spark = sales growth game */
    brandMark:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 19h16"/>' +
        '<path d="M7 16l3.5-4.5 3 2.5L17 8"/>' +
        '<path d="M14.5 8H17v2.5"/>' +
      '</svg>',
    evaluation:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M9 4H8a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-1"/>' +
        '<rect x="9" y="2.75" width="6" height="3.5" rx="1"/>' +
        '<path d="M9 11h6M9 15h3.5"/>' +
      '</svg>',
    visit:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="9" cy="8" r="3.1"/>' +
        '<path d="M3.6 19.25v-.65A4.4 4.4 0 0 1 8 14.2h2a4.4 4.4 0 0 1 4.4 4.4v.65"/>' +
        '<path d="M16.3 5.4a2.7 2.7 0 0 1 0 5.2"/>' +
        '<path d="M17.5 14.25a3.7 3.7 0 0 1 2.9 3.4v1.6"/>' +
      '</svg>',
    sales:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 19h16"/>' +
        '<path d="M7 16V10"/>' +
        '<path d="M12 16V7"/>' +
        '<path d="M17 16v-4"/>' +
      '</svg>',
    /* checklist / tasks — Daily Missions */
    mission:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M9.5 6h9.5"/>' +
        '<path d="M9.5 12h9.5"/>' +
        '<path d="M9.5 18h9.5"/>' +
        '<path d="M4.5 6.1l1.2 1.2L7.7 5"/>' +
        '<path d="M4.5 12.1l1.2 1.2L7.7 11"/>' +
        '<path d="M4.5 18.1l1.2 1.2L7.7 17"/>' +
      '</svg>',
    /* target bullseye — Monthly Sales Target (distinct from mission) */
    monthly:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="8"/>' +
        '<circle cx="12" cy="12" r="3.25"/>' +
      '</svg>',
    /* chain links — Continuity / streak */
    streak:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M9.5 14.5l5-5"/>' +
        '<path d="M11.2 8.3l1.6-1.6a3.2 3.2 0 0 1 4.5 4.5l-1.6 1.6"/>' +
        '<path d="M12.8 15.7l-1.6 1.6a3.2 3.2 0 1 1-4.5-4.5l1.6-1.6"/>' +
      '</svg>',
    /* zap / bolt — XP progression (not star) */
    xp:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M13 3L6.5 13.5H12l-1 7.5L17.5 10.5H12L13 3z"/>' +
      '</svg>',
    check:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M5 13l4 4L19 7"/>' +
      '</svg>',
    /* banknote — Payment (distinct from Sale's bar-chart) */
    payment:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="2.75" y="6.5" width="18.5" height="11" rx="2.2"/>' +
        '<circle cx="12" cy="12" r="2.35"/>' +
        '<path d="M5.5 9.3h.01M18.5 14.7h.01"/>' +
      '</svg>'
  };

  function missionIcon(type) {
    if (type === 'evaluation') return ICO.evaluation;
    if (type === 'customerVisit') return ICO.visit;
    if (type === 'invoice') return ICO.sales;
    return ICO.mission;
  }

  function missionTitleFa(item) {
    if (item.type === 'evaluation') return 'ارزیابی';
    if (item.type === 'customerVisit') return 'ویزیت مشتری';
    if (item.type === 'invoice') return 'فروش';
    return item.label || item.id || 'مأموریت';
  }

  function missionCard(item) {
    var t = Math.max(0, Number(item.target) || 0);
    var c = Math.max(0, Number(item.current) || 0);
    var pct = t > 0 ? Math.min(100, (c / t) * 100) : 0;
    var done = t > 0 && c >= t;
    var started = c > 0;
    var state = done ? ' is-complete' : (started ? ' is-active' : ' is-dormant');

    return (
      '<article class="gc-mission' + state + '">' +
        '<div class="gc-mission-row">' +
          '<div class="gc-mission-icon">' + missionIcon(item.type) + '</div>' +
          '<div class="gc-mission-body">' +
            '<div class="gc-mission-head">' +
              '<span class="gc-mission-title">' + esc(missionTitleFa(item)) + '</span>' +
              '<span class="gc-mission-count" dir="ltr">' +
                faNum(c) + ' <span class="gc-slash">/</span> ' + faNum(t) +
              '</span>' +
            '</div>' +
            '<div class="gc-track" role="progressbar" aria-valuenow="' + Math.round(pct) + '" aria-valuemin="0" aria-valuemax="100">' +
              '<div class="gc-track-fill" style="width:' + pct + '%"></div>' +
            '</div>' +
          '</div>' +
          (done
            ? '<div class="gc-mission-done" title="کامل">' + ICO.check + '</div>'
            : '') +
        '</div>' +
      '</article>'
    );
  }

  function monthlyBlock(monthly) {
    monthly = monthly || {};
    var hasTarget = (Number(monthly.target) || 0) > 0;
    var pct = hasTarget ? Math.min(100, (Number(monthly.ratio) || 0) * 100) : 0;
    var reached = !!monthly.reached;
    return (
      '<section class="gc-section">' +
        '<div class="gc-section-head">' +
          '<span class="gc-section-ico">' + ICO.monthly + '</span>' +
          '<h3 class="gc-section-title">هدف فروش ماهانه</h3>' +
        '</div>' +
        '<div class="gc-panel' + (reached ? ' is-reached' : '') + '">' +
          (hasTarget
            ? '<div class="gc-monthly-pct" dir="ltr">' + faNum(Math.round(pct)) + '<span class="gc-pct-sign">٪</span></div>'
            : '<div class="gc-monthly-pct gc-muted-strong">—</div>') +
          '<div class="gc-track gc-track-lg" role="progressbar" aria-valuenow="' + Math.round(pct) + '" aria-valuemin="0" aria-valuemax="100">' +
            '<div class="gc-track-fill" style="width:' + (hasTarget ? pct : 0) + '%"></div>' +
          '</div>' +
          '<div class="gc-monthly-amounts" dir="ltr">' +
            tomanLocal(monthly.mtdSales || 0) +
            ' <span class="gc-slash">/</span> ' +
            tomanLocal(monthly.target || 0) +
            ' <span class="gc-unit">ت</span>' +
          '</div>' +
          '<div class="gc-soft">' +
            (hasTarget ? (reached ? 'هدف ماهانه محقق شد' : 'در مسیر هدف') : 'هدف ماهانه تنظیم نشده') +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function continuityBlock(snap) {
    var cont = snap.continuity || {};
    var status;
    if (snap.isRestDay) status = 'جمعه — روز استراحت';
    else if (cont.todayActive) status = 'امروز فعال';
    else status = 'هنوز فعال نشده';
    return (
      '<section class="gc-section">' +
        '<div class="gc-section-head">' +
          '<span class="gc-section-ico">' + ICO.streak + '</span>' +
          '<h3 class="gc-section-title">تداوم</h3>' +
        '</div>' +
        '<div class="gc-panel gc-panel-inline">' +
          '<div class="gc-hero">' +
            '<span class="gc-hero-num" dir="ltr">' + faNum(cont.currentStreak || 0) + '</span>' +
            '<span class="gc-hero-lab">روز</span>' +
          '</div>' +
          '<div class="gc-inline-meta">' +
            '<span class="gc-pill' + (cont.todayActive && !snap.isRestDay ? ' is-on' : '') + '">' + esc(status) + '</span>' +
            '<span class="gc-soft">بهترین: <span dir="ltr">' + faNum(cont.bestStreak || 0) + '</span></span>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function xpBlock(xp) {
    xp = xp || {};
    return (
      '<section class="gc-section">' +
        '<div class="gc-section-head">' +
          '<span class="gc-section-ico">' + ICO.xp + '</span>' +
          '<h3 class="gc-section-title">امتیاز</h3>' +
        '</div>' +
        '<div class="gc-xp-row">' +
          '<div class="gc-panel gc-xp">' +
            '<div class="gc-soft">امتیاز امروز</div>' +
            '<div class="gc-xp-num" dir="ltr">' + faNum(xp.today || 0) + '</div>' +
          '</div>' +
          '<div class="gc-panel gc-xp">' +
            '<div class="gc-soft">امتیاز کل</div>' +
            '<div class="gc-xp-num" dir="ltr">' + faNum(xp.total || 0) + '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderMorning(snap) {
    var q = (snap.quests && snap.quests.quests) || [];
    var missions = q.map(missionCard).join('');
    return (
      '<div class="gc-shell">' +
        '<section class="gc-section">' +
          '<div class="gc-section-head">' +
            '<span class="gc-section-ico">' + ICO.mission + '</span>' +
            '<h3 class="gc-section-title">مأموریت‌های امروز</h3>' +
          '</div>' +
          '<div class="gc-missions">' +
            (missions || '<div class="empty">مأموریتی تعریف نشده</div>') +
          '</div>' +
        '</section>' +
        monthlyBlock(snap.monthly) +
        continuityBlock(snap) +
        xpBlock(snap.xp) +
        '<p class="gc-hint">صبح مأموریت را ببین → برو بازار. شب نتیجه را اینجا چک کن.</p>' +
      '</div>'
    );
  }

  function renderEvening(snap) {
    var c = snap.counts || {};
    var q = (snap.quests && snap.quests.quests) || [];
    var allQ = snap.quests && snap.quests.allComplete;

    var missionLines = q.map(function (item) {
      return (
        '<div class="gc-line">' +
          '<span class="gc-line-lab">' +
            '<span class="gc-line-ico">' + missionIcon(item.type) + '</span>' +
            esc(missionTitleFa(item)) +
          '</span>' +
          '<span class="gc-line-val' + (item.complete ? ' is-ok' : '') + '" dir="ltr">' +
            faNum(item.current) + ' / ' + faNum(item.target) +
            (item.complete ? ' ✓' : '') +
          '</span>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="gc-shell">' +
        '<section class="gc-section">' +
          '<div class="gc-section-head"><h3 class="gc-section-title">نتیجه کسب‌وکار</h3></div>' +
          '<div class="gc-panel">' +
            '<div class="gc-kpi-grid">' +
              '<div class="gc-kpi"><div class="gc-kpi-lab">' + ICO.evaluation + '<span class="gc-soft">ارزیابی</span></div><div class="gc-kpi-num" dir="ltr">' + faNum(c.evaluation || 0) + '</div></div>' +
              '<div class="gc-kpi"><div class="gc-kpi-lab">' + ICO.visit + '<span class="gc-soft">ویزیت</span></div><div class="gc-kpi-num" dir="ltr">' + faNum(c.customerVisit || 0) + '</div></div>' +
              '<div class="gc-kpi"><div class="gc-kpi-lab">' + ICO.sales + '<span class="gc-soft">فروش</span></div><div class="gc-kpi-num" dir="ltr">' + faNum(c.invoice || 0) + '</div></div>' +
              '<div class="gc-kpi"><div class="gc-kpi-lab">' + ICO.payment + '<span class="gc-soft">پرداخت</span></div><div class="gc-kpi-num" dir="ltr">' + faNum(c.payment || 0) + '</div></div>' +
            '</div>' +
            '<div class="gc-line gc-line-last">' +
              '<span class="gc-line-lab">فعالیت معتبر امروز</span>' +
              '<span class="gc-line-val" dir="ltr">' + faNum(c.totalValid || 0) + '</span>' +
            '</div>' +
          '</div>' +
        '</section>' +
        monthlyBlock(snap.monthly) +
        '<section class="gc-section">' +
          '<div class="gc-section-head"><h3 class="gc-section-title">فعالیت امروز</h3></div>' +
          '<div class="gc-panel">' +
            missionLines +
            '<div class="gc-line gc-line-last">' +
              '<span class="gc-line-lab">پاداش هر ۳ مأموریت</span>' +
              '<span class="gc-line-val' + (allQ ? ' is-ok' : '') + '">' +
                (allQ ? 'واجد شرایط' : 'هنوز نه') +
              '</span>' +
            '</div>' +
          '</div>' +
        '</section>' +
        xpBlock(snap.xp) +
        continuityBlock(snap) +
      '</div>'
    );
  }

  /** Always open on Morning; user switches via compact toggle. */
  function defaultMode() {
    return 'morning';
  }

  var GameCenterView = {
    mount: function (root) {
      if (!root) return function () {};
      var mode = defaultMode();
      var token = null;
      var unmounted = false;

      async function draw() {
        if (unmounted || !root) return;
        var snap = null;
        var errMsg = '';
        try {
          if (typeof GameLogic === 'undefined' || !GameLogic || typeof GameLogic.getSnapshot !== 'function') {
            errMsg = 'هسته بازی بارگذاری نشده است.';
          } else {
            snap = await GameLogic.getSnapshot({ autoClaim: true });
          }
        } catch (e) {
          console.warn('[GameCenter] snapshot failed', e);
          errMsg = 'خطا در خواندن وضعیت بازی.';
        }
        if (unmounted || !root) return;

        var body = errMsg
          ? '<div class="empty">' + esc(errMsg) + '</div>'
          : (mode === 'morning' ? renderMorning(snap) : renderEvening(snap));

        root.innerHTML =
          '<div class="gc-page">' +
            /* Use div, NOT <header>: global app.css styles ALL header tags as navy app bar */
            '<div class="gc-header">' +
              '<div class="gc-title-row">' +
                '<h1 class="gc-title">Sales Game</h1>' +
                '<span class="gc-title-line" aria-hidden="true"></span>' +
                '<span class="gc-title-mark" aria-hidden="true">' + ICO.brandMark + '</span>' +
              '</div>' +
              '<div class="gc-seg" role="tablist">' +
                '<button type="button" role="tab" class="gc-seg-btn' + (mode === 'morning' ? ' is-active' : '') + '" data-gc-mode="morning" aria-selected="' + (mode === 'morning') + '">صبح</button>' +
                '<button type="button" role="tab" class="gc-seg-btn' + (mode === 'evening' ? ' is-active' : '') + '" data-gc-mode="evening" aria-selected="' + (mode === 'evening') + '">نتیجه</button>' +
              '</div>' +
            '</div>' +
            body +
          '</div>';

        root.querySelectorAll('[data-gc-mode]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            mode = btn.getAttribute('data-gc-mode') || 'morning';
            draw();
          });
        });
      }

      token = typeof ViewHost !== 'undefined' && ViewHost.setRefresh
        ? ViewHost.setRefresh(function () { draw(); })
        : null;

      draw();

      return function unmount() {
        unmounted = true;
        if (token != null && typeof ViewHost !== 'undefined' && ViewHost.clearRefresh) {
          ViewHost.clearRefresh(token);
        }
      };
    }
  };

  global.GameCenterView = GameCenterView;
})(typeof window !== 'undefined' ? window : globalThis);
