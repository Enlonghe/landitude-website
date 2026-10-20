/* Landitude — site behaviour
   Calm and slow, per the design system: no bounces, no loops. */

(function () {
  'use strict';

  /* Navigation: mobile panel + Fund / Development dropdowns */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var groups = Array.prototype.slice.call(document.querySelectorAll('.site-nav__group'));

  function closeGroups(except) {
    groups.forEach(function (group) {
      if (group === except) return;
      group.classList.remove('is-open');
      var caret = group.querySelector('.site-nav__caret');
      if (caret) caret.setAttribute('aria-expanded', 'false');
    });
  }

  function closeMobileNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      if (!open) closeGroups();
    });

    nav.addEventListener('click', function (event) {
      /* Caret buttons open their submenu — accordion on mobile, toggle on touch desktops. */
      var caret = event.target.closest('.site-nav__caret');
      if (caret) {
        var group = caret.closest('.site-nav__group');
        var open = group.classList.toggle('is-open');
        caret.setAttribute('aria-expanded', String(open));
        closeGroups(group);
        return;
      }
      /* Following any link closes the mobile panel and open submenus. */
      if (event.target.closest('a')) {
        closeMobileNav();
        closeGroups();
      }
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.site-nav') && !event.target.closest('.nav-toggle')) {
        closeGroups();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeGroups();
        closeMobileNav();
      }
    });
  }

  /* Header shadow once scrolled */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Reveal on scroll */
  var pending = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function checkReveals() {
    if (!pending.length) return;
    var viewport = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
    if (viewport <= 0) {
      /* Viewport unmeasurable — never leave content hidden. */
      pending.forEach(function (el) { el.classList.add('is-visible'); });
      pending = [];
      return;
    }
    var limit = viewport * 0.92;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add('is-visible');
        return false;
      }
      return true;
    });
  }

  checkReveals();
  window.addEventListener('scroll', checkReveals, { passive: true });
  window.addEventListener('resize', checkReveals);

  /* Language toggle — placeholder until 中文 pages exist */
  var lang = document.querySelector('.lang-toggle');
  if (lang) {
    lang.addEventListener('click', function () {
      lang.textContent = lang.textContent === '中文' ? 'EN' : '中文';
      /* Swap href to the 中文 page set once translated pages are added. */
    });
  }
})();
