import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card className="h-full transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
          {title}
        </CardTitle>
        {subtitle ? (
          <p className="text-xs text-[color:var(--text-muted)]">{subtitle}</p>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
