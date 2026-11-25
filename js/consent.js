/* ============================================================
   Cookie notice. Google Tag Manager (in each page's <head>) starts with
   Google Consent Mode set to "denied": no analytics or advertising cookies
   until the visitor presses "Accept". The choice is kept in localStorage
   under "cb-cookies" ("yes" / "no") and applied in <head> on later visits.
   ============================================================ */
(function () {
  var KEY = 'cb-cookies';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { return; }
  if (saved === 'yes' || saved === 'no') return;

  var privacyHref = 'privacy';
  var bar = document.createElement('div');
  bar.className = 'cookie-notice';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Cookie notice');
  bar.innerHTML =
    '<p>I use cookies to see how people find this site and to measure my adverts. ' +
    'Nothing is set unless you accept. <a href="' + privacyHref + '#cookies">More in my privacy policy</a>.</p>' +
    '<div class="cookie-notice__actions">' +
      '<button type="button" class="btn btn--primary btn--sm" data-choice="yes">Accept</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-choice="no">No thanks</button>' +
    '</div>';

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-choice]');
    if (!btn) return;
    var choice = btn.getAttribute('data-choice');
    try { localStorage.setItem(KEY, choice); } catch (err) {}
    if (choice === 'yes' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
      window.dataLayer.push({ event: 'cookie_consent_granted' });
    }
    bar.remove();
  });

  document.body.appendChild(bar);
})();
