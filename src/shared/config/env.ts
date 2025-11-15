const DEFAULT_API_BASE_URL =
  "https://dev-assignment-env.eba-vpitzthp.ap-northeast-2.elasticbeanstalk.com";
const DEFAULT_SITE_URL = "http://localhost:3000";

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL,
} as const;

export type EnvConfig = typeof env;

export { DEFAULT_API_BASE_URL, DEFAULT_SITE_URL };
