import { ApiError } from "./core";

// The backend error envelope: {"error": {"code", "message", "details"}}; for 422, `details`
// is a list of {loc, msg}. Turned into one message plus errors per field for forms.

export type ApiErrorInfo = { message: string; fieldErrors: Record<string, string> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function describeApiError(error: unknown, fallback = "Something went wrong. Try again."): ApiErrorInfo {
  if (!(error instanceof ApiError)) {
    return { message: fallback, fieldErrors: {} };
  }

  const envelope = isRecord(error.body) && isRecord(error.body.error) ? error.body.error : null;
  const message = envelope && typeof envelope.message === "string" ? envelope.message : fallback;
  const fieldErrors: Record<string, string> = {};

  if (error.status === 422 && envelope && Array.isArray(envelope.details)) {
    for (const item of envelope.details) {
      if (!isRecord(item) || !Array.isArray(item.loc) || typeof item.msg !== "string") {
        continue;
      }

      const field = item.loc[item.loc.length - 1];

      if (typeof field === "string") {
        fieldErrors[field] = item.msg;
      }
    }
  }

  return { message, fieldErrors };
}
