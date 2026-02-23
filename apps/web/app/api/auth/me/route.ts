import { NextResponse } from "next/server";

import {
  applyActiveOrganizationCookie,
  resolveTenantContextForSession,
} from "@/lib/auth/organization";
import { getSessionFromCookies } from "@/lib/auth/session";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const tenant = await resolveTenantContextForSession(session);

  const response = NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      displayName: session.user.displayName,
      organizationId: session.user.organizationId,
    },
    organizations: tenant.organizations,
    activeOrganization: tenant.activeOrganization,
    canSwitchOrganizations: tenant.canSwitchOrganizations,
  });
  applyActiveOrganizationCookie(response, tenant.activeOrganizationId);
  return response;
}
