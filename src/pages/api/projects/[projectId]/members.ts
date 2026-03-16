import type { APIRoute } from "astro";
import { getSessionFromRequest } from "../../../../lib/auth/session";
import { ProjectMemberService } from "../../../../lib/services/project-member.service";

export const GET: APIRoute = async ({ params, cookies }) => {
  const projectId = params.projectId;
  if (!projectId) return new Response(JSON.stringify({ error: "Project ID required" }), { status: 400 });

  const sessionData = await getSessionFromRequest(cookies);
  if (!sessionData) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const members = await ProjectMemberService.listMembers(projectId, sessionData.user._id.toString());
    return new Response(JSON.stringify({ ok: true, data: members }), { status: 200 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    return new Response(JSON.stringify({ error: error.message || "Failed to list members" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const projectId = params.projectId;
  if (!projectId) return new Response(JSON.stringify({ error: "Project ID required" }), { status: 400 });

  const sessionData = await getSessionFromRequest(cookies);
  if (!sessionData) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    await ProjectMemberService.addMemberByEmail(projectId, email, sessionData.user._id.toString());
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error: any) {
    if (error.message.includes("Only owners")) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    if (error.message === 'User not found') return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    return new Response(JSON.stringify({ error: error.message || "Failed to add member" }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const projectId = params.projectId;
  if (!projectId) return new Response(JSON.stringify({ error: "Project ID required" }), { status: 400 });

  const sessionData = await getSessionFromRequest(cookies);
  if (!sessionData) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    await ProjectMemberService.removeMember(projectId, userId, sessionData.user._id.toString());
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error: any) {
    if (error.message.includes("Only owners")) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    return new Response(JSON.stringify({ error: error.message || "Failed to remove member" }), { status: 500 });
  }
};
