// Explanation: This file defines the API endpoints for project management.
// It handles GET requests to retreieve all projects and POST requests to create a new project.
// This runs on the server and communicates directly with the ProjectService.

import type { APIRoute } from 'astro';
import { ProjectService } from '../../../lib/services/project.service';
import { requireAuthApi } from '../../../lib/auth/guards';

export const GET: APIRoute = async (context) => {
  const user = requireAuthApi(context);
  if (user instanceof Response) return user;

  try {
    const projects = await ProjectService.getAllProjects();
    return new Response(JSON.stringify(projects), {
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
    const { name, description, repositoryUrl } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const project = await ProjectService.createProject(name, description, repositoryUrl);
    
    return new Response(JSON.stringify(project), {
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
