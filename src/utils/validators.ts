export function validateRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function validateEmail(email) {
  if (!validateRequired(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  if (!validateRequired(password)) return false;
  return String(password).length >= 6;
}
