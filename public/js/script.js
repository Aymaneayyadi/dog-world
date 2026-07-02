(function() {
  'use strict';

  const header = document.getElementById('masthead');
  if (header) {
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          header.classList.toggle('scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-navigation .menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      const expanded = toggle.getAttribute('aria-expanded') === 'true' ? false : true;
      toggle.setAttribute('aria-expanded', expanded);
      menu.classList.toggle('active');
    });
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.main-navigation')) {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('dogworld_lang') || 'en';

  function setLang(lang) {
    localStorage.setItem('dogworld_lang', lang);
    langBtns.forEach(function(b) { b.classList.toggle('active', b.dataset.lang === lang); });
    document.querySelectorAll('[data-en],[data-fr],[data-ar]').forEach(function(el) {
      var txt = el.getAttribute('data-' + lang);
      if (txt !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = txt;
        } else {
          el.textContent = txt;
        }
      }
    });
    if (lang === 'ar') {
      document.body.classList.add('rtl');
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    } else if (lang === 'fr') {
      document.body.classList.remove('rtl');
      document.documentElement.lang = 'fr';
      document.documentElement.dir = 'ltr';
    } else {
      document.body.classList.remove('rtl');
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
  }

  langBtns.forEach(function(btn) {
    btn.addEventListener('click', function() { setLang(btn.dataset.lang); });
  });

  setLang(savedLang);
})();
