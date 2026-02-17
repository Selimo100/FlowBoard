import type { APIRoute } from 'astro';
import { IssueService } from '../../../lib/services/issue.service';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { issueId } = params;
    if (!issueId) return new Response(null, { status: 404 });

    const issue = await IssueService.getIssueById(issueId);
    if (!issue) {
      return new Response(JSON.stringify({ error: 'Issue not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(issue), {
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

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const { issueId } = params;
    if (!issueId) return new Response(null, { status: 404 });

    const body = await request.json();
    const result = await IssueService.updateIssue(issueId, body);

    if (!result) {
       return new Response(JSON.stringify({ error: 'Issue not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result), {
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

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { issueId } = params;
    if (!issueId) return new Response(null, { status: 404 });

    const success = await IssueService.deleteIssue(issueId);
    if (!success) {
      return new Response(JSON.stringify({ error: 'Issue not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
