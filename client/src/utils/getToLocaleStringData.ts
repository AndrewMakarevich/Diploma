export function getToLocaleStringData(data: string) {
  return new Date(data).toLocaleString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' });
}