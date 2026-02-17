import type { APIRoute } from 'astro';
import { createSession } from '../../../lib/auth/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const data = await request.formData();
  const email = data.get('email')?.toString();
  const password = data.get('password')?.toString();

  if (!email || !password) {
    return new Response(JSON.stringify({
      message: 'Email and password are required'
    }), { status: 400 });
  }

  // Mock authentication logic
  // In a real app, this would validate against a database
  if (password.length < 6) { 
      return new Response(JSON.stringify({
      message: 'Password must be at least 6 characters'
    }), { status: 401 });
  }

  createSession(cookies, { email });

  return redirect('/projects');
};
