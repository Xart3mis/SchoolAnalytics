import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatTile {
  id: string;
  label: string;
  value: string;
  helper?: string;
}

export function StatTiles({ items }: { items: StatTile[] }) {
  return (
    <section className="stagger grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.id} className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold text-[color:var(--text)]">
              {item.value}
            </div>
            {item.helper ? (
              <div className="text-xs text-[color:var(--text-muted)]">{item.helper}</div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
