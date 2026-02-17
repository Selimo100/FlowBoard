import type { APIRoute } from 'astro';
import { SprintService } from '../../../lib/services/sprint.service';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { sprintId } = params;
    if (!sprintId) return new Response(null, { status: 404 });

    const sprint = await SprintService.getSprintById(sprintId);
    if (!sprint) {
      return new Response(JSON.stringify({ error: 'Sprint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(sprint), {
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

// Omitting PATCH/DELETE for brevity in sprints unless strictly needed, but better to keep consistent.
export const DELETE: APIRoute = async ({ params }) => {
    try {
      const { sprintId } = params;
      if (!sprintId) return new Response(null, { status: 404 });
  
      const success = await SprintService.deleteSprint(sprintId);
      if (!success) {
        return new Response(JSON.stringify({ error: 'Sprint not found' }), {
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
