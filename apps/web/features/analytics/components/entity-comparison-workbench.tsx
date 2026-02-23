"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemedSelect } from "@/components/ui/themed-select";
import type { ComparableEntity, ComparableEntityType } from "@/lib/analytics/entity-comparison";

type GroupSummary = {
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
  averageScore: number;
  cohortSize: number;
  entityCount: number;
};

type GroupState = {
  type: "ALL" | ComparableEntityType;
  query: string;
  selectedKeys: string[];
};

type WeightMode = "WEIGHTED" | "UNWEIGHTED";

type ComparisonPreset = {
  id: string;
  name: string;
  left: GroupState;
  right: GroupState;
  weightMode: WeightMode;
};

interface EntityComparisonWorkbenchProps {
  entities: ComparableEntity[];
  activeTermLabel: string;
}

const PRESETS_STORAGE_KEY = "comparison_presets_v1";

function typeLabel(type: ComparableEntityType) {
  if (type === "GRADE") return "Level";
  if (type === "CLASS") return "Class";
  return "Student";
}

function aggregate(items: ComparableEntity[], weightMode: WeightMode): GroupSummary | null {
  if (items.length === 0) {
    return null;
  }

  const totalWeight =
    weightMode === "WEIGHTED"
      ? items.reduce((sum, item) => sum + Math.max(1, item.cohortSize), 0)
      : items.length;
  if (totalWeight === 0) {
    return null;
  }

  const weighted = (selector: (item: ComparableEntity) => number) =>
    items.reduce((sum, item) => {
      const weight = weightMode === "WEIGHTED" ? Math.max(1, item.cohortSize) : 1;
      return sum + selector(item) * weight;
    }, 0) / totalWeight;

  return {
    criterionA: weighted((item) => item.criterionA),
    criterionB: weighted((item) => item.criterionB),
    criterionC: weighted((item) => item.criterionC),
    criterionD: weighted((item) => item.criterionD),
    averageScore: weighted((item) => item.averageScore),
    cohortSize: items.reduce((sum, item) => sum + Math.max(1, item.cohortSize), 0),
    entityCount: items.length,
  };
}

function Delta({ value }: { value: number }) {
  const sign = value > 0 ? "+" : "";
  const color =
    value > 0
      ? "text-[color:var(--risk-low-text)]"
      : value < 0
        ? "text-[color:var(--risk-high-text)]"
        : "text-[color:var(--text-muted)]";
  return <span className={`font-semibold ${color}`}>{`${sign}${value.toFixed(2)}`}</span>;
}

