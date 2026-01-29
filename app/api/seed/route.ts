import { NextResponse } from "next/server";

import { getMockDashboardData } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const data = getMockDashboardData();

  await prisma.student.deleteMany();
  await prisma.student.createMany({
    data: data.atRisk.map((student) => ({
      fullName: student.name,
      gradeLevel: student.gradeLevel,
      gpa: student.gpa,
      attendanceRate: student.attendanceRate,
      outstandingFees: student.outstandingFees,
    })),
  });

  return NextResponse.json({ status: "ok", inserted: data.atRisk.length });
}
