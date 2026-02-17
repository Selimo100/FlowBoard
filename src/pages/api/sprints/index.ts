import type { APIRoute } from 'astro';
import { SprintService } from '../../../lib/services/sprint.service';
import { requireAuthApi } from '../../../lib/auth/guards';

export const GET: APIRoute = async (context) => {
  const user = requireAuthApi(context);
  if (user instanceof Response) return user;

  try {
    const sprints = await SprintService.getAllSprints();
    return new Response(JSON.stringify(sprints), {
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

export const POST: APIRoute = async (context) => {
  const user = requireAuthApi(context);
  if (user instanceof Response) return user;

  try {
    const body = await context.request.json();
    const { projectId, name, startDate, endDate } = body;

    if (!name || !projectId) {
      return new Response(JSON.stringify({ error: 'Name and Project ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sprint = await SprintService.createSprint(projectId, name, new Date(startDate), new Date(endDate));
    return new Response(JSON.stringify(sprint), {
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
