// src/shared/config/api.ts (o al inicio de koyun-api.ts)

export const API_BASE_URL =
  typeof window !== "undefined"
    ? "" // En el navegador, usa ruta relativa para que Next.js haga el proxy por el rewrite
    : process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "http://koyunco-dev:8004"; // En el servidor (SSR), usa la red de Docker
