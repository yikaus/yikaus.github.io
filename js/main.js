(function () {
  var root = document.documentElement;

  // Theme toggle
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    var syncThemeButton = function () {
      var current = root.getAttribute('data-theme') || 'dark';
      var isLight = current === 'light';
      themeBtn.setAttribute('aria-pressed', String(isLight));
      themeBtn.setAttribute(
        'aria-label',
        isLight ? 'Switch to dark theme' : 'Switch to light theme'
      );
    };

    syncThemeButton();

    themeBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') || 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // Ignore storage restrictions
      }
      syncThemeButton();
    });
  }

  // Mobile navigation toggle
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    var closeMenu = function () {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    menuBtn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  // Copy YAML snippet
  var copyBtn = document.getElementById('copy-yaml');
  var rawYamlEl = document.getElementById('raw-yaml');
  if (copyBtn && rawYamlEl) {
    var defaultLabel = copyBtn.textContent;
    var resetTimer = null;

    var markCopied = function () {
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        copyBtn.textContent = defaultLabel;
        copyBtn.classList.remove('copied');
      }, 2000);
    };

    copyBtn.addEventListener('click', function () {
      var text = rawYamlEl.textContent.trim() + '\n';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(markCopied)
          .catch(function () {
            fallbackCopy(text);
          });
      } else {
        fallbackCopy(text);
      }
    });

    function fallbackCopy(text) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        markCopied();
      } catch (e) {
        // Ignore copy failure
      }
      document.body.removeChild(textarea);
    }
  }

  // Project category filters
  var filterButtons = document.querySelectorAll('[data-filter]');
  var projectCards = document.querySelectorAll('.project-card[data-category]');
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterButtons.forEach(function (other) {
          var active = other === btn;
          other.classList.toggle('active', active);
          other.setAttribute('aria-pressed', String(active));
        });

        projectCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          var visible = filter === 'all' || category === filter;
          card.hidden = !visible;
        });
      });
    });
  }

  // Graceful avatar fallback
  var avatarImg = document.getElementById('avatar-img');
  var avatarFallback = document.getElementById('avatar-fallback');
  if (avatarImg && avatarFallback) {
    avatarImg.addEventListener('error', function () {
      avatarImg.style.display = 'none';
      avatarFallback.hidden = false;
    });
  }
})();
