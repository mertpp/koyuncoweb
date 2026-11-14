import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    error?: string;
    user?: DefaultSession["user"] & {
      ownerId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    ownerId?: string;
    azureAccessToken?: string;
    azureAccessTokenExpiresAt?: number;
    azureRefreshToken?: string;
    error?: string;
  }
}
