import type { APIContext } from 'astro';
import { getSession } from './session';

export function requireAuth(context: APIContext) {
  const session = getSession(context.cookies);
  if (!session) {
    return context.redirect('/login');
  }
  return session;
}

export function requireAuthApi(context: APIContext) {
  const session = getSession(context.cookies);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  return session;
}
