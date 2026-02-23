import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import {
  applyActiveOrganizationCookie,
  resolveTenantContextForSession,
} from "@/lib/auth/organization";
import { getSessionFromCookies } from "@/lib/auth/session";

const updateSchema = z.object({
  organizationId: z.string().trim().min(1),
});

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      throw new ApiError("Unauthorized.", 401);
    }

    const tenant = await resolveTenantContextForSession(session);
    if (!tenant.activeOrganizationId) {
      throw new ApiError("No school context available.", 409);
    }

    const response = NextResponse.json({
      organizations: tenant.organizations,
      activeOrganization: tenant.activeOrganization,
      canSwitchOrganizations: tenant.canSwitchOrganizations,
    });
    applyActiveOrganizationCookie(response, tenant.activeOrganizationId);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      throw new ApiError("Unauthorized.", 401);
    }

    const payload = updateSchema.parse(await request.json());
    const tenant = await resolveTenantContextForSession(session, payload.organizationId);
    if (!tenant.activeOrganizationId || tenant.activeOrganizationId !== payload.organizationId) {
      throw new ApiError("Organization access denied.", 403);
    }

    const response = NextResponse.json({
      ok: true,
      activeOrganization: tenant.activeOrganization,
      organizations: tenant.organizations,
      canSwitchOrganizations: tenant.canSwitchOrganizations,
    });
    applyActiveOrganizationCookie(response, tenant.activeOrganizationId);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
