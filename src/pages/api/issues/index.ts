import type { APIRoute } from 'astro';
import { IssueService } from '../../../lib/services/issue.service';
import { requireAuthApi } from '../../../lib/auth/guards';

export const GET: APIRoute = async (context) => {
  const user = requireAuthApi(context);
  if (user instanceof Response) return user;

  try {
    // Basic filter support if needed, otherwise returns all
    // const projectId = url.searchParams.get('projectId');
    // For now, simple getAll as requested by "GET list (limit 50, sorted newest first)"
    const issues = await IssueService.getAllIssues();
    return new Response(JSON.stringify(issues), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { projectId, title, status, description } = body;

    if (!title || !projectId) {
      return new Response(JSON.stringify({ error: 'Title and Project ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const issue = await IssueService.createIssue(projectId, title, status, description);
    return new Response(JSON.stringify(issue), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
