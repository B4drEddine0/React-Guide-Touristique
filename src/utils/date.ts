export function formatDate(dateValue: string) {
  return new Date(dateValue).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
