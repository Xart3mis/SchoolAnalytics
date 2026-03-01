import type { UserRole } from "@school-analytics/db/client";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import {
  ACTIVE_ORGANIZATION_COOKIE_NAME,
  SESSION_TTL_DAYS,
} from "@/lib/auth/constants";
import { prisma } from "@/lib/prisma";

export type OrganizationOption = {
  id: string;
  name: string;
  abbreviation: string;
};

export type TenantContext = {
  organizations: OrganizationOption[];
  activeOrganization: OrganizationOption | null;
  activeOrganizationId: string | null;
  canSwitchOrganizations: boolean;
};

type SessionUserLike = {
  role: UserRole;
  organizationId: string | null;
};

async function getAccessibleOrganizations(user: SessionUserLike) {
  if (user.role === "ADMIN") {
    return prisma.organization.findMany({
      select: { id: true, name: true, abbreviation: true },
      orderBy: [{ name: "asc" }, { createdAt: "asc" }],
    });
  }

  if (!user.organizationId) {
    return [];
  }

  return prisma.organization.findMany({
    where: { id: user.organizationId },
    select: { id: true, name: true, abbreviation: true },
    take: 1,
  });
}

function pickActiveOrganization(
  organizations: OrganizationOption[],
  preferredOrganizationId?: string,
) {
  if (organizations.length === 0) return null;
  if (preferredOrganizationId) {
    const preferred = organizations.find(
      (organization) => organization.id === preferredOrganizationId,
    );
    if (preferred) return preferred;
  }
  return organizations[0] ?? null;
}

export async function resolveTenantContextForUser(
  user: SessionUserLike,
  preferredOrganizationId?: string,
): Promise<TenantContext> {
  const organizations = await getAccessibleOrganizations(user);
  const activeOrganization = pickActiveOrganization(
    organizations,
    preferredOrganizationId,
  );

  return {
    organizations,
    activeOrganization,
    activeOrganizationId: activeOrganization?.id ?? null,
    canSwitchOrganizations: user.role === "ADMIN" && organizations.length > 1,
  };
}

export async function resolveTenantContextForSession(
  session: { user: SessionUserLike },
  preferredOrganizationId?: string,
): Promise<TenantContext> {
  const cookieStore = await cookies();
  const cookieOrganizationId = cookieStore.get(
    ACTIVE_ORGANIZATION_COOKIE_NAME,
  )?.value;
  const requestedOrganizationId =
    preferredOrganizationId ?? cookieOrganizationId;
  return resolveTenantContextForUser(session.user, requestedOrganizationId);
}

export function applyActiveOrganizationCookie(
  response: NextResponse,
  organizationId: string | null,
) {
  if (!organizationId) {
    response.cookies.set(ACTIVE_ORGANIZATION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });
    return;
  }

  response.cookies.set(ACTIVE_ORGANIZATION_COOKIE_NAME, organizationId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
    path: "/",
  });
}
