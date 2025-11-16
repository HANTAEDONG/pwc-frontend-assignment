const DEFAULT_API_BASE_URL =
  "http://dev-assignment-env.eba-vpitzthp.ap-northeast-2.elasticbeanstalk.com";
const DEFAULT_SITE_URL = "http://localhost:3000";

export type EnvConfig = {
  apiBaseUrl: string;
  siteUrl: string;
  dartApiKey: string;
};

export const env: EnvConfig = {
  apiBaseUrl: DEFAULT_API_BASE_URL,
  siteUrl: DEFAULT_SITE_URL,
  dartApiKey: "",
};

export { DEFAULT_API_BASE_URL, DEFAULT_SITE_URL };
