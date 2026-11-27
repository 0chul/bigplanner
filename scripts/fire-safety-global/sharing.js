const copyByLanguage = {
  en: {
    summary: 'Share link', address: 'Page address', native: 'Share to an app', copy: 'Copy link',
    copied: 'Link copied.', manual: 'Select and copy the page address above.',
  },
  de: {
    summary: 'Link teilen', address: 'Adresse der Seite', native: 'Über eine App teilen', copy: 'Link kopieren',
    copied: 'Link kopiert.', manual: 'Markieren und kopieren Sie die Seitenadresse oben.',
  },
  fr: {
    summary: 'Partager le lien', address: 'Adresse de la page', native: 'Partager via une application', copy: 'Copier le lien',
    copied: 'Lien copié.', manual: 'Sélectionnez et copiez l’adresse de la page ci-dessus.',
  },
  ja: {
    summary: 'リンクを共有', address: 'ページのURL', native: 'アプリで共有', copy: 'リンクをコピー',
    copied: 'リンクをコピーしました。', manual: '上の欄でページのURLを選択してコピーしてください。',
  },
  'zh-Hant': {
    summary: '分享連結', address: '網頁網址', native: '透過應用程式分享', copy: '複製連結',
    copied: '已複製連結。', manual: '請選取並複製上方的網址。',
  },
  ar: {
    summary: 'مشاركة الرابط', address: 'عنوان الصفحة', native: 'المشاركة عبر تطبيق', copy: 'نسخ الرابط',
    copied: 'تم نسخ الرابط.', manual: 'حدّد عنوان الصفحة أعلاه وانسخه.',
  },
  nb: {
    summary: 'Del lenken', address: 'Nettadresse', native: 'Del via en app', copy: 'Kopier lenken',
    copied: 'Lenken er kopiert.', manual: 'Merk og kopier nettadressen ovenfor.',
  },
  da: {
    summary: 'Del linket', address: 'Sidens adresse', native: 'Del via en app', copy: 'Kopiér linket',
    copied: 'Linket er kopieret.', manual: 'Markér og kopiér sidens adresse ovenfor.',
  },
  nl: {
    summary: 'Link delen', address: 'Pagina-adres', native: 'Delen via een app', copy: 'Link kopiëren',
    copied: 'Link gekopieerd.', manual: 'Selecteer en kopieer het pagina-adres hierboven.',
  },
  sv: {
    summary: 'Dela länken', address: 'Sidans webbadress', native: 'Dela via en app', copy: 'Kopiera länken',
    copied: 'Länken har kopierats.', manual: 'Markera och kopiera webbadressen ovan.',
  },
  fi: {
    summary: 'Jaa linkki', address: 'Sivun osoite', native: 'Jaa sovelluksessa', copy: 'Kopioi linkki',
    copied: 'Linkki kopioitiin.', manual: 'Valitse ja kopioi yllä oleva sivun osoite.',
  },
  it: {
    summary: 'Condividi il link', address: 'Indirizzo della pagina', native: 'Condividi tramite un’app', copy: 'Copia il link',
    copied: 'Link copiato.', manual: 'Seleziona e copia l’indirizzo della pagina qui sopra.',
  },
  he: {
    summary: 'שיתוף קישור', address: 'כתובת הדף', native: 'שיתוף דרך יישום', copy: 'העתקת קישור',
    copied: 'הקישור הועתק.', manual: 'יש לבחור ולהעתיק את כתובת הדף שמופיעה למעלה.',
  },
  es: {
    summary: 'Compartir enlace', address: 'Dirección de la página', native: 'Compartir en una app', copy: 'Copiar enlace',
    copied: 'Enlace copiado.', manual: 'Selecciona y copia la dirección de la página que aparece arriba.',
  },
};

export const shareAssets = `<link rel="stylesheet" href="/fire-safety-ai/share.css">
  <script defer src="/fire-safety-ai/share.js"></script>`;

export function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function renderPageShare(code, title, canonical, emailLabel, copy = copyByLanguage[code]) {
  if (!copy || !emailLabel) throw new Error(`Missing share labels for ${code}`);
  const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(canonical)}`;

  return `<details class="fs-share share" data-fs-share>
    <summary>${escapeHtml(copy.summary)}</summary>
    <div class="fs-share-panel">
      <label class="fs-share-address">${escapeHtml(copy.address)}<input data-fs-share-url dir="ltr" type="url" readonly value="${escapeHtml(canonical)}"></label>
      <div class="fs-share-actions">
        <button data-fs-share-native type="button" hidden>${escapeHtml(copy.native)}</button>
        <button data-fs-share-copy type="button" hidden>${escapeHtml(copy.copy)}</button>
        <a href="${escapeHtml(mailto)}">${escapeHtml(emailLabel)}</a>
      </div>
      <p class="fs-share-status" data-fs-share-status role="status" data-copied="${escapeHtml(copy.copied)}" data-manual="${escapeHtml(copy.manual)}"></p>
    </div>
  </details>`;
}
