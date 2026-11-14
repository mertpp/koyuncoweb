// src/shared/config/api.ts (o al inicio de koyun-api.ts)

export const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api/backend" // Browser requests go through a server-side authenticated proxy.
    : process.env.API_BASE_URL ||
      "http://koyunco-dev:8004"; // En el servidor (SSR), usa la red de Docker
