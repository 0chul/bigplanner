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

  const formatter = new Intl.NumberFormat(document.documentElement.lang || undefined, { maximumFractionDigits: 1 });

  function render() {
    const valid = inputs.every(input => input.validity.valid && Number.isFinite(input.valueAsNumber));
    invalid.hidden = valid;
    if (!valid) {
      outputs.forEach(output => { output.textContent = '—'; });
      progress.value = 0;
      return;
    }

    const [requests, minutes, days, eligible] = inputs.map(input => input.valueAsNumber || 0);
    // Keep the one-decimal minute input exact until converting to hours for display.
    const totalTenthsOfMinutes = requests * Math.round(minutes * 10) * days;
    const values = [totalTenthsOfMinutes / 600, totalTenthsOfMinutes * eligible / 60_000, requests * days * eligible / 100];
    outputs.forEach((output, index) => { output.textContent = formatter.format(values[index]); });
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
