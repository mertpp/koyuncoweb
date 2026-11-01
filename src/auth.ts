import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { OAuthConfig } from "next-auth/providers/oauth";

import { ensureAccountForSignedInUser } from "@/shared/api/bootstrap-account";

type AzureProfile = {
  oid?: string;
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  tid?: string;
};

type AzureTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
};

function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split(".");

  if (!payload) {
    return {};
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(normalizedPayload, "base64").toString("utf8");

    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function getJwtStringClaim(token: string, claim: string): string | undefined {
  const value = decodeJwtPayload(token)[claim];

  return typeof value === "string" ? value : undefined;
}

function getOwnerIdFromAzureToken(accessToken: string): string | undefined {
  return getJwtStringClaim(accessToken, "oid") ?? getJwtStringClaim(accessToken, "sub");
}

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function azureScopes(): string {
  return [
    "openid",
    "profile",
    "email",
    "offline_access",
    requiredEnv("AZURE_ENTRA_API_SCOPE"),
  ].join(" ");
}

function azureTenantSubdomain(): string {
  return (
    process.env.AZURE_ENTRA_TENANT_SUBDOMAIN ??
    process.env.AZURE_ENTRA_EXTERNAL_ID_TENANT_SUBDOMAIN ??
    "koyunco"
  );
}

function azureTenantDomain(): string {
  return (
    process.env.AZURE_ENTRA_TENANT_DOMAIN ??
    `${azureTenantSubdomain()}.onmicrosoft.com`
  );
}

function azureCiamAuthorityBase(): string {
  const configuredAuthority = process.env.AZURE_ENTRA_AUTHORITY;

  if (configuredAuthority) {
    return configuredAuthority.replace(/\/$/, "");
  }

  return `https://${azureTenantSubdomain()}.ciamlogin.com`;
}

function azureCiamTenantAuthority(): string {
  return `${azureCiamAuthorityBase()}/${azureTenantDomain()}`;
}

function azureWellKnownEndpoint(): string {
  return `${azureCiamTenantAuthority()}/v2.0/.well-known/openid-configuration`;
}

function azureTokenEndpoint(): string {
  return `${azureCiamAuthorityBase()}/${requiredEnv(
    "AZURE_ENTRA_TENANT_ID",
  )}/oauth2/v2.0/token`;
}

function AzureCiamProvider(): OAuthConfig<AzureProfile> {
  return {
    id: "azure-ad",
    name: "Microsoft Entra External ID",
    type: "oauth",
    wellKnown: azureWellKnownEndpoint(),
    clientId: requiredEnv("AZURE_ENTRA_CLIENT_ID"),
    clientSecret: requiredEnv("AZURE_ENTRA_CLIENT_SECRET"),
    checks: ["pkce", "state"],
    authorization: {
      params: {
        scope: azureScopes(),
      },
    },
    profile(profile) {
      return {
        id: profile.oid ?? profile.sub,
        name: profile.name ?? profile.email ?? profile.preferred_username ?? null,
        email: profile.email ?? profile.preferred_username ?? null,
        image: null,
      };
    },
  };
}

async function refreshAzureAccessToken(token: JWT): Promise<JWT> {
  const refreshToken = token.azureRefreshToken;

  if (!refreshToken) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  const response = await fetch(azureTokenEndpoint(), {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: requiredEnv("AZURE_ENTRA_CLIENT_ID"),
      client_secret: requiredEnv("AZURE_ENTRA_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      scope: azureScopes(),
    }),
  });

  if (!response.ok) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  const refreshed = (await response.json()) as AzureTokenResponse;

  return {
    ...token,
    azureAccessToken: refreshed.access_token,
    azureAccessTokenExpiresAt: Date.now() + refreshed.expires_in * 1000,
    azureRefreshToken: refreshed.refresh_token ?? refreshToken,
    error: undefined,
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [AzureCiamProvider()],

  callbacks: {
    async signIn({ account, profile }) {
      const accessToken = account?.access_token;
      const azureProfile = profile as AzureProfile | undefined;

      if (!accessToken) {
        return false;
      }

      /*
       * En producción preferimos oid.
       * En External ID el ID token puede exponer solo sub, así que usamos el
       * access token para recuperar oid cuando está disponible.
       */
      const ownerId = azureProfile?.oid ?? getOwnerIdFromAzureToken(accessToken);

      if (!ownerId) {
        return false;
      }

      await ensureAccountForSignedInUser(accessToken);

      return true;
    },

    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.azureAccessToken = account.access_token;
        token.azureAccessTokenExpiresAt = account.expires_at
          ? account.expires_at * 1000
          : undefined;
        token.ownerId = getOwnerIdFromAzureToken(account.access_token);
      }

      if (account?.refresh_token) {
        token.azureRefreshToken = account.refresh_token;
      }

      if (profile) {
        const azureProfile = profile as AzureProfile;

        if (azureProfile.oid) {
          token.ownerId = azureProfile.oid;
        }
      }

      const expiresAt = token.azureAccessTokenExpiresAt;

      if (typeof expiresAt === "number" && Date.now() > expiresAt - 60_000) {
        return refreshAzureAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      session.azureAccessToken =
        typeof token.azureAccessToken === "string"
          ? token.azureAccessToken
          : undefined;

      session.error = typeof token.error === "string" ? token.error : undefined;

      if (session.user) {
        session.user.ownerId =
          typeof token.ownerId === "string" ? token.ownerId : undefined;
      }

      return session;
    },
  },
};
