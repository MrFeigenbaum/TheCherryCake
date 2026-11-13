export function validateEmail(email) {
  if (!email) return 'Email обязателен';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Некорректный формат email';
  return null;
}

export function validatePhone(phone) {
  if (!phone) return 'Номер телефона обязателен';
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.length < 9) return 'Номер телефона слишком короткий';
  return null;
}

export function validateRequired(val, fieldName = 'Поле') {
  if (val === undefined || val === null || String(val).trim() === '') {
    return `${fieldName} обязательно для заполнения`;
  }
  return null;
}