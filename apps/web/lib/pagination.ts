interface PaginationStateParams {
  page: number;
  pageSize: number;
  totalCount: number;
  queryString?: string;
  basePath?: string;
}

interface BuildPaginatedHrefParams {
  targetPage: number;
  queryString?: string;
  basePath?: string;
}

export function buildPaginatedHref({
  targetPage,
  queryString,
  basePath = "/",
}: BuildPaginatedHrefParams) {
  const params = new URLSearchParams(queryString ?? "");
  params.set("page", String(targetPage));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function getPaginationState({
  page,
  pageSize,
  totalCount,
  queryString,
  basePath = "/",
}: PaginationStateParams) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const prevHref = buildPaginatedHref({ targetPage: page - 1, queryString, basePath });
  const nextHref = buildPaginatedHref({ targetPage: page + 1, queryString, basePath });

  return {
    totalPages,
    canPrev,
    canNext,
    prevHref,
    nextHref,
  };
}
