import { parseEnv, type Env } from "./schema";

export const env: Env = parseEnv(process.env);
