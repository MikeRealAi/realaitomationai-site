/* RealAutomation — small progressive enhancements. No dependencies. */
(function () {
  'use strict';

  /* Mobile nav ------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Header shadow once scrolled -------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Reveal on scroll -------------------------------------------------- */
  var items = document.querySelectorAll('.reveal');
  if (items.length) {
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    }
  }

  /* Current year ------------------------------------------------------ */
  var y = document.querySelectorAll('[data-year]');
  y.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Contact form ------------------------------------------------------
     Works with any POST endpoint (Formspree, Cloudflare Pages Function,
     Basin, etc.). Set the action on the <form> in contact.html.
     If no endpoint is configured yet, it falls back to opening the
     visitor's mail client so no enquiry is ever silently lost.         */
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var status = document.getElementById('form-status');
      var action = form.getAttribute('action') || '';

      // Honeypot: silently drop bots.
      var hp = form.querySelector('input[name="_company_url"]');
      if (hp && hp.value) { e.preventDefault(); return; }

      if (action.indexOf('REPLACE_ME') !== -1 || action === '') {
        e.preventDefault();
        var data = new FormData(form);
        var body = [];
        data.forEach(function (v, k) {
          if (k.charAt(0) !== '_') body.push(k + ': ' + v);
        });
        var to = form.getAttribute('data-fallback-email') || 'info@realautomationai.com';
        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent('Website enquiry') +
          '&body=' + encodeURIComponent(body.join('\n\n'));
        if (status) {
          status.textContent = 'Opening your email app…';
          status.style.color = '';
        }
        return;
      }

      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('bad response');
        form.reset();
        if (status) { status.textContent = 'Thanks — that’s with me. I’ll come back to you within one working day.'; }
        if (btn) { btn.disabled = false; btn.textContent = 'Send enquiry'; }
      }).catch(function () {
        if (status) {
          status.textContent = 'That didn’t send. Email me directly and I’ll pick it up.';
          status.style.color = '#C25A2E';
        }
        if (btn) { btn.disabled = false; btn.textContent = 'Send enquiry'; }
      });
    });
  }
})();
