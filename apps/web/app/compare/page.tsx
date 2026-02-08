import { EntityComparisonWorkbench } from "@/features/analytics/components/entity-comparison-workbench";
import { getComparableEntitiesForTerm } from "@/lib/analytics/entity-comparison";
import { resolveSelectedTerm } from "@/lib/analytics/terms";
import { requireSession } from "@/lib/auth/guards";

interface ComparePageProps {
  searchParams?: Promise<{
    term?: string;
    year?: string;
  }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  await requireSession();

  const resolvedSearchParams = await searchParams;
  const term = await resolveSelectedTerm({
    yearId: resolvedSearchParams?.year,
    termId: resolvedSearchParams?.term,
  });

  const entities = term ? await getComparableEntitiesForTerm(term.id) : [];
  const activeTermLabel = term ? `${term.academicYear.name} ${term.name}` : "No term data";

  return <EntityComparisonWorkbench entities={entities} activeTermLabel={activeTermLabel} />;
}
