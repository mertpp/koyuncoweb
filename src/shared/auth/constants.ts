export const AUTH_COOKIE_NAME = "koyunco_owner_id";

export const DEFAULT_LOGIN_PATH = "/";

export const ONBOARDING_CONTINUE_PATH = "/onboarding/continue";

export const DEFAULT_AUTHENTICATED_PATH = ONBOARDING_CONTINUE_PATH;

export const ENABLE_DEMO_LOGIN =
  process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === "true";

export const DEMO_USERS = [
  {
    label: "Continue as Mert",
    ownerId: "11111111-1111-1111-1111-111111111111",
  },
] as const;
