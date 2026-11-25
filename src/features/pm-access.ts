import { supabase } from '../supabase';

const BRAND_HEAD_ASSETS = `
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css" />
<style id="bigplanner-brand-tone">
  :root {
    --bp-ink: #111827;
    --bp-muted: #4b5563;
    --bp-border: #e5e7eb;
    --bp-surface: #f9fafb;
    --bp-accent: #2563eb;
    --bp-accent-dark: #1d4ed8;
  }
  html, body {
    font-family: "Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    word-break: keep-all;
    letter-spacing: -0.015em;
  }
  table, th, td, input[type="number"], .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
  ::selection {
    background: #dbeafe;
    color: #1e3a8a;
  }
  :focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
  @media screen {
    .bp-step-hidden {
      display: none !important;
    }
    .bp-step-focus-ring {
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
      transition: box-shadow 0.25s ease;
    }
  }
</style>`;

const STEP_BRIDGE_SCRIPT = `
<script id="bigplanner-step-bridge">
(function() {
  if (window.__bpStepBridgeInstalled) return;
  window.__bpStepBridgeInstalled = true;

  var STEP_RULES = [
    { step: 0, regex: /(기본|프로젝트|사업지|건축주|고객|대지|연면적|규모|면적|개요|client|site|project|basic|info)/i },
    { step: 1, regex: /(패키지|업무|옵션|선택|과업|항목|범위|서비스|package|option|task|scope|service)/i },
    { step: 2, regex: /(견적|금액|비용|수수료|합계|할인|부가세|지급|조건|산출|요율|fee|cost|price|estimate|total|discount)/i },
    { step: 3, regex: /(제안서|미리보기|출력|인쇄|서명|특약|비고|안내|발송|proposal|preview|print|document|output)/i }
  ];

  var discoveredBlocks = [];
  var currentStep = 0;
  var currentFocusMode = true;

  function isPersistentBlock(el) {
    if (!el || !el.tagName) return true;
    var tag = el.tagName.toLowerCase();
    if (tag === 'header' || tag === 'nav' || tag === 'footer') return true;
    var cls = (el.className && typeof el.className === 'string') ? el.className : '';
    if (/(sticky|floating|summary-bar|total-bar|nav|tabs|stepper|hero)/i.test(cls)) return true;
    return false;
  }

  function classifyText(text, index, total) {
    var snippet = (text || '').slice(0, 180);
    for (var i = 0; i < STEP_RULES.length; i++) {
      if (STEP_RULES[i].regex.test(snippet)) {
        return STEP_RULES[i].step;
      }
    }
    if (total <= 1) return 0;
    return Math.min(3, Math.floor((index / total) * 4));
  }

  function collectBlocks() {
    if (document.documentElement.dataset.pmMode === 'sample') return [];
    var root = document.querySelector('main, #app, .workspace, .container, .wrap, form') || document.body;
    if (!root) return [];

    var candidates = Array.from(root.querySelectorAll(':scope > section, :scope > article, :scope > .card, :scope > .panel, :scope > .section, :scope > .step, :scope > fieldset'));
    if (candidates.length < 2) {
      candidates = Array.from(root.children).filter(function(el) {
        if (!el || isPersistentBlock(el)) return false;
        var tag = el.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'link') return false;
        return Boolean(el.querySelector('h1, h2, h3, h4, legend, input, select, textarea, table'));
      });
    } else {
      candidates = candidates.filter(function(el) { return !isPersistentBlock(el); });
    }

    // Deduplicate nested elements
    candidates = candidates.filter(function(el, idx, arr) {
      return !arr.some(function(other, otherIdx) {
        return otherIdx !== idx && other.contains(el);
      });
    });

    if (candidates.length < 2) return [];

    return candidates.map(function(el, idx) {
      var heading = el.querySelector('h1, h2, h3, h4, legend, .section-title, .card-title, .title');
      var titleText = heading ? heading.textContent.trim() : '';
      var explicitStep = el.getAttribute('data-bp-step') || el.getAttribute('data-step');
      var step = explicitStep !== null && !isNaN(Number(explicitStep))
        ? Math.max(0, Math.min(3, Number(explicitStep) > 3 ? Number(explicitStep) - 1 : Number(explicitStep)))
        : classifyText(titleText || el.textContent, idx, candidates.length);
      return { el: el, step: step, title: titleText || ('섹션 ' + (idx + 1)) };
    });
  }

  function applyStepView() {
    if (!discoveredBlocks.length) return;
    var firstMatch = null;
    discoveredBlocks.forEach(function(item) {
      item.el.classList.remove('bp-step-focus-ring');
      if (currentFocusMode) {
        if (item.step === currentStep) {
          item.el.classList.remove('bp-step-hidden');
          if (!firstMatch) firstMatch = item.el;
        } else {
          item.el.classList.add('bp-step-hidden');
        }
      } else {
        item.el.classList.remove('bp-step-hidden');
        if (item.step === currentStep && !firstMatch) firstMatch = item.el;
      }
    });

    if (firstMatch) {
      if (currentFocusMode) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'start' });
        firstMatch.classList.add('bp-step-focus-ring');
        window.setTimeout(function() {
          firstMatch && firstMatch.classList.remove('bp-step-focus-ring');
        }, 1200);
      }
    }
  }

  function initBridge() {
    discoveredBlocks = collectBlocks();
    var stepCounts = [0, 0, 0, 0];
    discoveredBlocks.forEach(function(b) { stepCounts[b.step] = (stepCounts[b.step] || 0) + 1; });
    try {
      window.parent.postMessage({
        type: 'bp-pm-discovered',
        supported: discoveredBlocks.length >= 2,
        totalBlocks: discoveredBlocks.length,
        stepCounts: stepCounts
      }, '*');
    } catch (_) {}
    if (discoveredBlocks.length >= 2) {
      applyStepView();
    }
  }

  window.addEventListener('message', function(event) {
    if (!event.data || event.data.type !== 'bp-pm-set-step') return;
    currentStep = Number(event.data.stepIndex) || 0;
    currentFocusMode = event.data.focusMode !== false;
    if (discoveredBlocks.length >= 2) {
      applyStepView();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridge);
  } else {
    initBridge();
  }
})();
</script>`;

