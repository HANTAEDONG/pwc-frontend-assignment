import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const hasTz = /[zZ]|[+-]\d{2}:\d{2}$/.test(dateString);

  const normalized = dateString.includes("T")
    ? dateString
    : dateString.replace(" ", "T");
  const base = new Date(normalized);
  const date = hasTz ? base : new Date(base.getTime() + 9 * 60 * 60 * 1000);

  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const dayPeriod = get("dayPeriod"); // 오전/오후
  const hour = get("hour");
  const minute = get("minute");

  return `${year}. ${month}. ${day} ${dayPeriod} ${hour}:${minute}`;
}
