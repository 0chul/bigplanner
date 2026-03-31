export const formatPhoneNumber = (phone: string) => {
  if (!phone) return '-';
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // 000-0000-0000 format
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return phone;
};
