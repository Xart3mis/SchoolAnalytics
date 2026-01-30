import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatTile {
  id: string;
  label: string;
  value: string;
  helper?: string;
}

export function StatTiles({ items }: { items: StatTile[] }) {
  return (
    <section className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.id} className="transition-transform duration-300 ease-out hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {item.value}
            </div>
            {item.helper ? (
              <div className="text-xs text-slate-500">{item.helper}</div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
