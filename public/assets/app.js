/* The catalog stays usable in an ordinary browser and in Telegram WebView. */
(() => {
  const telegram = window.Telegram?.WebApp;
  if (telegram) {
    try {
      telegram.ready();
      telegram.expand();
    } catch (e) { /* Browser fallback is still available. */ }
  }

  document.querySelectorAll('a[data-telegram-app]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const app = window.Telegram?.WebApp;
      // Telegram keeps the destination inside its interface when supported.
      if (!app || typeof app.openTelegramLink !== 'function') return;
      event.preventDefault();
      try { app.openTelegramLink(link.href); }
      catch (e) { window.open(link.href, '_blank', 'noopener,noreferrer'); }
    });
  });
})();
