
import type { APIRoute } from 'astro';
import { IssueService } from '../../../../../lib/services/issue.service';

export const GET: APIRoute = async ({ params, request }) => {
  const { projectId } = params;
  if (!projectId) {
    return new Response(JSON.stringify({ error: 'Project ID required' }), { status: 400 });
  }

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const priority = url.searchParams.get('priority');
    const labels = url.searchParams.get('labels')?.split(',');

    const issues = await IssueService.getIssuesByProject(projectId, { search, priority, labels });
    return new Response(JSON.stringify(issues), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const { projectId } = params;
  if (!projectId) {
    return new Response(JSON.stringify({ error: 'Project ID required' }), { status: 400 });
  }

  try {
    const body = await request.json();
    const { listId, title, priority } = body;

    const issue = await IssueService.createIssue(projectId, listId, title, priority);
    return new Response(JSON.stringify(issue), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
};