export async function downloadPmAsset(assetPath: string, signal?: AbortSignal): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from('pm-estimates-private')
    .download(assetPath, {}, { cache: 'no-store', signal });
  if (error) throw error;
  if (!data) throw new Error('PM 자료를 불러올 수 없습니다.');
  return data;
}

export async function loadPmWorkspace(accountId: string, sample: boolean, signal?: AbortSignal) {
  const blob = await downloadPmAsset('workspace.html', signal);
  const html = await blob.text();
  signal?.throwIfAborted();
  const accountAttribute = 'data-pm-account="__PM_ACCOUNT_ID__"';
  const modeAttribute = 'data-pm-mode="__PM_PREVIEW_MODE__"';
  if (!html.includes(accountAttribute) || !html.includes(modeAttribute)) {
    throw new Error('PM 견적 화면의 형식이 올바르지 않습니다.');
  }
  let hydrated = html
    .replace(accountAttribute, () => `data-pm-account="${encodeURIComponent(accountId)}"`)
    .replace(modeAttribute, `data-pm-mode="${sample ? 'sample' : 'estimate'}"`);

  if (hydrated.includes('</head>')) {
    hydrated = hydrated.replace('</head>', `${BRAND_HEAD_ASSETS}\n</head>`);
  }
  if (!sample && hydrated.includes('</body>')) {
    hydrated = hydrated.replace('</body>', `${STEP_BRIDGE_SCRIPT}\n</body>`);
  }
  return hydrated;
}
