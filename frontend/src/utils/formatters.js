export const digitsOnly = (value = '') => String(value).replace(/\D/g, '');

export const formatPakCnic = (value = '') => {
  const digits = digitsOnly(value).slice(0, 13);
  if (digits.length <= 5) {
    return digits;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
};