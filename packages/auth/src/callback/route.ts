import { handleAuthCallback } from './handler';
import type { CallbackConfig } from '../types';
import type { NextRequest } from 'next/server';

export function createCallbackRoute(config: CallbackConfig) {
  return async function GET(request: NextRequest) {
    return handleAuthCallback(request, config);
  };
}
