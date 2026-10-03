import { defaultDeps, handleReflect } from "../server/reflect.js";

// Vercel Function: the Gemini key stays on the server, never in the browser bundle.
export async function POST(request: Request): Promise<Response> {
  return handleReflect(request, defaultDeps());
}
