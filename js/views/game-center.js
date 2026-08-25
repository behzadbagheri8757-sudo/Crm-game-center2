/* js/views/game-center.js — Sales Game Center SPA view (Phase 3+4)
   Pattern matches existing views: mount(root), ViewHost.setRefresh, unmount cleanup.
   CRM remains Source of Truth; this view only reads GameLogic snapshot.
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

  function progressBar(current, target) {
    const t = Math.max(0, Number(target) || 0);
    const c = Math.max(0, Number(current) || 0);
    const pct = t > 0 ? Math.min(100, Math.round((c / t) * 100)) : 0;
    const done = t > 0 && c >= t;
    return (
      '<div class="gc-progress' + (done ? ' is-done' : '') + '">' +
        '<div class="gc-progress-track"><div class="gc-progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="gc-progress-label">' + faNum(c) + ' / ' + faNum(t) + '</div>' +
      '</div>'
    );
  }

  function sectionTitle(text) {
    return '<h2 class="section-title">' + esc(text) + '</h2>';
  }

  function renderMorning(snap) {
    const q = (snap.quests && snap.quests.quests) || [];
    let questHtml = q.map(function (item) {
      return (
        '<div class="gc-quest-row">' +
          '<div class="gc-quest-name">' + esc(item.label || item.id) + '</div>' +
          progressBar(item.current, item.target) +
        '</div>'
      );
    }).join('');

    const cont = snap.continuity || {};
    const monthly = snap.monthly || {};
    const xp = snap.xp || {};

    return (
      '<div class="gc-shell">' +
        sectionTitle('امروز') +
        '<div class="gc-card">' +
          '<div class="gc-card-title">مأموریت‌های روزانه</div>' +
          (questHtml || '<div class="empty">مأموریتی تعریف نشده</div>') +
        '</div>' +
        '<div class="gc-grid">' +
          '<div class="gc-stat">' +
            '<div class="label">تداوم</div>' +
            '<div class="value">' + faNum(cont.currentStreak || 0) + ' روز</div>' +
            '<div class="sub">' +
              (snap.isRestDay ? 'امروز جمعه — استراحت' :
                (cont.todayActive ? 'امروز فعال' : 'هنوز به ۵ فعالیت نرسیده')) +
            '</div>' +
          '</div>' +
          '<div class="gc-stat">' +
            '<div class="label">هدف فروش ماه</div>' +
            '<div class="value">' +
              (monthly.target > 0
                ? faNum(Math.min(100, Math.round((monthly.ratio || 0) * 100))) + '٪'
                : '—') +
            '</div>' +
            '<div class="sub">' +
              tomanLocal(monthly.mtdSales || 0) + ' / ' + tomanLocal(monthly.target || 0) + ' ت' +
            '</div>' +
          '</div>' +
          '<div class="gc-stat">' +
            '<div class="label">XP امروز</div>' +
            '<div class="value">' + faNum(xp.today || 0) + '</div>' +
            '<div class="sub">کل: ' + faNum(xp.total || 0) + '</div>' +
          '</div>' +
        '</div>' +
        '<p class="gc-hint">صبح فقط مأموریت را ببین → برو بازار. شب نتیجه را اینجا چک کن.</p>' +
      '</div>'
    );
  }

  function renderEvening(snap) {
    const c = snap.counts || {};
    const cont = snap.continuity || {};
    const monthly = snap.monthly || {};
    const xp = snap.xp || {};
    const q = (snap.quests && snap.quests.quests) || [];
    const allQ = snap.quests && snap.quests.allComplete;

    const questLines = q.map(function (item) {
      return (
        '<div class="gc-line">' +
          '<span>' + esc(item.label || item.id) + '</span>' +
          '<span class="' + (item.complete ? 'gc-ok' : '') + '">' +
            faNum(item.current) + ' / ' + faNum(item.target) +
            (item.complete ? ' ✓' : '') +
          '</span>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="gc-shell">' +
        sectionTitle('نتیجه کسب‌وکار') +
        '<div class="gc-card">' +
          '<div class="gc-line"><span>ارزیابی Prospect</span><span>' + faNum(c.evaluation || 0) + '</span></div>' +
          '<div class="gc-line"><span>ویزیت مشتری</span><span>' + faNum(c.customerVisit || 0) + '</span></div>' +
          '<div class="gc-line"><span>فروش / فاکتور</span><span>' + faNum(c.invoice || 0) + '</span></div>' +
          '<div class="gc-line"><span>وصول (پرداخت معتبر)</span><span>' + faNum(c.payment || 0) + '</span></div>' +
          '<div class="gc-line"><span>فعالیت معتبر امروز</span><span>' + faNum(c.totalValid || 0) + '</span></div>' +
        '</div>' +

        sectionTitle('پیشرفت کسب‌وکار') +
        '<div class="gc-card">' +
          '<div class="gc-line"><span>هدف فروش ماه</span><span>' +
            tomanLocal(monthly.mtdSales || 0) + ' / ' + tomanLocal(monthly.target || 0) + ' ت' +
          '</span></div>' +
          '<div class="gc-line"><span>وضعیت هدف</span><span class="' +
            (monthly.reached ? 'gc-ok' : '') + '">' +
            (monthly.reached ? 'رسیده ✓' : (monthly.target > 0 ? 'در مسیر' : 'هدف تنظیم نشده')) +
          '</span></div>' +
        '</div>' +

        sectionTitle('نتیجه بازی') +
        '<div class="gc-card">' +
          '<div class="gc-line"><span>XP امروز</span><span>' + faNum(xp.today || 0) + '</span></div>' +
          '<div class="gc-line"><span>کل XP</span><span>' + faNum(xp.total || 0) + '</span></div>' +
        '</div>' +

        sectionTitle('تداوم') +
        '<div class="gc-card">' +
          '<div class="gc-line"><span>رشته فعلی</span><span>' + faNum(cont.currentStreak || 0) + ' روز</span></div>' +
          '<div class="gc-line"><span>بهترین رشته</span><span>' + faNum(cont.bestStreak || 0) + ' روز</span></div>' +
          '<div class="gc-line"><span>امروز</span><span>' +
            (snap.isRestDay ? 'جمعه — استراحت' :
              (cont.todayActive ? 'Active Day ✓' : 'هنوز Active نشده')) +
          '</span></div>' +
        '</div>' +

        sectionTitle('مأموریت‌ها و Bonus') +
        '<div class="gc-card">' +
          questLines +
          '<div class="gc-line"><span>Bonus هر ۳ مأموریت</span><span class="' +
            (allQ ? 'gc-ok' : '') + '">' + (allQ ? 'واجد شرایط' : 'هنوز نه') +
          '</span></div>' +
        '</div>' +
      '</div>'
    );
  }

  /** Simple mode: morning if local hour < 16, else evening. Manual toggle available. */
  function defaultMode() {
    try {
      return new Date().getHours() < 16 ? 'morning' : 'evening';
    } catch (e) {
      return 'morning';
    }
  }

  const GameCenterView = {
    mount: function (root, params) {
      if (!root) return function () {};
      let mode = defaultMode();
      let token = null;
      let unmounted = false;

      async function draw() {
        if (unmounted || !root) return;
        let snap = null;
        let errMsg = '';
        try {
          if (typeof GameLogic === 'undefined' || !GameLogic || typeof GameLogic.getSnapshot !== 'function') {
            errMsg = 'هسته بازی بارگذاری نشده است.';
          } else {
            // autoClaim: quest/continuity/conversion/monthly when viewing
            snap = await GameLogic.getSnapshot({ autoClaim: true });
          }
        } catch (e) {
          console.warn('[GameCenter] snapshot failed', e);
          errMsg = 'خطا در خواندن وضعیت بازی.';
        }
        if (unmounted || !root) return;

        const toggle =
          '<div class="gc-mode-toggle">' +
            '<button type="button" class="chip' + (mode === 'morning' ? ' active' : '') + '" data-gc-mode="morning">صبح</button>' +
            '<button type="button" class="chip' + (mode === 'evening' ? ' active' : '') + '" data-gc-mode="evening">نتیجه</button>' +
          '</div>';

        let body = '';
        if (errMsg) {
          body = '<div class="empty">' + esc(errMsg) + '</div>';
        } else if (mode === 'morning') {
          body = renderMorning(snap);
        } else {
          body = renderEvening(snap);
        }

        root.innerHTML =
          '<div class="gc-page">' +
            '<div class="gc-header">' +
              '<h2 class="section-title" style="margin-bottom:8px;">مرکز بازی فروش</h2>' +
              toggle +
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
