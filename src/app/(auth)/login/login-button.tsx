"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
      className="w-full rounded-full bg-stone-50 px-5 py-3 text-sm font-medium text-stone-950 transition hover:bg-stone-200"
    >
      Continue with email
    </button>
  );
}
