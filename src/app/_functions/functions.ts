export default function formatDate(dateInput: Date): string {
  const date = new Date(dateInput);
  const formattedDate = `${date.getHours()}:${date.getMinutes()} ${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
  return formattedDate;
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function getRandomItem<T>(obj: { [key: string]: T }): T {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return obj[randomKey];
}
export function getRandomArrayItem<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function getRandomNumber(min: number, max: number): number {
  const randomNumber = Math.random();
  const scaledNumber = randomNumber * (max - min + 1);
  const result = Math.floor(scaledNumber) + min;
  return result;
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomChar(str: string): string {
  const randomIndex = Math.floor(Math.random() * str.length);
  return str[randomIndex];
}
