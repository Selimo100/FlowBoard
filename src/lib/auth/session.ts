import type { AstroCookies } from 'astro';

export const SESSION_COOKIE = 'flowboard_session';

export interface UserSession {
  email: string;
}

export function createSession(cookies: AstroCookies, user: UserSession) {
  cookies.set(SESSION_COOKIE, JSON.stringify(user), {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
}

export function getSession(cookies: AstroCookies): UserSession | null {
  const session = cookies.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

export function destroySession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, {
    path: '/'
  });
}
