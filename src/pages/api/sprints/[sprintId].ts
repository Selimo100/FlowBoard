
import type { APIRoute } from 'astro';
import { SprintService } from '../../../lib/services/sprint.service';
import { SprintRepo } from '../../../lib/repositories/sprint.repo';

export const GET: APIRoute = async ({ params }) => {
  const { sprintId } = params;
  if (!sprintId) return new Response(JSON.stringify({ error: 'Sprint ID required' }), { status: 400 });

  try {
    const sprint = await SprintService.getSprintById(sprintId);
    if (!sprint) return new Response(JSON.stringify({ error: 'Sprint not found' }), { status: 404 });
    return new Response(JSON.stringify(sprint), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { sprintId } = params;
  if (!sprintId) return new Response(JSON.stringify({ error: 'Sprint ID required' }), { status: 400 });

  try {
    const body = await request.json();
    const { name, goal, startDate, endDate } = body;
    
    // Only allow updating editable fields
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (goal !== undefined) updates.goal = goal;
    if (startDate !== undefined) updates.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updates.endDate = endDate ? new Date(endDate) : null;

    const updatedSprint = await SprintService.updateSprint(sprintId, updates);
    return new Response(JSON.stringify(updatedSprint), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { sprintId } = params;
  if (!sprintId) return new Response(JSON.stringify({ error: 'Sprint ID required' }), { status: 400 });

  try {
    const result = await SprintService.deleteSprint(sprintId);
    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
