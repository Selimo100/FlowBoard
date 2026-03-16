
import type { APIRoute } from 'astro';
import { SprintService } from '../../../../../lib/services/sprint.service';

export const GET: APIRoute = async ({ params }) => {
  const { projectId } = params;
  
  if (!projectId) {
    return new Response(JSON.stringify({ error: 'Project ID required' }), { status: 400 });
  }

  try {
    const sprints = await SprintService.getAllSprints(projectId);
    return new Response(JSON.stringify(sprints), { status: 200 });
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
    const data = await request.json();
    const sprint = await SprintService.createSprint(projectId, data);
    return new Response(JSON.stringify(sprint), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
};
