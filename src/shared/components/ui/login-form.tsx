"use client";

import {
  ArrowRightIcon,
  CameraIcon,
  ShirtIcon,
  LockIcon,
  MailIcon,
  SparklesIcon,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "cn";

import { ENABLE_DEMO_LOGIN } from "@/shared/auth/constants";
import { Button } from "@/shared/components/ui/button";

const demoAccount = {
  label: "Continue as Mert",
  ownerId: "11111111-1111-1111-1111-111111111111",
};

type LoginFormProps = React.ComponentProps<"main"> & {
  nextPath?: string;
};

type AuthMode = "login" | "register";
type SocialProvider = "google" | "apple" | "facebook";

const socialProviders: Array<{
  id: SocialProvider;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: "google",
    label: "Google",
    icon: <GoogleIcon className="size-4" />,
  },
  {
    id: "apple",
    label: "Apple",
    icon: <AppleIcon className="size-4" />,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: <FacebookIcon className="size-4" />,
  },
];

export function LoginForm({
  className,
  nextPath = "/dashboard",
  ...props
}: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const isRegister = mode === "register";

  async function startAzureAuth() {
    setStatus(
      isRegister
        ? "Opening secure registration…"
        : "Opening secure sign in…",
    );

    const authorizationParams: Record<string, string> = {
      prompt: isRegister ? "create" : "select_account",
    };

    const loginHint = email.trim();

    if (loginHint) {
      authorizationParams.login_hint = loginHint;
    }

    await signIn(
      "azure-ad",
      {
        callbackUrl: nextPath,
      },
      authorizationParams,
    );
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    await startAzureAuth();
  }

  async function handleSocialAuth() {
    await startAzureAuth();
  }

  async function handleContinueAsMert() {
    const response = await fetch("/api/auth/demo-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerId: demoAccount.ownerId,
        next: nextPath,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as {
      next?: string;
    };

    router.push(data.next || nextPath);
    router.refresh();
  }

  return (
    <main
      className={cn(
        "min-h-svh bg-surface text-on-surface selection:bg-secondary-container selection:text-on-secondary-container",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col px-margin-mobile py-space-md md:justify-center md:py-space-xl">
        <header className="flex items-center justify-between pb-space-lg">
          <div className="flex items-center gap-space-xs">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
              Archive Edition No. 04
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-outline">
            Paris / Zürich
          </span>
        </header>

        <section className="flex flex-col items-center text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-outline">
            Private wardrobe index
          </p>
          <h1 className="mt-space-xs font-heading text-[34px] italic leading-[1.05] tracking-[-0.02em] text-primary md:text-5xl">
            KoyunCo
          </h1>
          <p className="mt-space-xs max-w-[270px] text-sm leading-6 text-secondary">
            A personal archive for considered clothing.
          </p>
        </section>

        <section className="relative mt-space-lg overflow-hidden rounded-xl bg-surface-container shadow-sm">
          <div className="h-44 bg-[radial-gradient(circle_at_22%_18%,rgba(211,232,208,0.75),transparent_28%),radial-gradient(circle_at_75%_20%,rgba(188,174,150,0.45),transparent_24%),linear-gradient(135deg,#e8e2d9_0%,#d8d2c5_34%,#8d947c_68%,#2c3e2d_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.18)_32%,transparent_33%),linear-gradient(55deg,rgba(23,40,25,0.25),transparent_55%)]" />
          <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between text-white">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-90">
              Texture No. 82 // Melange Weave
            </span>
            <CameraIcon className="size-4 opacity-80" />
          </div>
        </section>

        <section className="mt-space-lg rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="grid grid-cols-2 gap-space-xs rounded-xl bg-surface p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setStatus(null);
              }}
              className={cn(
                "h-10 rounded-lg text-sm font-medium transition-colors",
                !isRegister
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-secondary hover:text-on-surface",
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setStatus(null);
              }}
              className={cn(
                "h-10 rounded-lg text-sm font-medium transition-colors",
                isRegister
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-secondary hover:text-on-surface",
              )}
            >
              Register
            </button>
          </div>

          <div className="mt-space-md grid grid-cols-3 gap-space-xs">
            {socialProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={handleSocialAuth}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition hover:bg-surface active:scale-[0.99]"
                aria-label={`${isRegister ? "Register" : "Continue"} with ${provider.label}`}
              >
                {provider.icon}
                <span className="sr-only md:not-sr-only md:inline">
                  {provider.label}
                </span>
              </button>
            ))}
          </div>

          <div className="relative my-space-md flex items-center justify-center">
            <div className="h-px w-full bg-surface-variant" />
            <span className="absolute bg-surface-container-lowest px-space-sm text-xs text-secondary">
              or {isRegister ? "register" : "login"} with email
            </span>
          </div>

          <form className="space-y-space-sm" onSubmit={handleEmailSubmit}>
            <div className="relative">
              <label className="sr-only" htmlFor="collector-email">
                Collector email address
              </label>
              <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-secondary" />
              <input
                id="collector-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="curator@studio.com"
                required
                className="h-12 w-full rounded-xl bg-surface py-0 pl-10 pr-4 text-sm text-on-surface shadow-inner outline-none transition-colors placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-primary-container text-on-primary transition-all hover:opacity-95 active:scale-[0.99]"
            >
              <span>
                {isRegister
                  ? "Request Private Access / Register"
                  : "Request Private Access / Sign In"}
              </span>
              <ArrowRightIcon className="size-4" />
            </Button>
          </form>

          {status ? (
            <div className="mt-space-sm rounded-lg bg-surface-container p-space-sm text-center">
              <p className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                <SparklesIcon className="size-3.5" />
                <span>{status}</span>
              </p>
            </div>
          ) : null}

          <p className="mt-space-md text-center text-sm text-secondary">
            {isRegister ? "Already registered?" : "New to KoyunCo?"} {" "}
            <button
              type="button"
              onClick={() => {
                setMode(isRegister ? "login" : "register");
                setStatus(null);
              }}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {isRegister ? "Login" : "Register with email"}
            </button>
          </p>

          {ENABLE_DEMO_LOGIN ? (
            <div className="mt-space-md border-t border-surface-variant pt-space-md">
              <Button
                variant="secondary"
                type="button"
                onClick={handleContinueAsMert}
                className="h-11 w-full rounded-xl"
              >
                {demoAccount.label}
              </Button>
            </div>
          ) : null}
        </section>

        <section className="mt-space-lg flex items-center justify-between rounded-xl bg-surface-container p-space-sm">
          <div className="flex items-center gap-2">
            <ShirtIcon className="size-5 text-secondary" />
            <span className="text-xs text-on-surface">Private Wardrobe Index</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-surface-tint" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
              Vault Active
            </span>
          </div>
        </section>

        <footer className="mt-space-lg flex flex-col items-center gap-space-xs text-center">
          <div className="flex items-center gap-1.5 text-secondary">
            <LockIcon className="size-3.5" />
            <p className="text-xs leading-5">
              Encrypted & private. Your wardrobe data remains personal.
            </p>
          </div>
          <div className="flex items-center gap-space-sm text-outline">
            <a className="text-[11px] font-medium hover:text-on-surface" href="#concierge">
              Members Concierge
            </a>
            <span className="font-mono text-[10px]">•</span>
            <a className="text-[11px] font-medium hover:text-on-surface" href="#privacy">
              Privacy & Terms
            </a>
            <span className="font-mono text-[10px]">•</span>
            <span className="font-mono text-[10px]">v2.1.0</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.52Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.6-4.12H3.05v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.89a6 6 0 0 1 0-3.78v-2.6H3.05a10 10 0 0 0 0 8.98l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.99c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.96 3 14.7 2 12 2a10 10 0 0 0-8.95 5.51l3.35 2.6C7.2 7.75 9.4 5.99 12 5.99Z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.53 12.02c-.02-2.1 1.72-3.1 1.8-3.15-1-.1.1-2.48-2.55-2.58-1.18-.12-2.3.7-2.9.7-.6 0-1.52-.68-2.5-.66-1.29.02-2.48.75-3.14 1.9-1.34 2.31-.35 5.73.96 7.6.64.92 1.4 1.95 2.4 1.91.96-.04 1.33-.62 2.5-.62 1.15 0 1.49.62 2.51.6 1.04-.02 1.7-.94 2.33-1.86.74-1.07 1.04-2.1 1.05-2.16-.02-.01-2.03-.78-2.05-3.1Zm-1.52-6.98c.53-.64.9-1.53.8-2.42-.77.03-1.7.51-2.25 1.15-.5.57-.93 1.49-.81 2.36.85.07 1.73-.44 2.26-1.09Z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.23 2.68.23v2.97h-1.5c-1.49 0-1.95.93-1.95 1.88v2.28h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z"
      />
    </svg>
  );
}
