(function() {
  'use strict';

  // Configurações
  var FONT_SIZE_KEY = 'apop-font-size';
  var CONTRAST_KEY = 'apop-high-contrast';
  var GRAYSCALE_KEY = 'apop-grayscale';
  var INVERT_KEY = 'apop-invert';
  var FONT_SIZES = {
    small: 0.875,
    normal: 1,
    large: 1.15,
    xlarge: 1.3
  };
  var currentFontSize = 'normal';

  // Elementos
  var body = document.body;
  var accessibilityBar = document.getElementById('accessibility-bar');
  var fontIncreaseBtn = document.getElementById('font-increase');
  var fontDecreaseBtn = document.getElementById('font-decrease');
  var fontResetBtn = document.getElementById('font-reset');
  var contrastToggleBtn = document.getElementById('contrast-toggle');
  var grayscaleToggleBtn = document.getElementById('grayscale-toggle');
  var invertToggleBtn = document.getElementById('invert-toggle');
  var closeBtn = document.getElementById('accessibility-close');

  // Carregar preferências salvas
  function loadPreferences() {
    var savedFontSize = localStorage.getItem(FONT_SIZE_KEY);
    var savedContrast = localStorage.getItem(CONTRAST_KEY);
    var savedGrayscale = localStorage.getItem(GRAYSCALE_KEY);
    var savedInvert = localStorage.getItem(INVERT_KEY);

    if (savedFontSize && FONT_SIZES[savedFontSize]) {
      currentFontSize = savedFontSize;
      applyFontSize(savedFontSize);
    }

    if (savedContrast === 'true') {
      body.classList.add('high-contrast');
      if (contrastToggleBtn) contrastToggleBtn.setAttribute('aria-pressed', 'true');
    }

    if (savedGrayscale === 'true') {
      body.classList.add('grayscale');
      if (grayscaleToggleBtn) grayscaleToggleBtn.setAttribute('aria-pressed', 'true');
    }

    if (savedInvert === 'true') {
      body.classList.add('invert-colors');
      if (invertToggleBtn) invertToggleBtn.setAttribute('aria-pressed', 'true');
    }
  }

  // Aplicar tamanho de fonte
  function applyFontSize(size) {
    var multiplier = FONT_SIZES[size] || 1;
    document.documentElement.style.setProperty('--font-size-multiplier', multiplier);
    currentFontSize = size;
    updateFontButtons();
  }

  // Atualizar estado dos botões de fonte
  function updateFontButtons() {
    fontIncreaseBtn.disabled = currentFontSize === 'xlarge';
    fontDecreaseBtn.disabled = currentFontSize === 'small';
  }

  // Aumentar fonte
  function increaseFont() {
    var sizes = ['small', 'normal', 'large', 'xlarge'];
    var currentIndex = sizes.indexOf(currentFontSize);
    if (currentIndex < sizes.length - 1) {
      var newSize = sizes[currentIndex + 1];
      applyFontSize(newSize);
      localStorage.setItem(FONT_SIZE_KEY, newSize);
    }
  }

  // Diminuir fonte
  function decreaseFont() {
    var sizes = ['small', 'normal', 'large', 'xlarge'];
    var currentIndex = sizes.indexOf(currentFontSize);
    if (currentIndex > 0) {
      var newSize = sizes[currentIndex - 1];
      applyFontSize(newSize);
      localStorage.setItem(FONT_SIZE_KEY, newSize);
    }
  }

  // Resetar fonte
  function resetFont() {
    applyFontSize('normal');
    localStorage.setItem(FONT_SIZE_KEY, 'normal');
  }

  // Alternar contraste
  function toggleContrast() {
    var isHighContrast = body.classList.toggle('high-contrast');
    localStorage.setItem(CONTRAST_KEY, isHighContrast);
    if (contrastToggleBtn) contrastToggleBtn.setAttribute('aria-pressed', isHighContrast);
  }

  // Alternar escala de cinza
  function toggleGrayscale() {
    var isGrayscale = body.classList.toggle('grayscale');
    localStorage.setItem(GRAYSCALE_KEY, isGrayscale);
    if (grayscaleToggleBtn) grayscaleToggleBtn.setAttribute('aria-pressed', isGrayscale);
  }

  // Inverter cores
  function toggleInvert() {
    var isInverted = body.classList.toggle('invert-colors');
    localStorage.setItem(INVERT_KEY, isInverted);
    if (invertToggleBtn) invertToggleBtn.setAttribute('aria-pressed', isInverted);
  }

  // Fechar barra
  function closeBar() {
    accessibilityBar.classList.add('is-hidden');
    body.classList.add('accessibility-bar-hidden');
    localStorage.setItem('apop-accessibility-bar-hidden', 'true');
  }

  // Mostrar barra se não estiver oculta
  function showBarIfNeeded() {
    var isHidden = localStorage.getItem('apop-accessibility-bar-hidden') === 'true';
    if (isHidden) {
      accessibilityBar.classList.add('is-hidden');
      body.classList.add('accessibility-bar-hidden');
    } else {
      accessibilityBar.classList.remove('is-hidden');
      body.classList.remove('accessibility-bar-hidden');
    }
  }

  // Event listeners
  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', increaseFont);
  }

  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', decreaseFont);
  }

  if (fontResetBtn) {
    fontResetBtn.addEventListener('click', resetFont);
  }

  if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener('click', toggleContrast);
  }

  if (grayscaleToggleBtn) {
    grayscaleToggleBtn.addEventListener('click', toggleGrayscale);
  }

  if (invertToggleBtn) {
    invertToggleBtn.addEventListener('click', toggleInvert);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeBar);
  }

  // Navegação por teclado na barra
  if (accessibilityBar) {
    var buttons = accessibilityBar.querySelectorAll('.accessibility-btn');
    buttons.forEach(function(btn, index) {
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' && index < buttons.length - 1) {
          e.preventDefault();
          buttons[index + 1].focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          buttons[index - 1].focus();
        }
      });
    });
  }

  // Skip link - foco no conteúdo principal
  var skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      var mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        setTimeout(function() {
          mainContent.removeAttribute('tabindex');
        }, 1000);
      }
    });
  }

  // Inicializar
  loadPreferences();
  showBarIfNeeded();
  updateFontButtons();

  // Expor funções globalmente se necessário
  window.APOPAccessibility = {
    increaseFont: increaseFont,
    decreaseFont: decreaseFont,
    resetFont: resetFont,
    toggleContrast: toggleContrast,
    toggleGrayscale: toggleGrayscale,
    toggleInvert: toggleInvert
  };
})();
