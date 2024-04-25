export default function formatDate(dateInput: Date): string {
  const date = new Date(dateInput);
  const formattedDate = `${date.getHours()}:${date.getMinutes()} ${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
  return formattedDate;
}
