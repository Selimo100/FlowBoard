
import type { APIRoute } from 'astro';
import { SprintService } from '../../../../lib/services/sprint.service';

export const POST: APIRoute = async ({ params }) => {
  const { sprintId } = params;
  if (!sprintId) return new Response(JSON.stringify({ error: 'Sprint ID required' }), { status: 400 });

  try {
    const sprint = await SprintService.completeSprint(sprintId);
    return new Response(JSON.stringify(sprint), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
};
