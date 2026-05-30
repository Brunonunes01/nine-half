export function getErrorMessage(error) {
  if (!error) return 'Ocorreu um erro inesperado.';
  if (typeof error === 'string') return error;
  return error.message || 'Ocorreu um erro inesperado.';
}
