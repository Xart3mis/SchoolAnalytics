export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
}

export interface AttendancePoint {
  date: string;
  attendanceRate: number;
}

export interface DemographicSlice {
  group: string;
  value: number;
}

export interface AtRiskStudent {
  id: string;
  name: string;
  gradeLevel: string;
  gpa: number;
  attendanceRate: number;
  riskLevel: "High" | "Medium" | "Low";
  outstandingFees: number;
  avatarUrl: string;
}

export interface DashboardData {
  kpis: KpiMetric[];
  attendanceTrend: AttendancePoint[];
  demographics: DemographicSlice[];
  atRisk: AtRiskStudent[];
}

export function getMockDashboardData(): DashboardData {
  return {
    kpis: [
      {
        id: "students",
        label: "Total Students",
        value: "1,284",
        delta: "+2.4% QoQ",
      },
      {
        id: "attendance",
        label: "Attendance Rate",
        value: "94.7%",
        delta: "+0.6% MoM",
      },
      {
        id: "gpa",
        label: "Average GPA",
        value: "3.42",
        delta: "-0.03 vs last term",
      },
      {
        id: "fees",
        label: "Outstanding Fees",
        value: "$182,400",
        delta: "12% overdue",
      },
    ],
    attendanceTrend: [
      { date: "Aug", attendanceRate: 95.1 },
      { date: "Sep", attendanceRate: 94.4 },
      { date: "Oct", attendanceRate: 95.8 },
      { date: "Nov", attendanceRate: 93.9 },
      { date: "Dec", attendanceRate: 94.2 },
      { date: "Jan", attendanceRate: 95.3 },
      { date: "Feb", attendanceRate: 94.7 },
    ],
    demographics: [
      { group: "Grade 9", value: 24 },
      { group: "Grade 10", value: 26 },
      { group: "Grade 11", value: 25 },
      { group: "Grade 12", value: 25 },
    ],
    atRisk: Array.from({ length: 5 }).map((_, index) => ({
      id: `student-${index + 1}`,
      name: [
        "Avery Chen",
        "Jordan Patel",
        "Riley Morgan",
        "Samira Ali",
        "Evan Brooks",
      ][index % 5],
      gradeLevel: `Grade ${9 + (index % 4)}`,
      gpa: Number((2.1 + (index % 5) * 0.3).toFixed(2)),
      attendanceRate: Number((88 + (index % 7)).toFixed(1)),
      riskLevel: index % 3 === 0 ? "High" : index % 3 === 1 ? "Medium" : "Low",
      outstandingFees: 1200 + (index % 5) * 350,
      avatarUrl: `https://i.pravatar.cc/80?img=${(index % 70) + 1}`,
    })),
  };
}