function SelectionPanel({
  title,
  state,
  entities,
  onUpdate,
}: {
  title: string;
  state: GroupState;
  entities: ComparableEntity[];
  onUpdate: (next: GroupState) => void;
}) {
  const filtered = React.useMemo(() => {
    const query = state.query.trim().toLowerCase();
    return entities
      .filter((entity) => !state.selectedKeys.includes(entity.key))
      .filter((entity) => (state.type === "ALL" ? true : entity.type === state.type))
      .filter((entity) => {
        if (!query) return true;
        return (
          entity.label.toLowerCase().includes(query) ||
          entity.sublabel?.toLowerCase().includes(query) ||
          typeLabel(entity.type).toLowerCase().includes(query)
        );
      })
      .slice(0, 12);
  }, [entities, state.query, state.selectedKeys, state.type]);

  const selected = React.useMemo(
    () => state.selectedKeys.map((key) => entities.find((entity) => entity.key === key)).filter(Boolean) as ComparableEntity[],
    [entities, state.selectedKeys]
  );

  return (
    <Card className="h-full transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)]">
          <ThemedSelect
            value={state.type}
            onChange={(event) => onUpdate({ ...state, type: event.target.value as GroupState["type"] })}
          >
            <option value="ALL">All entities</option>
            <option value="STUDENT">Students</option>
            <option value="CLASS">Classes</option>
            <option value="GRADE">Levels</option>
          </ThemedSelect>
          <Input
            value={state.query}
            onChange={(event) => onUpdate({ ...state, query: event.target.value })}
            placeholder="Search by name"
          />
        </div>

        <div className="space-y-2 rounded border border-[color:var(--border)] p-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
            Selected ({selected.length})
          </div>
          {selected.length === 0 ? (
            <p className="text-xs text-[color:var(--text-muted)]">No entities selected yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selected.map((entity) => (
                <button
                  key={entity.key}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...state,
                      selectedKeys: state.selectedKeys.filter((key) => key !== entity.key),
                    })
                  }
                  className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-2 py-1 text-xs text-[color:var(--text)]"
                >
                  {entity.label} ×
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 rounded border border-[color:var(--border)] p-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
            Add entities
          </div>
          {filtered.length === 0 ? (
            <p className="text-xs text-[color:var(--text-muted)]">No matching entities.</p>
          ) : (
            <div className="space-y-1">
              {filtered.map((entity) => (
                <button
                  key={entity.key}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...state,
                      selectedKeys: [...state.selectedKeys, entity.key],
                    })
                  }
                  className="flex w-full items-center justify-between rounded border border-transparent px-2 py-1 text-left text-xs hover:border-[color:var(--border)] hover:bg-[color:var(--surface-strong)]"
                >
                  <span className="truncate text-[color:var(--text)]">{entity.label}</span>
                  <span className="ml-2 text-[10px] uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
                    {typeLabel(entity.type)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function EntityComparisonWorkbench({ entities, activeTermLabel }: EntityComparisonWorkbenchProps) {
  const [left, setLeft] = React.useState<GroupState>({ type: "ALL", query: "", selectedKeys: [] });
  const [right, setRight] = React.useState<GroupState>({ type: "ALL", query: "", selectedKeys: [] });
  const [weightMode, setWeightMode] = React.useState<WeightMode>("WEIGHTED");
  const [presetName, setPresetName] = React.useState("");
  const [presets, setPresets] = React.useState<ComparisonPreset[]>([]);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PRESETS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setPresets(parsed);
      }
    } catch {
      setPresets([]);
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  React.useEffect(() => {
    if (entities.length === 0) return;
    setLeft((current) =>
      current.selectedKeys.length > 0 ? current : { ...current, selectedKeys: [entities[0].key] }
    );
    setRight((current) =>
      current.selectedKeys.length > 0
        ? current
        : { ...current, selectedKeys: [entities[1]?.key ?? entities[0].key] }
    );
  }, [entities]);

  const leftEntities = React.useMemo(
    () => left.selectedKeys.map((key) => entities.find((entity) => entity.key === key)).filter(Boolean) as ComparableEntity[],
    [entities, left.selectedKeys]
  );
  const rightEntities = React.useMemo(
    () => right.selectedKeys.map((key) => entities.find((entity) => entity.key === key)).filter(Boolean) as ComparableEntity[],
    [entities, right.selectedKeys]
  );

  const leftSummary = React.useMemo(() => aggregate(leftEntities, weightMode), [leftEntities, weightMode]);
  const rightSummary = React.useMemo(() => aggregate(rightEntities, weightMode), [rightEntities, weightMode]);

  const savePreset = React.useCallback(() => {
    const name = presetName.trim();
    if (!name) return;
    const nextPreset: ComparisonPreset = {
      id: uuidv4(),
      name,
      left,
      right,
      weightMode,
    };
    setPresets((current) => [nextPreset, ...current]);
    setPresetName("");
  }, [left, presetName, right, weightMode]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
            Cross-Entity Comparator
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[color:var(--text-muted)]">
          Compare any mix of students, classes, and levels for {activeTermLabel}. Add any number of entities on either side and review weighted criterion deltas.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
            Presets and Weighting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ThemedSelect
              value={weightMode}
              onChange={(event) => setWeightMode(event.target.value as WeightMode)}
              className="w-auto"
            >
              <option value="WEIGHTED">Weighted by cohort size</option>
              <option value="UNWEIGHTED">Equal entity weighting</option>
            </ThemedSelect>
            <Input
              value={presetName}
              onChange={(event) => setPresetName(event.target.value)}
              placeholder="Preset name"
              className="max-w-xs"
            />
            <Button type="button" onClick={savePreset} disabled={!presetName.trim()}>
              Save preset
            </Button>
          </div>
          {presets.length > 0 ? (
            <div className="space-y-2">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-[color:var(--border)] p-2"
                >
                  <div className="text-xs text-[color:var(--text)]">
                    <span className="font-semibold">{preset.name}</span>
                    <span className="ml-2 text-[color:var(--text-muted)]">
                      {preset.left.selectedKeys.length} vs {preset.right.selectedKeys.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLeft(preset.left);
                        setRight(preset.right);
                        setWeightMode(preset.weightMode);
                      }}
                    >
                      Apply
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPresets((current) => current.filter((item) => item.id !== preset.id))
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[color:var(--text-muted)]">No saved presets yet.</p>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        <SelectionPanel title="Group A" state={left} entities={entities} onUpdate={setLeft} />
        <SelectionPanel title="Group B" state={right} entities={entities} onUpdate={setRight} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">
            Group Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!leftSummary || !rightSummary ? (
            <div className="py-3 text-xs text-[color:var(--text-muted)]">
              Select at least one entity in each group.
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-2 border-b border-[color:var(--border)] pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                <div>Metric</div>
                <div>Group A</div>
                <div>Group B</div>
                <div>Delta</div>
              </div>
              {[
                ["Criterion A", leftSummary.criterionA, rightSummary.criterionA],
                ["Criterion B", leftSummary.criterionB, rightSummary.criterionB],
                ["Criterion C", leftSummary.criterionC, rightSummary.criterionC],
                ["Criterion D", leftSummary.criterionD, rightSummary.criterionD],
                ["Overall", leftSummary.averageScore, rightSummary.averageScore],
              ].map(([label, leftValue, rightValue]) => (
                <div key={label as string} className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2">
                  <span className="text-[color:var(--text)]">{label as string}</span>
                  <span className="font-semibold text-[color:var(--text)]">{Number(leftValue).toFixed(2)}</span>
                  <span className="font-semibold text-[color:var(--text)]">{Number(rightValue).toFixed(2)}</span>
                  <Delta value={Number(leftValue) - Number(rightValue)} />
                </div>
              ))}
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 border-t border-[color:var(--border)] pt-2">
                <span className="text-[color:var(--text)]">Entity Count</span>
                <span className="font-semibold text-[color:var(--text)]">{leftSummary.entityCount}</span>
                <span className="font-semibold text-[color:var(--text)]">{rightSummary.entityCount}</span>
                <span className="text-[color:var(--text-muted)]">{leftSummary.entityCount - rightSummary.entityCount}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2">
                <span className="text-[color:var(--text)]">Total Students</span>
                <span className="font-semibold text-[color:var(--text)]">{leftSummary.cohortSize}</span>
                <span className="font-semibold text-[color:var(--text)]">{rightSummary.cohortSize}</span>
                <span className="text-[color:var(--text-muted)]">{leftSummary.cohortSize - rightSummary.cohortSize}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
