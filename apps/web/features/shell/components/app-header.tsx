"use client";

import { Command as CommandMenu } from "cmdk";
import { ChevronDown, Command as CommandIcon, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemedSelect } from "@/components/ui/themed-select";
import { useUiStore } from "@/hooks/use-ui-store";
import { useTheme } from "next-themes";
import * as React from "react";

type SearchResults = {
  students: Array<{ id: string; name: string; email: string }>;
  classes: Array<{ id: string; name: string; gradeLevel: string | null; academicYear: string | null }>;
};

type AcademicYearOption = {
  id: string;
  name: string;
  terms: Array<{ id: string; name: string }>;
};

export function AppHeader() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState<{ displayName?: string; email?: string; role?: string } | null>(null);
  const { toggleSidebar } = useUiStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(() => searchParams.get("q") ?? "");
  const [results, setResults] = React.useState<SearchResults>({ students: [], classes: [] });
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [academicYears, setAcademicYears] = React.useState<AcademicYearOption[]>([]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    async function loadUser() {
      const response = await fetch("/api/auth/me");
      if (!response.ok) return;
      const data = await response.json();
      setUser(data.user);
    }

    loadUser();
  }, []);

  React.useEffect(() => {
    async function loadAcademicYears() {
      const response = await fetch("/api/academic-years");
      if (!response.ok) return;
      const data = await response.json();
      setAcademicYears(data.years ?? []);
    }

    loadAcademicYears();
  }, []);

  const trimmedQuery = query.trim();
  const totalResults = results.students.length + results.classes.length;
  const selectedYearIdParam = searchParams.get("year") ?? "";
  const selectedTermId = searchParams.get("term") ?? "";
  const selectedYear = selectedYearIdParam
    ? academicYears.find((year) => year.id === selectedYearIdParam)
    : academicYears.find((year) => year.terms.some((term) => term.id === selectedTermId)) ??
    academicYears[0];
  const selectedTerm = selectedTermId
    ? selectedYear?.terms.find((term) => term.id === selectedTermId)
    : selectedYear?.terms[selectedYear.terms.length - 1] ?? undefined;
  const selectedYearLabel = selectedYear ? `${selectedYear.name}` : "Select year";
  const selectedTermLabel = selectedTerm?.name ?? "T-";
  const yearTermQuery = new URLSearchParams();
  if (selectedYear?.id) yearTermQuery.set("year", selectedYear.id);
  if (selectedTerm?.id) yearTermQuery.set("term", selectedTerm.id);
  const yearTermQueryString = yearTermQuery.toString();
  const yearTermSuffix = yearTermQueryString ? `?${yearTermQueryString}` : "";

  React.useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") return;
      if (!(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen(true);
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleShortcut);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  React.useEffect(() => {
    if (trimmedQuery.length < 2) {
      setResults({ students: [], classes: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const searchQuery = new URLSearchParams();
        searchQuery.set("q", trimmedQuery);
        if (selectedTerm?.id) {
          searchQuery.set("term", selectedTerm.id);
        }
        if (selectedYear?.id) {
          searchQuery.set("year", selectedYear.id);
        }
        const response = await fetch(`/api/search?${searchQuery.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setResults({ students: [], classes: [] });
          setOpen(true);
          return;
        }
        const data = (await response.json()) as SearchResults;
        setResults(data);
        setOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults({ students: [], classes: [] });
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [selectedTerm?.id, selectedYear?.id, trimmedQuery]);

  React.useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";
    setQuery((current) => (current === urlQuery ? current : urlQuery));
  }, [searchParams]);

  const handleSelectYear = React.useCallback(
    (yearId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("year", yearId);
      params.delete("term");
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
      setMenuOpen(false);
    },
    [pathname, router, searchParams]
  );

  const handleSelectTrimester = React.useCallback(
    (termId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedYear?.id) {
        params.set("year", selectedYear.id);
      }
      if (termId) {
        params.set("term", termId);
      } else {
        params.delete("term");
      }
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
      setMenuOpen(false);
    },
    [pathname, router, searchParams, selectedYear?.id]
  );

  React.useEffect(() => {
    if (academicYears.length === 0 || selectedYearIdParam || selectedTermId) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", academicYears[0].id);
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [academicYears, pathname, router, searchParams, selectedTermId, selectedYearIdParam]);

  const currentTheme = resolvedTheme ?? theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  return (
    <header className="sticky top-0 z-20 grid grid-cols-1 items-center gap-3 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 shadow-[0_12px_30px_-24px_rgba(28,36,48,0.35)] dark:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.7)] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:px-6 sm:py-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)] sm:text-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>
        School Analytics
      </div>
      <div className="flex items-center justify-center sm:px-2">
        <div ref={searchRef} className="relative w-full max-w-none sm:max-w-xl">
          <CommandMenu
            shouldFilter={false}
            className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
            <CommandMenu.Input
              ref={searchInputRef}
              placeholder="Search students or classes..."
              value={query}
              onValueChange={setQuery}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpen(false);
                }
              }}
              className="h-10 w-full rounded-md bg-transparent pl-10 pr-12 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            />
            {open ? (
              <CommandMenu.List className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-[0_18px_40px_-28px_rgba(10,20,40,0.55)]">
                {isLoading ? (
                  <div className="px-3 py-2 text-xs text-[color:var(--text-muted)]">Searching...</div>
                ) : trimmedQuery.length < 2 ? (
                  <div className="px-3 py-2 text-xs text-[color:var(--text-muted)]">
                    Type at least 2 characters to search.
                  </div>
                ) : totalResults === 0 ? (
                  <CommandMenu.Empty className="px-3 py-2 text-xs text-[color:var(--text-muted)]">
                    No matches for &quot;{trimmedQuery}&quot;.
                  </CommandMenu.Empty>
                ) : (
                  <div className="flex flex-col gap-3">
                    <CommandMenu.Group heading="Students">
                      <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                        Students
                      </div>
                      <div className="flex flex-col">
                        {results.students.map((student) => (
                          <CommandMenu.Item
                            key={student.id}
                            value={`${student.name} ${student.email}`}
                            onSelect={() => {
                              router.push(`/students/${student.id}${yearTermSuffix}`);
                              setOpen(false);
                            }}
                            className="rounded-lg px-2 py-2 text-sm text-[color:var(--text)] transition-colors data-[selected=true]:bg-[color:var(--surface-strong)]"
                          >
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-[color:var(--text-muted)]">{student.email}</div>
                          </CommandMenu.Item>
                        ))}
                      </div>
                    </CommandMenu.Group>
                    <CommandMenu.Group heading="Classes">
                      <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                        Classes
                      </div>
                      <div className="flex flex-col">
                        {results.classes.map((cls) => (
                          <CommandMenu.Item
                            key={cls.id}
                            value={`${cls.name} ${cls.gradeLevel ?? ""} ${cls.academicYear ?? ""}`}
                            onSelect={() => {
                              router.push(`/classes/${cls.id}${yearTermSuffix}`);
                              setOpen(false);
                            }}
                            className="rounded-lg px-2 py-2 text-sm text-[color:var(--text)] transition-colors data-[selected=true]:bg-[color:var(--surface-strong)]"
                          >
                            <div className="font-medium">{cls.name}</div>
                            <div className="text-xs text-[color:var(--text-muted)]">
                              {[cls.gradeLevel, cls.academicYear].filter(Boolean).join(" • ")}
                            </div>
                          </CommandMenu.Item>
                        ))}
                      </div>
                    </CommandMenu.Group>
                  </div>
                )}
              </CommandMenu.List>
            ) : null}
          </CommandMenu>
          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 text-xs text-[color:var(--text-muted)] md:flex">
            <CommandIcon className="h-3 w-3" />K
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(nextTheme)}
          aria-label="Toggle theme"
          disabled={!mounted}
        >
          {mounted && currentTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : mounted ? (
            <Moon className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4" />
          )}
        </Button>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-1 text-xs font-medium text-[color:var(--text)]"
          >
            <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
            <span>{user?.displayName ?? user?.email ?? "User"}</span>
            {user?.role ? (
              <span className="rounded-full bg-[color:var(--surface)] px-2 py-0.5 text-[10px] uppercase text-[color:var(--accent)]">
                {user.role}
              </span>
            ) : null}
            <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-muted)] sm:inline">
              {selectedYearLabel} · {selectedTermLabel}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[color:var(--text-muted)]" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-[0_18px_40px_-28px_rgba(10,20,40,0.55)]">
              <div className="px-2 py-2">
                <div className="text-sm font-semibold text-[color:var(--text)]">
                  {user?.displayName ?? "User"}
                </div>
                <div className="text-xs text-[color:var(--text-muted)]">{user?.email ?? ""}</div>
              </div>
              <div className="border-t border-[color:var(--border)] px-2 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                  Academic Year
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  {academicYears.length === 0 ? (
                    <div className="px-2 py-2 text-xs text-[color:var(--text-muted)]">
                      No years available.
                    </div>
                  ) : (
                    academicYears.map((year) => {
                      const isSelected = selectedYear?.id === year.id;
                      return (
                        <button
                          key={year.id}
                          type="button"
                          onClick={() => handleSelectYear(year.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${isSelected
                            ? "bg-[color:var(--accent-2)] text-[color:var(--text)]"
                            : "text-[color:var(--text-muted)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--text)]"
                            }`}
                        >
                          <span>{year.name}</span>
                          {isSelected ? (
                            <span className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                              Selected
                            </span>
                          ) : null}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="border-t border-[color:var(--border)] px-2 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                  Trimester
                </div>
                <ThemedSelect
                  value={selectedTermId || selectedTerm?.id || ""}
                  onChange={(event) => handleSelectTrimester(event.target.value)}
                  disabled={!selectedYear || selectedYear.terms.length === 0}
                  className="mt-2"
                >
                  {(selectedYear?.terms ?? []).map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.name}
                    </option>
                  ))}
                </ThemedSelect>
              </div>
              <div className="border-t border-[color:var(--border)] px-2 py-2">
                <div className="flex flex-col gap-2">
                  {user?.role === "ADMIN" ? (
                    <Link
                      href="/admin/users"
                      className="flex items-center justify-between rounded-md border border-[color:var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text)] hover:bg-[color:var(--surface-strong)]"
                    >
                      Admin Console
                    </Link>
                  ) : null}
                  <form action="/api/auth/logout" method="post" className="w-full">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-between rounded-md border border-[color:var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text)] hover:bg-[color:var(--surface-strong)]"
                    >
                      <span>Log out</span>
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
