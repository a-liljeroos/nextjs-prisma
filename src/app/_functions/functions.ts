import { randomBytes } from "crypto";

export function randomId(): string {
  const id = randomBytes(10).toString("hex");
  return id;
}

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

interface Range {
  a: number;
  n: number;
}

export function getPoints({ a, n }: Range) {
  const points = [];

  const xMin = -1;
  const xMax = 1;

  const stepSize = (xMax - xMin) / (n - 1);

  for (let i = 0; i < n; i++) {
    const x = xMin + i * stepSize;
    let y = a * x * x + 0 * x + 0;
    y = Math.round(y * 1000) / 1000;
    points.push({ y: y });
  }

  if (points.length > 0) {
    const firstPoint = points[0];
    points[points.length - 1] = { y: firstPoint.y };
  }

  return points;
}

export function isImage(buffer: Uint8Array) {
  const signatures = [
    { header: [0x89, 0x50, 0x4e, 0x47], format: "PNG" },
    { header: [0xff, 0xd8, 0xff], format: "JPEG" },
    { header: [0x52, 0x49, 0x46, 0x46], format: "WebP" },
    {
      header: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
      format: "AVIF",
    },
  ];

  return signatures.some((signature) =>
    signature.header.every((byte, index) => buffer[index] === byte)
  );
}
