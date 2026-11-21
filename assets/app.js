(() => {
  const app = window.Telegram?.WebApp;
  if (!app) return;
  const mobile = ['ios', 'android', 'android_x'].includes(app.platform);

  function updateInsets() {
    const style = document.documentElement.style;
    for (const side of ['top', 'right', 'bottom', 'left']) {
      const key = '--catalog-' + side;
      if (!app.isFullscreen) {
        style.removeProperty(key);
        continue;
      }
      const device = Number(app.safeAreaInset?.[side]) || 0;
      const chrome = Number(app.contentSafeAreaInset?.[side]) || 0;
      const minimum = side === 'top' && mobile && !chrome ? (app.platform === 'ios' ? 112 : 80) : 0;
      style.setProperty(key, 'max(' + minimum + 'px, calc(max(' + device + 'px, env(safe-area-inset-' + side + ', 0px)) + ' + chrome + 'px))');
    }
  }

  for (const name of ['safeAreaChanged', 'contentSafeAreaChanged', 'fullscreenChanged', 'viewportChanged']) {
    app.onEvent?.(name, updateInsets);
  }
  updateInsets();
  app.ready?.();
  if (mobile) {
    try {
      app.expand?.();
      if (!app.isFullscreen && app.isVersionAtLeast?.('8.0')) app.requestFullscreen?.();
    } catch { /* The regular sheet remains usable. */ }
  }

  document.querySelectorAll('a[data-telegram-app]').forEach(link => {
    link.addEventListener('click', event => {
      if (!app.initData || typeof app.openTelegramLink !== 'function' || event.defaultPrevented ||
          event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
      try {
        app.openTelegramLink(link.href);
        event.preventDefault();
      } catch { /* Leave the original link active if the client declines. */ }
    });
  });
})();
