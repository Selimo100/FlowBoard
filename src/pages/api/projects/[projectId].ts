import type { APIRoute } from 'astro';
import { ProjectService } from '../../../lib/services/project.service';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { projectId } = params;
    if (!projectId) return new Response(null, { status: 404 });

    const project = await ProjectService.getProjectById(projectId);
    if (!project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(project), {
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
    const { projectId } = params;
    if (!projectId) return new Response(null, { status: 404 });

    const body = await request.json();
    const result = await ProjectService.updateProject(projectId, body);

    if (!result) {
       return new Response(JSON.stringify({ error: 'Project not found or invalid ID' }), {
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
    const { projectId } = params;
    if (!projectId) return new Response(null, { status: 404 });

    const success = await ProjectService.deleteProject(projectId);
    if (!success) {
      return new Response(JSON.stringify({ error: 'Project not found or could not be deleted' }), {
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
