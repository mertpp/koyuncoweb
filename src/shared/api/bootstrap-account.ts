import { API_BASE_URL } from "@/shared/config/api";

export async function ensureAccountForSignedInUser(
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/v1/me`, {
    method: "POST",
    cache: "no-store",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      locale: "es",
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    throw new Error(
      `POST /v1/me failed during sign-in: ${response.status} ${body}`,
    );
  }
}
