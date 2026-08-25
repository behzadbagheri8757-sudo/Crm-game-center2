/* js/views/game-center.js — Sales Game SPA view
   Visual polish only. Uses GameLogic.getSnapshot — no business/XP logic changes.
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

  function faNum(n) {
    try {
      return (Math.round(Number(n) || 0)).toLocaleString('fa-IR');
    } catch (e) {
      return String(Math.round(Number(n) || 0));
    }
  }

  function tomanLocal(n) {
    if (typeof toman === 'function') return toman(n);
    return faNum(n);
  }

  /* ---- Minimal SVG icons (stroke style, CRM-aligned) ---- */
  var ICO = {
    brand:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 19V9l8-5 8 5v10"/>' +
        '<path d="M9 19v-6h6v6"/>' +
        '<path d="M8 11h8"/>' +
      '</svg>',
    evaluation:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>' +
        '<rect x="9" y="3" width="6" height="4" rx="1"/>' +
        '<path d="M9 12h6M9 16h4"/>' +
      '</svg>',
    visit:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="9" cy="8" r="3.2"/>' +
        '<path d="M3.5 19.5v-.8a4.5 4.5 0 0 1 4.5-4.5h1.8a4.5 4.5 0 0 1 4.5 4.5v.8"/>' +
        '<path d="M16.5 5.2a2.8 2.8 0 0 1 0 5.4"/>' +
        '<path d="M17.6 14.6a3.8 3.8 0 0 1 2.9 3.5v1.4"/>' +
      '</svg>',
    sales:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 19h16"/>' +
        '<path d="M7 16V10"/>' +
        '<path d="M12 16V7"/>' +
        '<path d="M17 16v-4"/>' +
      '</svg>',
    streak:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 3c2.5 3 5 4.5 5 8.2A5 5 0 0 1 7 11.2C7 7.5 9.5 6 12 3z"/>' +
        '<path d="M10 16.5c0 1.5 1 2.5 2 2.5s2-1 2-2.5"/>' +
      '</svg>',
    target:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="8"/>' +
        '<circle cx="12" cy="12" r="4"/>' +
        '<path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>' +
      '</svg>',
    xp:
      '<svg class="gc-ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 3l2.2 5.5L20 9.2l-4 4.1.9 5.7L12 16.5 7.1 19l.9-5.7-4-4.1 5.8-.7L12 3z"/>' +
      '</svg>',
    check:
      '<svg class="gc-ico gc-ico-check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M5 13l4 4L19 7"/>' +
      '</svg>'
  };

  function missionIcon(type) {
    if (type === 'evaluation') return ICO.evaluation;
    if (type === 'customerVisit') return ICO.visit;
    if (type === 'invoice') return ICO.sales;
    return ICO.target;
  }

  function missionTitleEn(item) {
    if (item.type === 'evaluation') return 'Evaluation';
    if (item.type === 'customerVisit') return 'Customer Visit';
    if (item.type === 'invoice') return 'Sales';
    return item.label || item.id || 'Mission';
  }

  /**
   * Proportional progress track.
   * States: dormant (0), active (>0), complete (>= target)
   */
  function missionCard(item) {
    var t = Math.max(0, Number(item.target) || 0);
    var c = Math.max(0, Number(item.current) || 0);
    var pct = t > 0 ? Math.min(100, Math.round((c / t) * 1000) / 10) : 0;
    var done = t > 0 && c >= t;
    var started = c > 0;
    var stateClass = done ? ' is-complete' : (started ? ' is-active' : ' is-dormant');

    return (
      '<article class="gc-mission' + stateClass + '">' +
        '<div class="gc-mission-top">' +
          '<div class="gc-mission-icon">' + missionIcon(item.type) + '</div>' +
          '<div class="gc-mission-meta">' +
            '<div class="gc-mission-title">' + esc(missionTitleEn(item)) + '</div>' +
            '<div class="gc-mission-count">' +
              '<span class="gc-mission-current">' + faNum(c) + '</span>' +
              '<span class="gc-mission-sep"> / </span>' +
              '<span class="gc-mission-target">' + faNum(t) + '</span>' +
            '</div>' +
          '</div>' +
          (done
            ? '<div class="gc-mission-badge" title="Complete">' + ICO.check + '<span>Complete</span></div>'
            : '') +
        '</div>' +
        '<div class="gc-track" role="progressbar" aria-valuenow="' + Math.round(pct) + '" aria-valuemin="0" aria-valuemax="100">' +
          '<div class="gc-track-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</article>'
    );
  }

  function monthlyBlock(monthly) {
    monthly = monthly || {};
    var pct = monthly.target > 0
      ? Math.min(100, Math.round((monthly.ratio || 0) * 1000) / 10)
      : 0;
    var reached = !!monthly.reached;
    return (
      '<section class="gc-section">' +
        '<div class="gc-section-head">' +
          '<span class="gc-section-ico">' + ICO.target + '</span>' +
          '<h3 class="gc-section-title">Monthly Sales Target</h3>' +
        '</div>' +
        '<div class="gc-card gc-card-monthly' + (reached ? ' is-reached' : '') + '">' +
          '<div class="gc-monthly-pct">' +
            (monthly.target > 0 ? faNum(Math.round(pct)) + '%' : '—') +
          '</div>' +
          '<div class="gc-track gc-track-lg" role="progressbar" aria-valuenow="' + Math.round(pct) + '" aria-valuemin="0" aria-valuemax="100">' +
            '<div class="gc-track-fill" style="width:' + pct + '%"></div>' +
          '</div>' +
          '<div class="gc-monthly-amounts">' +
            '<span class="gc-monthly-current">' + tomanLocal(monthly.mtdSales || 0) + '</span>' +
            '<span class="gc-monthly-sep"> / </span>' +
            '<span class="gc-monthly-target">' + tomanLocal(monthly.target || 0) + ' T</span>' +
          '</div>' +
          '<div class="gc-monthly-status">' +
            (monthly.target > 0
              ? (reached ? 'Target reached' : 'In progress')
              : 'Target not set') +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function continuityBlock(snap) {
    var cont = snap.continuity || {};
    var status;
    if (snap.isRestDay) status = 'Friday — rest day';
    else if (cont.todayActive) status = 'Active today';
    else status = 'Not active yet';
    return (
      '<section class="gc-section">' +
        '<div class="gc-section-head">' +
          '<span class="gc-section-ico">' + ICO.streak + '</span>' +
          '<h3 class="gc-section-title">Continuity</h3>' +
        '</div>' +
        '<div class="gc-card gc-card-continuity">' +
          '<div class="gc-hero-metric">' +
            '<div class="gc-hero-value">' + faNum(cont.currentStreak || 0) + '</div>' +
            '<div class="gc-hero-unit">Days</div>' +
          '</div>' +
          '<div class="gc-continuity-sub">' +
            '<span class="gc-status-pill' +
              (cont.todayActive && !snap.isRestDay ? ' is-on' : '') + '">' +
              esc(status) +
            '</span>' +
            '<span class="gc-muted">Best: ' + faNum(cont.bestStreak || 0) + '</span>' +
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
          '<h3 class="gc-section-title">XP</h3>' +
        '</div>' +
        '<div class="gc-xp-row">' +
          '<div class="gc-card gc-xp-card">' +
            '<div class="gc-label">XP Today</div>' +
            '<div class="gc-xp-value">' + faNum(xp.today || 0) + '</div>' +
          '</div>' +
          '<div class="gc-card gc-xp-card">' +
            '<div class="gc-label">Total XP</div>' +
            '<div class="gc-xp-value">' + faNum(xp.total || 0) + '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  /** Daily Target = same three operational targets (display only, no new logic). */
  function dailyTargetBlock(quests) {
    var items = quests || [];
    var chips = items.map(function (q) {
      return (
        '<div class="gc-dt-chip">' +
          '<span class="gc-dt-num">' + faNum(q.target) + '</span>' +
          '<span class="gc-dt-lab">' + esc(missionTitleEn(q)) + '</span>' +
        '</div>'
      );
    }).join('');
    return (
      '<section class="gc-section">' +
        '<div class="gc-section-head">' +
          '<span class="gc-section-ico">' + ICO.target + '</span>' +
          '<h3 class="gc-section-title">Daily Target</h3>' +
        '</div>' +
        '<div class="gc-card gc-card-dt">' +
          '<div class="gc-dt-row">' + (chips || '<div class="empty">—</div>') + '</div>' +
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
            '<h3 class="gc-section-title">Daily Missions</h3>' +
          '</div>' +
          '<div class="gc-missions">' +
            (missions || '<div class="empty">No missions</div>') +
          '</div>' +
        '</section>' +
        dailyTargetBlock(q) +
        monthlyBlock(snap.monthly) +
        continuityBlock(snap) +
        xpBlock(snap.xp) +
        '<p class="gc-hint">See today’s missions → close the app → work the market. Check results tonight.</p>' +
      '</div>'
    );
  }

  function renderEvening(snap) {
    var c = snap.counts || {};
    var cont = snap.continuity || {};
    var monthly = snap.monthly || {};
    var xp = snap.xp || {};
    var q = (snap.quests && snap.quests.quests) || [];
    var allQ = snap.quests && snap.quests.allComplete;

    var missionLines = q.map(function (item) {
      return (
        '<div class="gc-line">' +
          '<span class="gc-line-lab">' +
            '<span class="gc-line-ico">' + missionIcon(item.type) + '</span>' +
            esc(missionTitleEn(item)) +
          '</span>' +
          '<span class="gc-line-val' + (item.complete ? ' gc-ok' : '') + '">' +
            faNum(item.current) + ' / ' + faNum(item.target) +
            (item.complete ? ' ✓' : '') +
          '</span>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="gc-shell">' +
        /* 1. Business Result */
        '<section class="gc-section">' +
          '<div class="gc-section-head"><h3 class="gc-section-title">Business Result</h3></div>' +
          '<div class="gc-card">' +
            '<div class="gc-kpi-grid">' +
              '<div class="gc-kpi"><div class="gc-label">Evaluation</div><div class="gc-kpi-val">' + faNum(c.evaluation || 0) + '</div></div>' +
              '<div class="gc-kpi"><div class="gc-label">Visits</div><div class="gc-kpi-val">' + faNum(c.customerVisit || 0) + '</div></div>' +
              '<div class="gc-kpi"><div class="gc-label">Sales</div><div class="gc-kpi-val">' + faNum(c.invoice || 0) + '</div></div>' +
              '<div class="gc-kpi"><div class="gc-label">Collections</div><div class="gc-kpi-val">' + faNum(c.payment || 0) + '</div></div>' +
            '</div>' +
            '<div class="gc-line gc-line-soft">' +
              '<span class="gc-line-lab">Valid activities</span>' +
              '<span class="gc-line-val">' + faNum(c.totalValid || 0) + '</span>' +
            '</div>' +
          '</div>' +
        '</section>' +

        /* 2. Monthly Progress */
        monthlyBlock(monthly) +

        /* 3. Today's activity / missions */
        '<section class="gc-section">' +
          '<div class="gc-section-head"><h3 class="gc-section-title">Today\'s Activity</h3></div>' +
          '<div class="gc-card">' +
            missionLines +
            '<div class="gc-line">' +
              '<span class="gc-line-lab">All 3 missions bonus</span>' +
              '<span class="gc-line-val' + (allQ ? ' gc-ok' : '') + '">' +
                (allQ ? 'Qualified' : 'Not yet') +
              '</span>' +
            '</div>' +
          '</div>' +
        '</section>' +

        /* 4. XP */
        xpBlock(xp) +

        /* 5. Continuity */
        continuityBlock(snap) +
      '</div>'
    );
  }

  function defaultMode() {
    try {
      return new Date().getHours() < 16 ? 'morning' : 'evening';
    } catch (e) {
      return 'morning';
    }
  }

  var GameCenterView = {
    mount: function (root, params) {
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
            errMsg = 'Game core is not loaded.';
          } else {
            snap = await GameLogic.getSnapshot({ autoClaim: true });
          }
        } catch (e) {
          console.warn('[GameCenter] snapshot failed', e);
          errMsg = 'Could not load game status.';
        }
        if (unmounted || !root) return;

        var toggle =
          '<div class="gc-tabs" role="tablist">' +
            '<button type="button" role="tab" class="gc-tab' + (mode === 'morning' ? ' is-active' : '') + '" data-gc-mode="morning" aria-selected="' + (mode === 'morning') + '">صبح</button>' +
            '<button type="button" role="tab" class="gc-tab' + (mode === 'evening' ? ' is-active' : '') + '" data-gc-mode="evening" aria-selected="' + (mode === 'evening') + '">نتیجه</button>' +
          '</div>';

        var body = '';
        if (errMsg) {
          body = '<div class="empty">' + esc(errMsg) + '</div>';
        } else if (mode === 'morning') {
          body = renderMorning(snap);
        } else {
          body = renderEvening(snap);
        }

        root.innerHTML =
          '<div class="gc-page">' +
            '<header class="gc-header">' +
              '<div class="gc-brand">' +
                '<span class="gc-brand-ico" aria-hidden="true">' + ICO.brand + '</span>' +
                '<h1 class="gc-brand-title">Sales Game</h1>' +
              '</div>' +
              toggle +
            '</header>' +
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
