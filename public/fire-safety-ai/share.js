(() => {
  const shareInstalled = Symbol.for('bigplanner.fireSafetyShare');
  if (window[shareInstalled]) return;
  window[shareInstalled] = true;

  function showSupportedActions(panel) {
    const url = panel.querySelector('[data-fs-share-url]').value;
    const nativeButton = panel.querySelector('[data-fs-share-native]');
    const copyButton = panel.querySelector('[data-fs-share-copy]');
    nativeButton.hidden = typeof navigator.share !== 'function' ||
      (typeof navigator.canShare === 'function' && !navigator.canShare({ url }));
    copyButton.hidden = typeof navigator.clipboard?.writeText !== 'function';
  }

  document.querySelectorAll('[data-fs-share][open]').forEach(showSupportedActions);
  document.addEventListener('toggle', (event) => {
    if (event.target.matches('[data-fs-share][open]')) showSupportedActions(event.target);
  }, true);

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-fs-share-native], button[data-fs-share-copy]');
    if (!button || button.hidden) return;
    const panel = button.closest('[data-fs-share]');
    const field = panel.querySelector('[data-fs-share-url]');
    const status = panel.querySelector('[data-fs-share-status]');
    status.textContent = '';
    try {
      if (button.hasAttribute('data-fs-share-native')) {
        await navigator.share({ title: document.title, url: field.value });
      } else {
        await navigator.clipboard.writeText(field.value);
        status.textContent = status.dataset.copied;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
      status.textContent = status.dataset.manual;
      field.focus();
      field.select();
    }
  });
})();
