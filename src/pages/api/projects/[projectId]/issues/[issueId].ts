
import type { APIRoute } from 'astro';
import { IssueService } from '../../../../../lib/services/issue.service';
import { IssueRepo } from '../../../../../lib/repositories/issue.repo';

export const PUT: APIRoute = async ({ params, request }) => {
  const { projectId, issueId } = params;
  if (!projectId || !issueId) {
    return new Response(JSON.stringify({ error: 'Project ID and Issue ID required' }), { status: 400 });
  }

  try {
    const body = await request.json();

    // Check if this is a move operation
    // We consider it a move if listId or order is being updated
    if (body.listId !== undefined || body.order !== undefined) {
      const currentIssue = await IssueRepo.findById(issueId);
      if (!currentIssue) {
        return new Response(JSON.stringify({ error: 'Issue not found' }), { status: 404 });
      }

      const newListId = body.listId !== undefined ? body.listId : currentIssue.listId;
      
      // If order is provided, use it as the new index
      // If not provided but list changed, append to end? Or keep formatted order?
      // Logic: If list changed but no order, append to end.
      if (body.order !== undefined) {
        await IssueService.moveIssue(issueId, newListId, body.order);
      } else if (body.listId !== undefined && body.listId !== currentIssue.listId) {
        // Find end index of new list
        const issuesInNewList = await IssueRepo.findAllByProject(projectId, { listId: newListId });
        await IssueService.moveIssue(issueId, newListId, issuesInNewList.length);
      } else {
          // Just updating other fields
          await IssueService.updateIssue(issueId, body);
      }

      // If there are other fields to update (title, etc), update them too
      // But usually DnD is separate from Edit content.
      // If body contains others, apply them.
      const otherUpdates: any = {};
      const excludedKeys = ['listId', 'order', '_id', 'projectId', 'createdAt', 'updatedAt'];
      Object.keys(body).forEach(key => {
          if (!excludedKeys.includes(key)) {
              otherUpdates[key] = body[key];
          }
      });
      
      if (Object.keys(otherUpdates).length > 0) {
          await IssueService.updateIssue(issueId, otherUpdates);
      }

    } else {
      // Standard update
      await IssueService.updateIssue(issueId, body);
    }

    const updatedIssue = await IssueRepo.findById(issueId);
    return new Response(JSON.stringify(updatedIssue), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { projectId, issueId } = params;
  if (!projectId || !issueId) {
    return new Response(JSON.stringify({ error: 'Project ID and Issue ID required' }), { status: 400 });
  }

  try {
    await IssueService.deleteIssue(issueId);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
