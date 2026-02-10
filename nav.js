(function() {
  var toggle = document.querySelector('.nav-toggle');
  var navWrap = document.querySelector('.nav-wrap');
  if (toggle && navWrap) {
    toggle.addEventListener('click', function() {
      var open = navWrap.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
  document.querySelectorAll('.nav-menu a').forEach(function(a) {
    a.addEventListener('click', function() {
      if (navWrap) navWrap.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });
  // Mobile: toggle submenu when clicking parent (A APOP / Parcerias)
  document.querySelectorAll('.nav-menu .has-dropdown > a').forEach(function(a) {
    a.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        var li = a.closest('li');
        if (li) li.classList.toggle('is-open');
      }
    });
  });
})();
