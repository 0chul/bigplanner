(() => {
  const form = document.querySelector('[data-workload-form]');
  if (!form) return;

  const fields = form.querySelector('[data-workload-fields]');
  const inputs = ['requests', 'minutes', 'days', 'eligible'].map(name => form.elements.namedItem(name));
  const outputs = ['baseline', 'review', 'requests'].map(name => document.querySelector(`[data-workload-result="${name}"]`));
  const progress = document.querySelector('[data-workload-share]');
  const invalid = document.querySelector('[data-workload-invalid]');
  const reset = document.querySelector('[data-workload-reset]');
  if (!fields || !progress || !invalid || !reset || [...inputs, ...outputs].some(element => !element)) return;

  const locale = form.dataset.numberLocale;
  // Some Chromium builds omit Icelandic. German uses the same numeric separators.
  const numberLocales = locale === 'is-IS' ? [locale, 'de-DE'] : locale;
  const formatter = new Intl.NumberFormat(numberLocales, { maximumFractionDigits: 1 });

  function readInput(input) {
    const text = input.value.trim().normalize('NFKC')
      .replace(/[٠-٩۰-۹]/g, digit => String(digit.charCodeAt(0) & 15))
      .replace(/[,٫]/g, '.');
    const pattern = input.inputMode === 'decimal' ? /^-?(?:\d+(?:\.\d)?|\.\d)$/ : /^-?\d+$/;
    const value = pattern.test(text) ? Number(text) : NaN;
    const valid = value >= 0 && value <= Number(input.dataset.workloadMax);
    if (valid) input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
    return valid ? value || 0 : NaN;
  }

  function render() {
    const values = inputs.map(readInput);
    const valid = values.every(Number.isFinite);
    invalid.hidden = valid;
    if (!valid) {
      outputs.forEach(output => { output.textContent = '—'; });
      progress.value = 0;
      return;
    }

    const [requests, minutes, days, eligible] = values;
    // Keep the one-decimal minute input exact until converting to hours for display.
    const totalTenthsOfMinutes = requests * Math.round(minutes * 10) * days;
    const results = [totalTenthsOfMinutes / 600, totalTenthsOfMinutes * eligible / 60_000, requests * days * eligible / 100];
    outputs.forEach((output, index) => { output.textContent = formatter.format(results[index]); });
    progress.value = eligible;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    render();
  });
  form.addEventListener('input', render);
  reset.addEventListener('click', () => {
    form.reset();
    render();
  });
  fields.disabled = false;
  render();
})();
