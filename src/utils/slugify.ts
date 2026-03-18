export const generateSlug = (text: string): string => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Remove all non-word chars except Korean and hyphens
    .replace(/[^\w\-ㄱ-ㅎㅏ-ㅣ가-힣]+/g, '')
    // Replace multiple - with single -
    .replace(/\-\-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};
