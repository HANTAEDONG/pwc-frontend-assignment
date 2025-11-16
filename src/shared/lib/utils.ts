import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  // 백엔드가 UTC 또는 타임존 미포함 문자열을 줄 수 있으므로,
  // 항상 KST(Asia/Seoul) 기준으로 표기한다.
  // ISO 미포함 공백 포맷("YYYY-MM-DD HH:mm:ss")인 경우를 보완하여 파싱.
  const normalized =
    dateString.includes("T") || /[zZ]|[+-]\d{2}:\d{2}$/.test(dateString)
      ? dateString
      : dateString.replace(" ", "T") + "Z";
  const date = new Date(normalized);

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
