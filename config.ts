import dotenv from "dotenv";
dotenv.config({ path: ".env", quiet: true });

const mode = process.env.APP_MODE;

if (mode !== "museum" && mode !== "online") {
  throw new Error(`APP_MODE must be "museum" or "online", but is "${mode}"`);
}

export const config = {
  mode,
  fastAnimations: process.env.FAST_ANIMATIONS === "true",
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || "0.0.0.0",
};
