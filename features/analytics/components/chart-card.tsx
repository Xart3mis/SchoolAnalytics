import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card className="h-full transition-transform duration-300 ease-out hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-[0.2em] text-slate-500">
          {title}
        </CardTitle>
        {subtitle ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
