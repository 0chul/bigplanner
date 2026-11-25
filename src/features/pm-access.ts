import { supabase } from '../supabase';

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
  return html
    .replace(accountAttribute, () => `data-pm-account="${encodeURIComponent(accountId)}"`)
    .replace(modeAttribute, `data-pm-mode="${sample ? 'sample' : 'estimate'}"`);
}
