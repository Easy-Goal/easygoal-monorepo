import { handleSession } from './handler';

export function createSessionRoute() {
  return async function GET() {
    return handleSession();
  };
}
