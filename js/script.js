(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var menuToggle = document.querySelector('.menu-toggle');
  var primaryMenu = document.querySelector('.main-navigation .menu');
  var searchToggle = document.querySelector('.search-toggle');
  var searchForm = document.querySelector('.search-form-header');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  if (menuToggle && primaryMenu) {
    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true' ? false : true;
      menuToggle.setAttribute('aria-expanded', expanded);
      primaryMenu.classList.toggle('active');
    });

    primaryMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('.main-navigation .menu-item-has-children > a').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (window.innerWidth <= 767) {
        e.preventDefault();
        var submenu = this.nextElementSibling;
        if (submenu && submenu.classList.contains('sub-menu')) {
          submenu.classList.toggle('active');
        }
      }
    });
  });

  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      searchForm.classList.toggle('active');
      if (searchForm.classList.contains('active')) {
        var input = searchForm.querySelector('input[type="search"]');
        if (input) input.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
        searchForm.classList.remove('active');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Language Switcher
  var langs = ['en', 'fr', 'ar'];
  var savedLang = localStorage.getItem('dogworld_lang') || 'en';

  function setLang(lang) {
    localStorage.setItem('dogworld_lang', lang);
    document.documentElement.lang = lang === 'ar' ? 'ar' : lang;
    document.body.classList.toggle('rtl', lang === 'ar');
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('[data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang) || el.textContent;
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      el.placeholder = el.getAttribute('data-' + lang + '-placeholder') || el.placeholder;
    });
  }

  setLang(savedLang);

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(this.getAttribute('data-lang'));
    });
  });
})();
